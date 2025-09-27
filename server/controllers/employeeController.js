const User = require("../models/User");
const Department = require("../models/Department");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const { sendWelcomeEmail } = require("../utils/emailService");

exports.createUser = async (req, res) => {
  console.log("Create User Request Body:", req.body);
  try {
    const { name, email, phone, password, role, departmentId } = req.body;

    // For Admin role, department is optional
    if (role !== "Admin" && !departmentId) {
      return res
        .status(400)
        .json({ message: "Department ID is required for non-admin users" });
    }

    // If departmentId is provided, validate it exists
    if (departmentId) {
      const department = await Department.findById(departmentId);
      if (!department) {
        return res.status(400).json({ message: "Invalid department ID" });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    };

    // Only add department if it's provided (for non-admin users)
    if (departmentId) {
      userData.department = departmentId;
    }

    const newUser = new User(userData);
    await newUser.save();

    // Add user to department if department exists
    if (departmentId) {
      const department = await Department.findById(departmentId);
      if (!department.employees) {
        department.employees = [];
      }
      department.employees.push(newUser._id);
      await department.save();
    }

    const savedUser = await User.findById(newUser._id)
      .select("-password")
      .populate("department");

    // Send welcome email with credentials (only if email service is configured)
    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
      try {
        const departmentName = savedUser.department ? savedUser.department.name : null;
        const emailResult = await sendWelcomeEmail({
          name: savedUser.name,
          email: savedUser.email,
          password: password, // Send the original password before hashing
          role: savedUser.role,
          departmentName: departmentName
        });

        if (emailResult.success) {
          console.log(`✅ Welcome email sent to ${savedUser.email}`);
        } else {
          console.warn(`⚠️ Failed to send welcome email to ${savedUser.email}:`, emailResult.error);
        }
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Don't fail the user creation if email fails
      }
    } else {
      console.warn("⚠️ Email service not configured. Welcome email not sent.");
    }

    res
      .status(201)
      .json({ 
        message: "User created successfully", 
        user: savedUser,
        emailSent: process.env.MAIL_USER && process.env.MAIL_PASS ? true : false
      });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("department");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create token with role-specific payload
    const tokenPayload = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // Add department info only if user has a department (non-admin users)
    if (user.department) {
      tokenPayload.department = user.department;
    }

    const token = generateToken(tokenPayload);

    // Helper function to generate department URL path
    const generateDepartmentPath = (departmentName) => {
      if (!departmentName) return null;
      return departmentName
        .toLowerCase()
        .replace(/&/g, '') // Remove &
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Remove special characters except hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    };

    // Prepare response based on role
    const response = {
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(user.department && { department: user.department }),
        joinedAt: user.joinedAt,
      },
      token,
      userType: user.role === "Admin" ? "admin" : "employee",
    };

    // Add department routing information for non-admin users
    if (user.role !== "Admin" && user.department) {
      response.departmentPath = generateDepartmentPath(user.department.name);
      response.redirectTo = `/${response.departmentPath}`;
    } else if (user.role === "Admin") {
      response.redirectTo = "/";
    } else {
      response.redirectTo = "/dashboard";
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findById(userId)
      .select("-password")
      .populate("department", "-employees");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, phone, role, departmentId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find the user first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // For non-admin users, department is required
    if (role && role !== "Admin" && !departmentId && !user.department) {
      return res.status(400).json({ message: "Department ID is required for non-admin users" });
    }

    // If departmentId is provided, validate it exists
    if (departmentId) {
      const department = await Department.findById(departmentId);
      if (!department) {
        return res.status(400).json({ message: "Invalid department ID" });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role) updateData.role = role;
    if (departmentId) updateData.department = departmentId;

    // Remove user from old department if department is changing
    if (departmentId && user.department && user.department.toString() !== departmentId) {
      await Department.findByIdAndUpdate(
        user.department,
        { $pull: { employees: userId } }
      );
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password").populate("department");

    // Add user to new department if department is changing
    if (departmentId && (!user.department || user.department.toString() !== departmentId)) {
      await Department.findByIdAndUpdate(
        departmentId,
        { $addToSet: { employees: userId } }
      );
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find the user first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove user from department if they have one
    if (user.department) {
      await Department.findByIdAndUpdate(
        user.department,
        { $pull: { employees: userId } }
      );
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
  
    const users = await User.find({ role: { $ne: "Admin" } })
      .select("-password")
      .populate("department", "name")
      .sort({ joinedAt: -1 });

    
    const transformedUsers = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department ? user.department.name : "No Department",
      joinedAt: user.joinedAt,
      lastLogin: user.lastLogin || "Never"
    }));

    res.status(200).json({
      message: "Users fetched successfully",
      users: transformedUsers,
      total: transformedUsers.length
    });

  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
