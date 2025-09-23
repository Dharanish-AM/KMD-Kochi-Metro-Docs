const router = require("express").Router();
const {
    login,
    createUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
} = require("../controllers/employeeController");

router.post("/login", login);
router.post("/create-user", createUser);
router.get("/all", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;