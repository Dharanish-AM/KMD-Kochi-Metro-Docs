const router = require("express").Router();
const {
  uploadDocument,
  getDocumentsByDepartment,
} = require("../controllers/documentController");

router.post("/upload", uploadDocument);
router.get("/documents-by-department/:departmentId", getDocumentsByDepartment);

module.exports = router;
