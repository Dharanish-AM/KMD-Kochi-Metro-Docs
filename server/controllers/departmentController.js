const Department = require("../models/Department");

exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ 
        message: "Department name is required" 
      });
    }

    // Trim the name to avoid whitespace issues
    const trimmedName = name.trim();

    // Check if department already exists (case-insensitive)
    const existingDepartment = await Department.findOne({ 
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
    });
    
    if (existingDepartment) {
      console.log("Department already exists:", trimmedName);
      return res.status(400).json({ 
        message: `Department "${trimmedName}" already exists` 
      });
    }

    // Create new department
    const newDepartment = new Department({ 
      name: trimmedName, 
      description: description ? description.trim() : ""
    });
    
    const savedDepartment = await newDepartment.save();
    console.log("Department created successfully:", savedDepartment.name);

    return res.status(201).json({
      message: "Department created successfully",
      department: savedDepartment,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation Error", 
        errors: errorMessages 
      });
    }
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Department with this name already exists" 
      });
    }
    
    return res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getDepartment = async (req, res) => {
  try {
    console.log("Fetching department with ID:", req.params.id);
    const departmentId = req.params.id;
    if (!departmentId) {
      return res.status(400).json({ message: "Department ID is required" });
    }
    const department = await Department.findById(departmentId).populate(
      "employees documents"
    );
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getDepartmentsUI = async (req, res) => {
  console.log("Fetching departments for UI");
  try {
    const departments = await Department.find()
      .select("name description employees documents createdAt")
      .populate("employees", "name")
      .populate("documents", "title");
    
    if (!departments) {
      return res.status(404).json({ message: "Departments not found" });
    }
    
    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
