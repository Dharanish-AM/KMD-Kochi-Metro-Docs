const router = require("express").Router();
const {
  uploadDocument,
  getDocumentsByDepartment,
  getDocumentById,
  getDocumentsByUser,
  deleteDocument,
  downloadDocument,
} = require("../controllers/documentController");

router.post("/upload", uploadDocument);
router.get("/documents-by-department/:departmentId", getDocumentsByDepartment);
router.get("/documents-by-user/:userId", getDocumentsByUser);
router.get("/download/:documentId", downloadDocument);
router.get("/:documentId", getDocumentById);
router.delete("/:documentId", deleteDocument);

module.exports = router;
