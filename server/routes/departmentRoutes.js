const router = require("express").Router();
const {
  createDepartment,
  getDepartment,
} = require("../controllers/departmentController");
const { verifyToken } = require("../utils/jwt");

router.post("/create-department", createDepartment);
router.get("/:id", getDepartment);

module.exports = router;
