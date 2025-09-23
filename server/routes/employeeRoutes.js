const router = require("express").Router();
const {
    login,
    createUser,
    getUser,
    updateUser,
    deleteUser,
} = require("../controllers/employeeController");

router.post("/login", login);
router.post("/create-user", createUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;