const mongoose = require("mongoose");
const { Schema } = mongoose;

const DocumentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  version: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
  detectedLanguage: {
    type: String,
  },
  originalText: {
    type: String,
  },
  translatedText: {
    type: String,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  summary: {
    type: String,
  },
  summary_ml:{
    type: String,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
  },
  fileSize: {
    type: Number,
  },
  detected_language: {
    type: String,
  },
  translated_text: {
    type: String,
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Text index for title and tags
DocumentSchema.index({ title: "text", tags: "text" });

module.exports = mongoose.model("Document", DocumentSchema);
