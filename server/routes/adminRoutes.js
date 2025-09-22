const router = require("express").Router();
const {
    createAdmin,
    getAdmin,
} = require("../controllers/adminController");

router.post("/create-admin", createAdmin);
router.get("/get-admin/:id", getAdmin);

module.exports = router;