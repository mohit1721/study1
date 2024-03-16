const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//createRating

exports.createRating = async (req, res) => {
  try {
    //get user id
    //fetchdata from req body
    // check if user is enrolled or not
    // check if user already reviewed the course
    // create rating review
    // update course with rating and review
    //  return res

    // START
    //get user id
    const userId = req.user.id; //
    //fetchdata from req body
    const { rating, review, courseId } = req.body;
    // check if user is enrolled or not
    const courseDetails = await Course.findOne(
      {
        _id: courseId,
        studentsEnrolled: { $elemMatch: { $eq: userId } }, //searching criteria
      } //kis basis pe
    );
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }

    // check if user already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if(alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewed by the user",
      });
    }

    // create rating review-->sace calll///create
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // update course with rating and review in
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId }, //basis
      {
        $push: {
          ratingAndReviews: ratingReview._id, //ref h to id
        }
      },
      { new: true }
    );

    // console.log(updatedCourseDetails);
    //return response
    return res.status(200).json({
      success: true,
      message: "Rating and Review created Successfully",
     ratingReview,
    });
    //  return res
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getAverageRating
exports.getAverageRating = async (req, res) => {
  try {
    // get course id
    // calculate average rating
    //  return rating

    // START

    // get course id
    const courseId = req.body.courseId;
    // calculate average rating
    //
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          //string se objectId m convert kiya
          course: new mongoose.Types.ObjectId(courseId), //mujhe ek aisi entry find out krke do jiski course id {courseId} iske equal ho ,course ki field ki andar
        },
      },
      {
        $group: {
          _id: null, //jitni v entries aayi thi usko maine single group m wrap kr di
          averageRating: { $avg: "rating" }, //avg se average nikal li h
        },
      },
    ]);

    //  return rating
    if (result.length > 0) {
      return result.status(200).json({
        success: true,
        averageRating: result[0].averageRating, //zero index m padi h..aggregate fxn ek array of value return krega....is case m ek hi value mil rhi h..entire operation k baad..jo zero index m h
      });
    }
    // if not rating/review exist
    return result.status(200).json({
      success: true,
      message: "Average rating is 0,no ratings given till now",
      averageRating: 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getAllRatingAndReviews
exports.getAllRating = async (req, res) => {
  try {
    // find call marro -->yehaan kisi basis pe nhi krni
    // sb return kr do
    // oncde check..model
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image", //isse user k andar kis kis fields ko populate krni h
      })
      .populate({
        path: "course", //course m sirf courseName wali field populate krni h
        select: "courseName",
      })
      .exec();
    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
