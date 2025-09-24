const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const Document = require("../models/Document");
const Employee = require("../models/User");
const Department = require("../models/Department");
const path = require("path");
const formidable = require("formidable");
const mongoose = require("mongoose");
const qdrant = require("../config/qdrantClient").client;
const { v4: uuidv4 } = require("uuid");

exports.uploadDocument = async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await Employee.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const department = await Department.findById(user.department);
    if (!department)
      return res.status(404).json({ error: "Department not found" });

    const uploadDir = path.resolve(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const form = new formidable.IncomingForm({
      multiples: false,
      maxFileSize: 50 * 1024 * 1024,
      uploadDir,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(`User ${userId} - Formidable error:`, err);
        return res.status(500).json({ error: "Error uploading document" });
      }

      const allFiles = Object.values(files).flat();
      const file = allFiles.find((f) => f && (f.filepath || f.path));

      if (!file) {
        console.warn(`User ${userId} - No valid document file provided.`);
        return res
          .status(400)
          .json({ error: "No valid document file provided" });
      }

      const originalFilePath = file.filepath || file.path;
      const safeName = (file.originalFilename || "document").replace(
        /[^a-zA-Z0-9_\-.]/g,
        "_"
      );
      const newFileName = `${Date.now()}_${safeName}`;
      const destPath = path.join(uploadDir, newFileName);

      try {
        fs.renameSync(originalFilePath, destPath);
      } catch (moveErr) {
        console.error(`User ${userId} - Error saving uploaded file:`, moveErr);
        return res.status(500).json({ error: "Error saving uploaded file" });
      }

      try {
        // 🔹 Send file to AI pipeline
        const formData = new FormData();
        formData.append(
          "file",
          fs.createReadStream(destPath),
          file.originalFilename
        );

        const aiResponse = await axios.post(
          `${process.env.AI_SERVER_URL}/process`,
          formData,
          {
            headers: formData.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          }
        );

        const {
          summary,
          classification,
          metadata,
          translated_text,
          detected_language,
          embedding_vector, // 👈 ensure AI server includes this
        } = aiResponse.data;

        const department = await Department.findOne({
          name: fields.classification,
        });
        if (!department) {
          console.warn(
            `User ${userId} - Invalid department ID in classification: ${fields.classification}`
          );
          return res.status(400).json({ error: "Invalid department ID" });
        }

        // 🔹 Save document in MongoDB
        const document = new Document({
          uploadedBy: userId,
          department: user.department, // Use user's department directly
          fileUrl: `/uploads/${newFileName}`,
          title: fields.title ? fields.title[0] : file.originalFilename, // Handle array format
          fileName: file.originalFilename,
          fileType: file.mimetype,
          fileSize: file.size,
          summary,
          classification,
          metadata,
          translated_text,
          detected_language,
        });

        await document.save();

        if (Array.isArray(department.documents)) {
          department.documents.push(document._id);
        } else {
          department.documents = [document._id];
        }
        await department.save();

        // 🔹 Store embeddings in Qdrant
        let embeddingsStored = true;
        if (embedding_vector && Array.isArray(embedding_vector)) {
          try {
            const qdrantId = uuidv4();
            await qdrant.upsert("documents", {
              points: [
                {
                  id: qdrantId, // Use UUID instead of raw ObjectId string
                  vector: embedding_vector,
                  payload: {
                    fileName: file.originalFilename,
                    department: department.name,
                    documentId: document._id.toString(),
                  },
                },
              ],
            });
            console.log(
              `Stored embeddings in Qdrant for document ${document._id}`
            );
          } catch (qErr) {
            embeddingsStored = false;
            console.error(`Failed to upsert embeddings into Qdrant:`, qErr);
          }
        }

        res.status(201).json({
          message: "Document uploaded, processed, and stored successfully",
          document,
          aiData: {
            summary,
            classification,
            metadata,
            translated_text,
            detected_language,
            embedding_vector,
          },
          embeddingsStored,
        });
      } catch (error) {
        if (error.response) {
          console.error(
            `User ${userId} - AI server error:`,
            error.response.data
          );
          return res.status(500).json({
            error: "Error processing document with AI server",
            details: error.response.data,
          });
        }
        console.error(`User ${userId} - Internal server error:`, error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  } catch (error) {
    console.error(`User ${userId} - Unexpected error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDocumentsByDepartment = async (req, res) => {
  try {
    const departmentId = req.params.departmentId;
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      console.warn(`Invalid departmentId provided: ${departmentId}`);
      return res.status(400).json({ error: "Invalid department ID" });
    }

    const documents = await Document.find({ department: departmentId })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    if (!documents || documents.length === 0) {
      console.info(`No documents found for departmentId: ${departmentId}`);
      return res.status(200).json({
        documents: [],
        message: "No documents found for this department",
      });
    }

    res.status(200).json({ documents });
  } catch (error) {
    console.error(
      `Error fetching documents for departmentId ${req.params.departmentId}:`,
      error
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const documentId = req.params.documentId;
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      console.warn(`Invalid documentId provided: ${documentId}`);
      return res.status(400).json({ error: "Invalid document ID" });
    }

    const document = await Document.findById(documentId)
      .populate("uploadedBy", "name email")
      .populate("department", "name");

    if (!document) {
      console.info(`No document found with ID: ${documentId}`);
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json({ document });
  } catch (error) {
    console.error(`Error fetching document with ID ${req.params.documentId}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDocumentsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.warn(`Invalid userId provided: ${userId}`);
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const documents = await Document.find({ uploadedBy: userId })
      .populate("uploadedBy", "name email")
      .populate("department", "name")
      .sort({ createdAt: -1 });

    if (!documents || documents.length === 0) {
      console.info(`No documents found for userId: ${userId}`);
      return res.status(200).json({
        documents: [],
        message: "No documents found for this user",
      });
    }

    res.status(200).json({ documents });
  } catch (error) {
    console.error(`Error fetching documents for userId ${req.params.userId}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const documentId = req.params.documentId;
    const userId = req.query.userId; // Get userId from query params

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - User ID required" });
    }

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      console.warn(`Invalid documentId provided: ${documentId}`);
      return res.status(400).json({ error: "Invalid document ID" });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Check if the user is the owner of the document
    if (document.uploadedBy.toString() !== userId) {
      return res.status(403).json({ error: "Forbidden - You can only delete your own documents" });
    }

    // Remove file from filesystem
    if (document.fileUrl) {
      // Handle both relative and absolute paths
      const filePath = document.fileUrl.startsWith('/uploads/') 
        ? path.join(__dirname, '..', document.fileUrl)
        : document.fileUrl;
      
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`File deleted: ${filePath}`);
        } catch (fileError) {
          console.error(`Error deleting file ${filePath}:`, fileError);
          // Continue with database deletion even if file deletion fails
        }
      }
    }

    // Remove document reference from department
    if (document.department) {
      await Department.findByIdAndUpdate(
        document.department,
        { $pull: { documents: documentId } }
      );
    }

    // Delete the document from database
    await Document.findByIdAndDelete(documentId);

    res.status(200).json({ 
      message: "Document deleted successfully",
      deletedDocument: {
        id: document._id,
        title: document.title,
        fileName: document.fileName
      }
    });
  } catch (error) {
    console.error(`Error deleting document with ID ${req.params.documentId}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ error: "Invalid document ID" });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Determine the actual file path
    let filePath;
    if (document.fileUrl.startsWith('/uploads/')) {
      // New format: relative path
      filePath = path.join(__dirname, '..', document.fileUrl);
    } else {
      // Old format: absolute path
      filePath = document.fileUrl;
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    // Set appropriate headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${document.fileName}"`);
    res.setHeader('Content-Type', document.fileType || 'application/octet-stream');

    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error downloading file' });
      }
    });

  } catch (error) {
    console.error(`Error downloading document with ID ${req.params.documentId}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.RAGSearchDocument = async (req, res) => {
};

exports.DocumentPreview = async (req, res) => {
};

exports.DownloadDocument = async (req, res) => {
};
