//mongoose ka use krenge.....schema banayenge...
//need 2 ...model name+schema
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true, //trim..
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
    enum: ["Admin", "Student", "Instructor"],
  },
	active: {
    type: Boolean,
    default: true,
  },
  approved: {
    type: Boolean,
    default: true,
  },

  additionalDetails: {
    //profile naam ka ek model hoga  usko yehaan refer kr rhe honge
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  image: {
    type: String, //url hoga..isliye string likha
    // required: true,
  },
  token: {
    type: String, //
  },
  resetPasswordExpires: {
    type: Date, //
  },

  courseProgress: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseProgress",
  },],


},
// Add timestamps for when the document is created and last modified
{ timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
