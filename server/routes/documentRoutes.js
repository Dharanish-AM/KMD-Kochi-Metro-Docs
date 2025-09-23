const router = require("express").Router();
const {
  uploadDocument,
  getDocumentsByDepartment,
  RAGSearchDocument,
  DocumentPreview,
  DownloadDocument,
} = require("../controllers/documentController");

router.post("/upload", uploadDocument);
router.get("/documents-by-department/:departmentId", getDocumentsByDepartment);
router.get("/rag-search", RAGSearchDocument);
router.get("/document-preview", DocumentPreview);
router.get("/download-document", DownloadDocument);

module.exports = router;
