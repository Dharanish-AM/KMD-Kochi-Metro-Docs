const Admin = require("../models/Admin");

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    const savedAdmin = await Admin.findById(newAdmin._id).select("-password");

    res
      .status(201)
      .json({ message: "Admin created successfully", admin: savedAdmin });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }
    const admin = await Admin.findById(adminId).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
