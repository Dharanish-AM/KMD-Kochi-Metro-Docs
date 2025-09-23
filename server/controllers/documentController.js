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

        // 🔹 Save document in MongoDB
        const document = new Document({
          uploadedBy: userId,
          department: fields.department || user.department,
          fileUrl: destPath,
          title: fields.title || file.originalFilename,
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

exports.RAGSearchDocument = async (req, res) => {
  try {
    const { query, topK = 5 } = req.query;

    console.log("🔹 RAG Search initiated.");
    console.log("Query received:", query);
    console.log("Top K:", topK);

    if (!query || query.trim() === "") {
      console.warn("⚠️ No query provided.");
      return res.status(400).json({ error: "Search query is required" });
    }

    // Step 1: Get embedding vector from AI server
    console.log("🔹 Fetching embedding vector from AI server...");
    let embeddingVector;
    try {
      const aiResponse = await axios.post(
        `${process.env.AI_SERVER_URL}/rag_search`,
        { query },
        { timeout: 60000 }
      );
      console.log("AI server response:", aiResponse.data);

      embeddingVector = aiResponse.data.embedding_vector;
      if (!embeddingVector || !Array.isArray(embeddingVector)) {
        console.error(
          "❌ Invalid embedding vector returned by AI server:",
          embeddingVector
        );
        return res
          .status(500)
          .json({ error: "AI server did not return a valid embedding vector" });
      }
    } catch (err) {
      console.error(
        "❌ Failed to get embedding vector from AI server:",
        err.message
      );
      return res
        .status(500)
        .json({ error: "Failed to get embedding vector from AI server" });
    }

    // Step 2: Search in Qdrant
    console.log("🔹 Searching Qdrant collection 'documents'...");
    let qdrantResults = [];
    try {
      const searchResponse = await qdrant.search("documents", {
        vector: embeddingVector,
        limit: Number(topK),
        with_payload: true,
      });
      console.log("Raw Qdrant results:", searchResponse);
      qdrantResults = searchResponse || [];
    } catch (qErr) {
      console.error("❌ Failed to search Qdrant:", qErr.message);
      return res
        .status(500)
        .json({
          error: "Failed to search documents in Qdrant",
          details: qErr.message,
        });
    }

    // Step 3: Filter by similarity threshold
    const SIMILARITY_THRESHOLD = 0.4;
    const documentIds = qdrantResults
      .filter((res) => res.score >= SIMILARITY_THRESHOLD)
      .map((res) => res.payload?.documentId)
      .filter(Boolean);

    console.log("Filtered document IDs (above threshold):", documentIds);

    if (documentIds.length === 0) {
      console.info(
        "⚠️ No relevant documents found above similarity threshold."
      );
      return res
        .status(200)
        .json({ message: "No relevant documents found", query, results: [] });
    }

    // Step 4: Fetch full documents from MongoDB
    console.log("🔹 Fetching documents from MongoDB...");
    const documents = await Document.find({ _id: { $in: documentIds } })
      .populate("uploadedBy", "name email")
      .populate("department", "name");
    console.log("Fetched documents from MongoDB:", documents);

    // Step 5: Sort documents according to Qdrant search order
    const sortedDocuments = documentIds.map((id) =>
      documents.find((doc) => doc._id.toString() === id)
    );
    console.log("Sorted documents matching Qdrant order:", sortedDocuments);

    // Step 6: Return results
    return res.status(200).json({
      message: "RAG search completed successfully",
      query,
      results: sortedDocuments,
    });
  } catch (error) {
    console.error("❌ Internal RAG search error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDocumentById = async (req, res) => {};

exports.deleteDocument = async (req, res) => {};
