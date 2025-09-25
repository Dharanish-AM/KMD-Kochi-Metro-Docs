const router = require("express").Router();
const {
  uploadDocument,
  getDocumentsByDepartment,
  getDocumentById,
  getDocumentsByUser,
  getAllDocuments,
  deleteDocument,
  downloadDocument,
} = require("../controllers/documentController");

router.post("/upload", uploadDocument);
router.get("/all", getAllDocuments);
router.get("/documents-by-department/:departmentId", getDocumentsByDepartment);
router.get("/documents-by-user/:userId", getDocumentsByUser);
router.get("/download/:documentId", downloadDocument);
router.get("/:documentId", getDocumentById);
router.delete("/:documentId", deleteDocument);
// RAG Search and additional document operations
const { 
  RAGSearchDocument, 
  DocumentPreview, 
  DownloadDocument 
} = require("../controllers/documentController");

router.get("/rag-search", RAGSearchDocument);
router.get("/document-preview", DocumentPreview);
router.get("/download-document", DownloadDocument);

module.exports = router;
