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
  title: {
    type: String,
  },
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
    // required: true,
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

totalLectures: {
  type: Number,
},

totalDuration: {
  type: String,
},

rating: {
  type: Number,
},
status:{
  type:String,
  enum:["Draft","Published"],
},
createdAt:{
  type:Date,
  default:Date.now(),
}

});


module.exports = mongoose.model("Course", coursesSchema);
