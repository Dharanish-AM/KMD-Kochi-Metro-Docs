  const router = require("express").Router();
const {
  createDepartment,
  getDepartment,
  getDepartmentsUI,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");
const { verifyToken } = require("../utils/jwt");

router.post("/create-department", createDepartment);
router.get("/get-department-ui", getDepartmentsUI);
router.get("/:id", getDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

module.exports = router;
