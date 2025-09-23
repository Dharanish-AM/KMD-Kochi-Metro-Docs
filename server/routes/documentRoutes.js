const router = require("express").Router();
const {
  uploadDocument,
  getDocumentsByDepartment,
  RAGSearchDocument,
} = require("../controllers/documentController");

router.post("/upload", uploadDocument);
router.get("/documents-by-department/:departmentId", getDocumentsByDepartment);
router.get("/rag-search", RAGSearchDocument);

module.exports = router;
