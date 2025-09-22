const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new User({ 
      name, 
      email, 
      password: hashedPassword,
      role: "Admin",
      phone: req.body.phone || "" // Admin might not have phone, make it optional
    });
    await newAdmin.save();

    const savedAdmin = await User.findById(newAdmin._id).select("-password");

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
    const admin = await User.findById(adminId).select("-password");
    if (!admin || admin.role !== "Admin") {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
