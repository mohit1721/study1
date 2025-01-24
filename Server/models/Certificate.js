const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  certificateUrl: {
    type: String, // Path or URL of the generated certificate
    required: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  status: { type: String, default: 'Pending' } // e.g., 'Issued' or 'Pending'
});

module.exports = mongoose.model("Certificate", certificateSchema);
