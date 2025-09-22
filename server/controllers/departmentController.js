const Department = require("../models/Department");

exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const newDepartment = new Department({ name, description });
    await newDepartment.save();

    res.status(201).json({
      message: "Department created successfully",
      department: newDepartment,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getDepartment = async (req, res) => {
  try {
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
  try {
    const departments = await Department.find().select("name description");
    if (!departments) {
      return res.status(404).json({ message: "Departments not found" });
    }
    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
