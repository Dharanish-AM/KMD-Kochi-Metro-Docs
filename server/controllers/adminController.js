const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendWelcomeEmail } = require("../utils/emailService");

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

    // Send welcome email with credentials (only if email service is configured)
    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
      try {
        const emailResult = await sendWelcomeEmail({
          name: savedAdmin.name,
          email: savedAdmin.email,
          password: password, // Send the original password before hashing
          role: savedAdmin.role,
          departmentName: null // Admins don't have departments
        });

        if (emailResult.success) {
          console.log(`✅ Welcome email sent to admin ${savedAdmin.email}`);
        } else {
          console.warn(`⚠️ Failed to send welcome email to admin ${savedAdmin.email}:`, emailResult.error);
        }
      } catch (emailError) {
        console.error("Error sending welcome email to admin:", emailError);
        // Don't fail the admin creation if email fails
      }
    } else {
      console.warn("⚠️ Email service not configured. Welcome email not sent to admin.");
    }

    res
      .status(201)
      .json({ 
        message: "Admin created successfully", 
        admin: savedAdmin,
        emailSent: process.env.MAIL_USER && process.env.MAIL_PASS ? true : false
      });
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
