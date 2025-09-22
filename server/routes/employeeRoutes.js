const router = require("express").Router();
const {
    login,
    createUser,
} = require("../controllers/employeeController");

router.post("/login", login);
router.post("/create", createUser);

module.exports = router;