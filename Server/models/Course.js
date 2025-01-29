const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({
  courseName: {
    type: String,
    // trim: true,
  },
  courseDescription: {
    type: String,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],

  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  tag:{
    type:[String],
    required:true,
  },
  category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Category",
},
  type:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "",
  },
  studentsEnrolled: [
    {
      //isse verify kr skte h ki user phle se buy krke to nhi baitha hua
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
instructions:{
  type:[String],
},
language: {
  type: String,
  required: true,
},

level: {
  type: String,
  required: true,
},

totalLectures: { type: Number,
   default: 0 },
totalDuration: { type: String, 
  default: "0h 0m" },
 
status:{
  type:String,
  enum:["Draft","Published"],
},
createdAt:{
  type:Date,
  default:Date.now,
},
certificates: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      certificateUrl: {
        type: String, // URL or file path to the certificate
      },
      issuedAt: {
        type: Date,
        default: Date.now, // Date when the certificate was issued
      },
    },
  ],

});


module.exports = mongoose.model("Course", coursesSchema);
