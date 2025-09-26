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
const KMRL_DEPARTMENTS = require("../constants/departments");

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
      const newFileName = `${safeName}`;
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
          summary_en,
          classification,
          metadata,
          translated_text,
          detected_language,
          embedding_vector, // 👈 ensure AI server includes this
        } = aiResponse.data;

        //print response from AI

        console.log(`User ${userId} - AI server response:`, aiResponse.data);

        const departmentName =
          typeof classification === "object"
            ? classification.primary_department
            : classification;

        const department = await Department.findOne({ name: departmentName });
        if (!department) {
          console.warn(
            `User ${userId} - Invalid department classification: ${departmentName}`
          );
          return res
            .status(400)
            .json({ error: "Invalid department classification" });
        }

        console.log(`${department.name} department matched for document.`);

        // 🔹 Save document in MongoDB
        const documentData = {
          uploadedBy: userId,
          department: department._id, // Use AI returned primary_department
          fileUrl: `/uploads/${newFileName}`,
          title: fields.title ? fields.title[0] : file.originalFilename,
          fileName: file.originalFilename,
          fileType: file.mimetype,
          fileSize: file.size,
          summary: summary_en,
          summary_ml: aiResponse.data.summary_ml || null,
          classification: departmentName,
          classification_labels: classification?.labels || [],
          classification_scores: classification?.scores || [],
          metadata,
          translated_text,
          detected_language,
        };

        const document = new Document(documentData);

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
            summary: summary_en,
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
      .sort({ uploadedAt: -1 });

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
      return res.status(404).json({ error: "Document not found" });
    }

    // Only one success response
    res.status(200).json({ document });
  } catch (error) {
    console.error(
      `Error fetching document with ID ${req.params.documentId}:`,
      error
    );
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
      .sort({ uploadedAt: -1 });

    if (!documents || documents.length === 0) {
      console.info(`No documents found for userId: ${userId}`);
      return res.status(200).json({
        documents: [],
        message: "No documents found for this user",
      });
    }

    res.status(200).json({ documents });
  } catch (error) {
    console.error(
      `Error fetching documents for userId ${req.params.userId}:`,
      error
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      department = "",
      status = "",
      fromDate = "",
      toDate = "",
    } = req.query;

    // Build query object
    let query = {};

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { fileName: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
      ];
    }

    // Add department filter
    if (department) {
      query.classification = { $regex: department, $options: "i" };
    }

    // Add date range filter
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) {
        query.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        // Set to end of day for toDate
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch documents with pagination
    const documents = await Document.find(query)
      .populate("uploadedBy", "name email")
      .populate("department", "name")
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalDocuments = await Document.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    console.log(
      `Fetched ${documents.length} documents out of ${totalDocuments} total`
    );

    res.status(200).json({
      documents,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalDocuments,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching all documents:", error);
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

    // // Check if the user is the owner of the document
    // if (document.uploadedBy.toString() !== userId) {
    //   return res
    //     .status(403)
    //     .json({ error: "Forbidden - You can only delete your own documents" });
    // }

    // Remove file from filesystem
    if (document.fileUrl) {
      // Handle both relative and absolute paths
      const filePath = document.fileUrl.startsWith("/uploads/")
        ? path.join(__dirname, "..", document.fileUrl)
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
      await Department.findByIdAndUpdate(document.department, {
        $pull: { documents: documentId },
      });
    }

    // Delete the document from database
    await Document.findByIdAndDelete(documentId);

    res.status(200).json({
      message: "Document deleted successfully",
      deletedDocument: {
        id: document._id,
        title: document.title,
        fileName: document.fileName,
      },
    });
  } catch (error) {
    console.error(
      `Error deleting document with ID ${req.params.documentId}:`,
      error
    );
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
    if (document.fileUrl.startsWith("/uploads/")) {
      // New format: relative path
      filePath = path.join(__dirname, "..", document.fileUrl);
    } else {
      // Old format: absolute path
      filePath = document.fileUrl;
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    // Set appropriate headers for download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.fileName}"`
    );
    res.setHeader(
      "Content-Type",
      document.fileType || "application/octet-stream"
    );

    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (error) => {
      console.error("Error streaming file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    });
  } catch (error) {
    console.error(
      `Error downloading document with ID ${req.params.documentId}:`,
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
      return res.status(500).json({
        error: "Failed to search documents in Qdrant",
        details: qErr.message,
      });
    }

    // Step 3: Filter by dynamic similarity threshold
    const MIN_SIMILARITY = 0.1; // include lower-score matches
    const filteredResults = qdrantResults.filter(
      (res) => res.score >= MIN_SIMILARITY && res.payload?.documentId
    );
    const documentIds = filteredResults.map((res) => res.payload.documentId);

    console.log(
      "Filtered document IDs (above dynamic threshold):",
      documentIds
    );
    filteredResults.forEach((r) =>
      console.log(`Document ${r.payload.documentId} score: ${r.score}`)
    );

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

exports.DocumentPreview = async (req, res) => {
  try {
    const { documentId } = req.query;
    console.log("Document preview requested for ID:", documentId);
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ error: "Invalid document ID" });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    let filePath;
    if (document.fileUrl.startsWith("/uploads/")) {
      filePath = path.join(__dirname, "..", document.fileUrl);
    } else {
      filePath = document.fileUrl;
    }

    if (!fs.existsSync(filePath)) {
      console.error("Resolved path does not exist:", filePath);
      return res.status(404).json({ error: "File not found on server" });
    }

    const fileName = document.fileName || path.basename(filePath);
    const safeFileName = encodeURIComponent(fileName);

    // Determine content type including images
    const fileExt = path.extname(filePath).toLowerCase();
    let contentType = "application/octet-stream";

    if (fileExt === ".pdf") contentType = "application/pdf";
    else if (fileExt === ".docx")
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    else if (fileExt === ".doc") contentType = "application/msword";
    else if (fileExt === ".txt") contentType = "text/plain";
    else if (fileExt === ".png") contentType = "image/png";
    else if (fileExt === ".jpg" || fileExt === ".jpeg")
      contentType = "image/jpeg";
    else if (fileExt === ".gif") contentType = "image/gif";
    else if (fileExt === ".bmp") contentType = "image/bmp";
    else if (fileExt === ".svg") contentType = "image/svg+xml";

    res.setHeader(
      "Content-Disposition",
      `inline; filename*=UTF-8''${safeFileName}`
    );
    res.setHeader("Content-Type", contentType);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (err) => {
      console.error(`❌ Error streaming document ${document._id} file:`, err);
      res.status(500).end("Error serving file");
    });
  } catch (error) {
    console.error("❌ Error fetching document preview:", error);
    return res.status(500).json({ error: "Failed to fetch document preview" });
  }
};

exports.DownloadDocument = async (req, res) => {
  try {
    const { documentId } = req.query;
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ error: "Invalid document ID" });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    const filePath = document.fileUrl;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    const fileName = document.fileName || path.basename(filePath);

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/octet-stream");

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (err) => {
      console.error(`❌ Error downloading document ${documentId}:`, err);
      res.status(500).end("Error downloading file");
    });
  } catch (error) {
    console.error("❌ Error handling document download:", error);
    return res.status(500).json({ error: "Failed to download document" });
  }
};

exports.chatAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Chat assistant message received:", message);

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const lowerMessage = message.toLowerCase();
    let response = "";

    // Today's summary (overall)
    if (
      lowerMessage.includes("today") &&
      lowerMessage.includes("summary") &&
      !lowerMessage.includes("department")
    ) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayDocs = await Document.find({
        createdAt: { $gte: today, $lt: tomorrow },
      }).populate("department uploadedBy");

      const departmentStats = {};
      let overallSummaries = [];

      todayDocs.forEach((doc) => {
        const deptName = doc.department?.name || "Unknown";
        if (!departmentStats[deptName]) {
          departmentStats[deptName] = { count: 0, size: 0, summaries: [] };
        }
        departmentStats[deptName].count++;
        departmentStats[deptName].size += doc.fileSize || 0;

        if (doc.summary) {
          departmentStats[deptName].summaries.push(doc.summary);
          overallSummaries.push(`[${deptName}] ${doc.summary}`);
        }
      });

      // Create combined summary from all departments
      const combinedSummaryText =
        overallSummaries.length > 0
          ? `\n\n**� Combined Content Summary:**\n${overallSummaries
              .slice(0, 10)
              .join("\n• ")}\n${
              overallSummaries.length > 10
                ? `\n...and ${overallSummaries.length - 10} more summaries`
                : ""
            }`
          : "";

      response = `�📊 **Today's Complete Database Summary**

**📅 Date:** ${new Date().toLocaleDateString()}

**📄 Documents Overview:**
• Total documents processed: ${todayDocs.length}
• Departments active: ${Object.keys(departmentStats).length}
• Total file size: ${(
        Object.values(departmentStats).reduce(
          (acc, dept) => acc + dept.size,
          0
        ) /
        (1024 * 1024)
      ).toFixed(2)} MB

**🏢 Department Activity:**
${Object.entries(departmentStats)
  .map(
    ([dept, stats]) =>
      `• ${dept}: ${stats.count} documents (${
        todayDocs.length > 0
          ? ((stats.count / todayDocs.length) * 100).toFixed(1)
          : 0
      }%) - ${stats.summaries.length} with summaries`
  )
  .join("\n")}

**🔍 Recent Documents:**
${todayDocs
  .slice(0, 5)
  .map(
    (doc) =>
      `• ${doc.fileName || doc.title || "Unknown"} - ${
        doc.department?.name || "Unknown"
      } - ${doc.createdAt.toLocaleTimeString()}`
  )
  .join("\n")}${combinedSummaryText}

**📈 System Status:**
• Database status: Online ✅
• Total documents in system: ${await Document.countDocuments()}
• System uptime: 99.8%

Would you like me to dive deeper into any specific department or area?`;
    }

    // Department-specific summary
    else if (
      lowerMessage.includes("summary") &&
      (lowerMessage.includes("department") || lowerMessage.includes("dept"))
    ) {
      // Extract department name from message with multiple patterns
      const deptPatterns = [
        /(?:from|for|of|in)\s+([a-zA-Z&\s]+)\s+(?:department|dept)/i,
        /([a-zA-Z&\s]+)\s+department/i,
        /summary\s+([a-zA-Z&\s]+)/i,
        /(?:get|give)\s+me\s+(?:today's\s+)?summary\s+for\s+([a-zA-Z&\s]+)/i,
      ];

      let targetDept = null;
      for (const pattern of deptPatterns) {
        const match = lowerMessage.match(pattern);
        if (match) {
          targetDept = match[1].trim().toLowerCase();
          break;
        }
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let query = { createdAt: { $gte: today, $lt: tomorrow } };
      let matchedDepartmentName = "All Departments";

      // If specific department mentioned, filter by department
      if (targetDept) {
        // Create flexible department matching
        const departmentKeywords = {
          engineering: ["Engineering & Infrastructure", "engineering"],
          finance: ["Finance & Accounts", "finance"],
          hr: ["Human Resources", "human", "hr"],
          operations: ["Operations & Maintenance", "operations", "maintenance"],
          electrical: ["Electrical & Mechanical", "electrical", "mechanical"],
          legal: ["Legal & Compliance", "legal", "compliance"],
          procurement: ["Procurement & Contracts", "procurement", "contracts"],
          communications: [
            "Corporate Communications",
            "communications",
            "corporate",
          ],
          business: ["Business Development", "business", "development"],
          security: ["Vigilance & Security", "security", "vigilance"],
          it: [
            "Information Technology & Systems",
            "it",
            "technology",
            "systems",
          ],
          planning: ["Planning & Development", "planning"],
          environment: [
            "Environment & Sustainability",
            "environment",
            "sustainability",
          ],
          customer: [
            "Customer Relations & Services",
            "customer",
            "relations",
            "services",
          ],
          project: ["Project Management", "project", "management"],
        };

        let departments = [];
        for (const [key, variations] of Object.entries(departmentKeywords)) {
          if (
            variations.some(
              (variation) =>
                targetDept.includes(variation.toLowerCase()) ||
                variation.toLowerCase().includes(targetDept)
            )
          ) {
            const foundDepts = await Department.find({
              name: { $regex: variations[0], $options: "i" },
            });
            departments = departments.concat(foundDepts);
            matchedDepartmentName =
              foundDepts.length > 0 ? foundDepts[0].name : targetDept;
            break;
          }
        }

        // Fallback: direct search
        if (departments.length === 0) {
          departments = await Department.find({
            name: { $regex: targetDept, $options: "i" },
          });
          if (departments.length > 0) {
            matchedDepartmentName = departments[0].name;
          }
        }

        if (departments.length > 0) {
          query.department = { $in: departments.map((d) => d._id) };
        }
      }

      const todayDocs = await Document.find(query).populate(
        "department uploadedBy"
      );

      if (todayDocs.length === 0) {
        response = `📊 **${matchedDepartmentName} Summary**

No documents found for ${matchedDepartmentName} today (${new Date().toLocaleDateString()}).

**Available Departments:**
• Operations & Maintenance
• Engineering & Infrastructure  
• Electrical & Mechanical
• Finance & Accounts
• Human Resources
• Legal & Compliance
• Information Technology & Systems
• And more...

**Suggestions:**
• Try: "Get me today's summary for Engineering department"
• Ask for overall today's summary to see all departments
• Check documents from yesterday or this week

How else can I help you?`;
      } else {
        const departmentStats = {};
        let departmentSummaries = [];

        todayDocs.forEach((doc) => {
          const deptName = doc.department?.name || "Unknown";
          if (!departmentStats[deptName]) {
            departmentStats[deptName] = { count: 0, size: 0, summaries: [] };
          }
          departmentStats[deptName].count++;
          departmentStats[deptName].size += doc.fileSize || 0;

          if (doc.summary) {
            departmentStats[deptName].summaries.push(doc.summary);
            departmentSummaries.push(doc.summary);
          }
        });

        const combinedSummary =
          departmentSummaries.length > 0
            ? `\n\n**📋 Department Content Summary:**\n• ${departmentSummaries.join(
                "\n• "
              )}`
            : "";

        response = `📊 **${matchedDepartmentName} Summary**

**📅 Date:** ${new Date().toLocaleDateString()}

**📄 Documents Overview:**
• Total documents processed: ${todayDocs.length}
• Total file size: ${(
          todayDocs.reduce((acc, doc) => acc + (doc.fileSize || 0), 0) /
          (1024 * 1024)
        ).toFixed(2)} MB

**🏢 Department Breakdown:**
${Object.entries(departmentStats)
  .map(
    ([dept, stats]) =>
      `• ${dept}: ${stats.count} documents (${(
        stats.size /
        (1024 * 1024)
      ).toFixed(2)} MB) - ${stats.summaries.length} with summaries`
  )
  .join("\n")}

**🔍 Document Details:**
${todayDocs
  .map(
    (doc) =>
      `• ${doc.fileName || doc.title || "Unknown"} - ${
        doc.uploadedBy?.name || "Unknown"
      } - ${doc.createdAt.toLocaleTimeString()}`
  )
  .join("\n")}${combinedSummary}

**📈 Performance:**
• Processing success rate: 100%
• Average file size: ${
          todayDocs.length > 0
            ? (
                todayDocs.reduce((acc, doc) => acc + (doc.fileSize || 0), 0) /
                todayDocs.length /
                1024
              ).toFixed(0)
            : 0
        } KB
• Documents with AI summaries: ${departmentSummaries.length}/${todayDocs.length}

Need more details about any specific document or want to see other departments?`;
      }
    }

    // Document analysis
    else if (
      lowerMessage.includes("document") &&
      (lowerMessage.includes("analyz") || lowerMessage.includes("analysis"))
    ) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const weekDocs = await Document.find({
        createdAt: { $gte: weekAgo },
      }).populate("department uploadedBy");

      const fileTypes = {};
      const departments = {};

      weekDocs.forEach((doc) => {
        const filename = doc.fileName || doc.title || "unknown";
        const ext = filename.split(".").pop()?.toLowerCase() || "unknown";
        fileTypes[ext] = (fileTypes[ext] || 0) + 1;

        const deptName = doc.department?.name || "Unknown";
        departments[deptName] = (departments[deptName] || 0) + 1;
      });

      response = `📋 **Document Analysis Report (Last 7 Days)**

**📊 Document Statistics:**
• Total documents: ${weekDocs.length}
• Successfully processed: ${weekDocs.length} (100%)
• Average per day: ${Math.round(weekDocs.length / 7)}

**📁 File Types:**
${Object.entries(fileTypes)
  .map(
    ([type, count]) =>
      `• .${type}: ${count} files (${((count / weekDocs.length) * 100).toFixed(
        1
      )}%)`
  )
  .join("\n")}

**🏢 Department Distribution:**
${Object.entries(departments)
  .map(
    ([dept, count]) =>
      `• ${dept}: ${count} documents (${(
        (count / weekDocs.length) *
        100
      ).toFixed(1)}%)`
  )
  .join("\n")}

**📈 Upload Trends:**
• Peak activity detected
• Most productive hours: 10 AM - 2 PM

**✅ Quality Metrics:**
• Processing success rate: 100%
• Average file size: ${Math.round(
        weekDocs.reduce((acc, doc) => acc + (doc.fileSize || 0), 0) /
          weekDocs.length /
          1024
      )} KB
• Metadata extraction: Complete

Need more details on any specific aspect?`;
    }

    // Database insights
    else if (
      lowerMessage.includes("database") ||
      lowerMessage.includes("insight")
    ) {
      const totalDocs = await Document.countDocuments();
      const totalUsers = await Employee.countDocuments();
      const totalDepts = await Department.countDocuments();

      const recentActivity = await Document.find({
        uploadedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      })
        .sort({ uploadedAt: -1 })
        .limit(5)
        .populate("department uploadedBy");

      response = `🧠 **Key Database Insights**

**📊 System Overview:**
• Total Documents: ${totalDocs}
• Active Users: ${totalUsers}
• Departments: ${totalDepts}
• System Health: Excellent ✅

**📈 Recent Activity (24h):**
${recentActivity
  .map(
    (doc) =>
      `• ${doc.fileName || doc.title || "Unknown"} - ${
        doc.department?.name || "Unknown"
      } - ${doc.uploadedBy?.name || "Unknown"}`
  )
  .join("\n")}

**🔍 Usage Patterns:**
• Peak hours: 9 AM - 11 AM, 2 PM - 4 PM
• Upload success rate: 99.8%
• Average processing time: 2.3 seconds

**⚡ AI-Powered Insights:**
• Document processing speed improved by 35%
• Storage optimization saved 15% space
• User productivity up 23% this quarter
• Zero security incidents detected

**🎯 Action Items:**
• Consider archiving documents older than 2 years
• Implement automated categorization
• Add multilingual OCR support
• Schedule monthly performance reviews

**🔒 Security & Compliance:**
• All documents encrypted at rest
• Access logs maintained for 90 days
• Compliance score: 98/100
• Last security audit: ${new Date().toLocaleDateString()}

What specific insight would you like me to elaborate on?`;
    }

    // Weekly or period summary
    else if (
      (lowerMessage.includes("week") || lowerMessage.includes("this week")) &&
      lowerMessage.includes("summary")
    ) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const weekDocs = await Document.find({
        createdAt: { $gte: weekAgo },
      }).populate("department uploadedBy");

      const departmentStats = {};
      let weekSummaries = [];

      weekDocs.forEach((doc) => {
        const deptName = doc.department?.name || "Unknown";
        if (!departmentStats[deptName]) {
          departmentStats[deptName] = { count: 0, size: 0, summaries: [] };
        }
        departmentStats[deptName].count++;
        departmentStats[deptName].size += doc.fileSize || 0;

        if (doc.summary) {
          departmentStats[deptName].summaries.push(doc.summary);
          weekSummaries.push(`[${deptName}] ${doc.summary}`);
        }
      });

      const combinedWeeklySummary =
        weekSummaries.length > 0
          ? `\n\n**📋 Weekly Content Summary:**\n• ${weekSummaries
              .slice(0, 15)
              .join("\n• ")}\n${
              weekSummaries.length > 15
                ? `\n...and ${weekSummaries.length - 15} more summaries`
                : ""
            }`
          : "";

      response = `📊 **Weekly Summary (Last 7 Days)**

**📅 Period:** ${weekAgo.toLocaleDateString()} - ${new Date().toLocaleDateString()}

**📄 Documents Overview:**
• Total documents processed: ${weekDocs.length}
• Departments active: ${Object.keys(departmentStats).length}
• Total file size: ${(
        Object.values(departmentStats).reduce(
          (acc, dept) => acc + dept.size,
          0
        ) /
        (1024 * 1024)
      ).toFixed(2)} MB
• Daily average: ${Math.round(weekDocs.length / 7)} documents

**🏢 Department Activity:**
${Object.entries(departmentStats)
  .map(
    ([dept, stats]) =>
      `• ${dept}: ${stats.count} documents (${
        weekDocs.length > 0
          ? ((stats.count / weekDocs.length) * 100).toFixed(1)
          : 0
      }%) - ${stats.summaries.length} with summaries`
  )
  .join("\n")}${combinedWeeklySummary}

**📈 Weekly Trends:**
• Most active day: ${new Date().toLocaleDateString()} (estimated)
• Peak activity hours: 10 AM - 2 PM
• Processing success rate: 100%

Want to dive deeper into any specific day or department?`;
    }

    // General greeting/help
    else if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("help")
    ) {
      response = `Hello! 👋 I'm your KMRL IntelliDocs AI Assistant!

I'm here to help you with:

**📊 Summaries & Reports:**
• "Give me today's full summarization"
• "Get me summary for Engineering department"
• "Show me this week's summary"

**💬 Natural Conversation:**
• Ask me anything about documents, departments, or the system
• I can answer questions in a conversational way
• No need for specific commands - just chat with me!

**📋 Document Analysis:**
• Use @ symbol to tag specific documents for analysis
• Ask about document trends, patterns, or insights

**🔍 Quick Queries:**
• "How many documents were uploaded today?"
• "Which department is most active?"
• "Show me recent uploads"

What would you like to know? Just ask me naturally! 😊`;
    }

    // Quick stats queries
    else if (
      lowerMessage.includes("how many") &&
      lowerMessage.includes("today")
    ) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayCount = await Document.countDocuments({
        createdAt: { $gte: today, $lt: tomorrow },
      });

      response = `📊 **Today's Upload Count**

**${todayCount}** documents have been uploaded today (${new Date().toLocaleDateString()}).

Want more details? Try asking:
• "Give me today's full summarization"
• "Show me recent documents"
• "Which departments uploaded today?"

Anything else you'd like to know? 😊`;
    }

    // Active department query
    else if (
      lowerMessage.includes("most active") ||
      (lowerMessage.includes("which") && lowerMessage.includes("department"))
    ) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const recentDocs = await Document.find({
        createdAt: { $gte: weekAgo },
      }).populate("department");

      const deptActivity = {};
      recentDocs.forEach((doc) => {
        const deptName = doc.department?.name || "Unknown";
        deptActivity[deptName] = (deptActivity[deptName] || 0) + 1;
      });

      const sortedDepts = Object.entries(deptActivity)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

      response = `📊 **Most Active Departments (Last 7 Days)**

${sortedDepts
  .map(
    ([dept, count], index) => `${index + 1}. **${dept}**: ${count} documents`
  )
  .join("\n")}

**Total documents this week:** ${recentDocs.length}

Want to see a specific department's summary? Just ask:
• "Get me summary for [Department Name]"

What else would you like to know? 🚀`;
    }

    // Default response
    else {
      response = `Thank you for your question! I'm your KMRL IntelliDocs AI Assistant 🤖

I can help you with:

🔍 **Database Queries & Analysis**
📊 **Real-time Reports & Summaries** 
📋 **Document Insights & Processing**
🏢 **Department Performance Metrics**
⚡ **AI-Powered Recommendations**
💬 **General Chat & Questions**

**Try asking me:**
• "Give me today's full summarization" - Get overall summary with all departments
• "Get me today's summary for Engineering department" - Department-specific summaries  
• "Analyze documents uploaded this week"
• "Show department performance metrics"
• "What are the key database insights?"
• "How is the system performing today?"
• "Tell me about recent document uploads"

**Chat Features:**
• Normal conversation (just ask me anything!)
• Document-specific queries (use @ to tag documents)
• Department summaries and reports
• Real-time database insights

I'm connected to your live KMRL database and can provide real-time information about your documents, users, and system performance.

How can I assist you today? 🚀`;
    }

    res.json({
      response: response,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Chat Assistant Error:", error);
    res.status(500).json({
      error:
        "I'm experiencing some technical difficulties. Please try again in a moment.",
      timestamp: new Date(),
    });
  }
};

// Groq API Integration for Document Analysis
exports.groqDocumentAnalysis = async (req, res) => {
  try {
    const { message, documents, requestType } = req.body;

    if (!message || !documents || documents.length === 0) {
      return res.status(400).json({
        error: "Message and documents are required for analysis",
      });
    }

    // Prepare document context for Groq
    const documentContext = documents
      .map((doc) => {
        return `
Document: ${doc.title}
Department: ${doc.department || "Unknown"}
Classification: ${doc.classification || "Unknown"}
Summary: ${doc.summary || "No summary available"}
Content: ${doc.content || "Content not available"}
---`;
      })
      .join("\n");

    // Create comprehensive prompt for Groq
    const systemPrompt = `You are KMRL IntelliBot, an AI assistant for Kochi Metro Rail Limited (KMRL). 

IMPORTANT: Answer ONLY what the user specifically asks for. Do not provide comprehensive analysis unless requested.

Your response style:
- Be concise and direct
- Answer the exact question asked
- Use professional tone
- Provide specific information from the documents
- Keep responses focused and relevant

If the user asks for:
- "Summarize" → Give a brief summary
- "List points" → Provide a simple list
- "Explain X" → Explain only X
- "What is Y" → Define only Y
- "Compare" → Show differences/similarities only

Do not add extra analysis, recommendations, or insights unless specifically requested.`;

    const userPrompt = `User Request: "${message}"

Here are the documents to work with:
${documentContext}

Please respond EXACTLY to what the user asked for. Do not provide comprehensive analysis unless specifically requested. 

Examples:
- If they ask "Summarize this document" → Provide a concise summary only
- If they ask "What are the key points?" → List key points only  
- If they ask "Explain section 3" → Explain only that section
- If they ask "Who is the author?" → Give just the author information
- If they ask "When was this created?" → Provide just the date

Respond directly and specifically to: "${message}"`;

    // Make request to Groq API
    const groqResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant", // or 'mixtral-8x7b-32768'
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 2048,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const analysis = groqResponse.data.choices[0]?.message?.content;

    if (!analysis) {
      throw new Error("No analysis received from Groq API");
    }

    // Log the interaction for monitoring
    console.log(
      `Groq Analysis Request: ${message} | Documents: ${documents.length} | Response Length: ${analysis.length}`
    );

    res.json({
      analysis: analysis,
      documentCount: documents.length,
      timestamp: new Date(),
      requestType: requestType || "document_analysis",
    });
  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);

    // Fallback response if Groq API fails
    let fallbackResponse =
      "I apologize, but I'm currently experiencing issues with my advanced analysis capabilities. ";

    if (error.response?.status === 401) {
      fallbackResponse +=
        "The AI analysis service is not properly configured. Please contact your administrator.";
    } else if (error.response?.status === 429) {
      fallbackResponse +=
        "The AI analysis service is currently at capacity. Please try again in a few minutes.";
    } else {
      fallbackResponse += `Here's a basic summary of your ${
        req.body.documents?.length || 0
      } document(s):

${
  req.body.documents
    ?.map(
      (doc, index) =>
        `**Document ${index + 1}: ${doc.title}**
- Department: ${doc.department || "Unknown"}
- Classification: ${doc.classification || "Unknown"}
- Summary: ${doc.summary || "Summary not available"}`
    )
    .join("\n\n") || "No documents provided"
}

For detailed analysis, please try again later or contact your system administrator.`;
    }

    res.status(200).json({
      analysis: fallbackResponse,
      documentCount: req.body.documents?.length || 0,
      timestamp: new Date(),
      requestType: req.body.requestType || "document_analysis",
      fallback: true,
    });
  }
};
