const mongoose = require("mongoose");
const KMRL_DEPARTMENTS = require("../constants/departments");

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: KMRL_DEPARTMENTS,
  },
  description: {
    type: String,
  },
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Department = mongoose.model("Department", DepartmentSchema);

module.exports = Department;
