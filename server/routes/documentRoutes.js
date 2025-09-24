const router = require("express").Router();
const {
  uploadDocument,
  getDocumentsByDepartment,
  getDocumentById,
  getDocumentsByUser,
  deleteDocument,
  downloadDocument,
  RAGSearchDocument,
  DocumentPreview,
  DownloadDocument
} = require("../controllers/documentController");

router.post("/upload", uploadDocument);
router.get("/documents-by-department/:departmentId", getDocumentsByDepartment);
router.get("/documents-by-user/:userId", getDocumentsByUser);
router.get("/download/:documentId", downloadDocument);
router.get("/:documentId", getDocumentById);
router.delete("/:documentId", deleteDocument);
// TODO: Implement these functions in documentController.js
router.get("/rag-search", RAGSearchDocument);
router.get("/document-preview", DocumentPreview);
router.get("/download-document", DownloadDocument);

module.exports = router;
