const User = require("../models/User");
const Department = require("../models/Department");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");

exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, departmentId } = req.body;

    // For Admin role, department is optional
    if (role !== "Admin" && !departmentId) {
      return res.status(400).json({ message: "Department ID is required for non-admin users" });
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

    const savedUser = await User.findById(newUser._id).select("-password").populate("department");
    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
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
      userType: user.role === "Admin" ? "admin" : "employee"
    };

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
    const user = await User.findById(userId).select("-password").populate("department", "-employees");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};