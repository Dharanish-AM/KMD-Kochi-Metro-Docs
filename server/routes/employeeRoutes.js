const router = require("express").Router();
const {
    login,
    createUser,
    getUser,
} = require("../controllers/employeeController");

router.post("/login", login);
router.post("/create-user", createUser);
router.get("/:id", getUser);

module.exports = router;