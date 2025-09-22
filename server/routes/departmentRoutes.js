const router = require("express").Router();
const {
  createDepartment,
  getDepartments,
} = require("../controllers/departmentController");
const { verifyToken } = require("../utils/jwt");

router.post("/create-department", verifyToken, createDepartment);
router.get("/",verifyToken, getDepartments);

module.exports = router;
    