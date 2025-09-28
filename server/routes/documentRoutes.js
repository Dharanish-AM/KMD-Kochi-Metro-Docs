const router = require("express").Router();
const {
  uploadDocument,
  getDocumentsByDepartment,
  getDocumentById,
  getDocumentsByUser,
  getAllDocuments,
  deleteDocument,
  downloadDocument,
  RAGSearchDocument, 
  DocumentPreview, 
  DownloadDocument,
  chatAssistant,
  groqDocumentAnalysis,
  getDepartmentStats
} = require("../controllers/documentController");

router.get("/rag-search", RAGSearchDocument);
router.post("/upload", uploadDocument);
router.get("/all", getAllDocuments);
router.get("/documents-by-department/:departmentId", getDocumentsByDepartment);
router.get("/documents-by-user/:userId", getDocumentsByUser);
router.get("/download/:documentId", downloadDocument);
router.get("/document-preview", DocumentPreview);
router.get("/download-document", DownloadDocument);
router.post("/chat-assistant", chatAssistant);
router.post("/groq-analysis", groqDocumentAnalysis);
router.get("/:documentId", getDocumentById);
router.delete("/:documentId", deleteDocument);
router.get("/department-stats/:departmentId", getDepartmentStats);

module.exports = router;
