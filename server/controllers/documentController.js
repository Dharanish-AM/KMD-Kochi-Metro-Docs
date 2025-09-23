const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const Document = require("../models/Document");
const Employee = require("../models/User");
const Department = require("../models/Department");
const path = require("path");
const formidable = require("formidable");
const mongoose = require("mongoose");

exports.uploadDocument = async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  console.log(userId)

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

      // Flatten files object to find first valid file
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
        let aiData = {
          summary: "AI processing unavailable",
          classification: "Unclassified", 
          metadata: {},
          translated_text: null,
          detected_language: "unknown"
        };

        // Try to process with AI server if available
        if (process.env.AI_SERVER_URL) {
          try {
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
                timeout: 30000, // 30 seconds timeout
              }
            );

            aiData = aiResponse.data;
          } catch (aiError) {
            console.warn(`AI processing failed for user ${userId}:`, aiError.message);
            // Continue with default values
          }
        }

        const {
          summary,
          classification,
          metadata,
          translated_text,
          detected_language,
        } = aiData;

        const document = new Document({
          uploadedBy: userId,
          department: user.department, // Use user's department directly
          fileUrl: destPath,
          title: fields.title ? fields.title[0] : file.originalFilename, // Handle array format
          fileName: file.originalFilename,
          fileType: file.mimetype,
          fileSize: file.size,
          category: fields.category ? fields.category[0] : 'General', // Handle array format
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

        res.status(201).json({
          message: "Document uploaded and processed successfully",
          document,
          aiData: {
            summary,
            classification,
            metadata,
            translated_text,
            detected_language,
          },
        });
      } catch (error) {
        console.error(`User ${userId} - Processing error:`, error);
        
        // Clean up uploaded file on error
        try {
          if (fs.existsSync(destPath)) {
            fs.unlinkSync(destPath);
          }
        } catch (cleanupError) {
          console.error(`Failed to cleanup file ${destPath}:`, cleanupError);
        }

        if (error.response) {
          return res.status(500).json({
            error: "Error processing document with AI server",
            details: error.response.data,
          });
        }
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

exports.getDocumentById = async (req, res) => {};

exports.deleteDocument = async (req, res) => {};
