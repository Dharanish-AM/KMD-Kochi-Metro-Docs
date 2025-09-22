const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: function() {
      return this.role !== "Admin";
    },
    unique: true,
    sparse: true, // Allows multiple documents with null/undefined values
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Employee", "Viewer"],
    default: "Employee",
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: function() {
      return this.role !== "Admin";
    },
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
