//mongoose ka use krenge.....schema banayenge...
//need 2 ...model name+schema
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: String,
    
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: Number,
    trim: true,
  },
});
module.exports = mongoose.model("Profile", profileSchema);
