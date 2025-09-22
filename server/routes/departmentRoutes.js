const router = require("express").Router();
const {
  createDepartment,
  getDepartment,
  getDepartmentsUI,
} = require("../controllers/departmentController");
const { verifyToken } = require("../utils/jwt");

router.post("/create-department", createDepartment);
router.get("/get-department-ui", getDepartmentsUI);
router.get("/:id", getDepartment);

module.exports = router;
