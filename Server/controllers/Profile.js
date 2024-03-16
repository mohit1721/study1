const Profile = require("../models/Profile");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require('../utils/secToDuration');
const Course = require("../models/Course");
// creatProfile ki jaroorat nhi
exports.updateProfile = async (req, res) => {
  try {
    // get data
    // get userId
    // validation
    // find profile-->since,aapne profile already bana rkhi h
    // update profile-->
    // return res

    // START
    // get data
    const { 
      firstName,
      lastName,
      dateOfBirth = "",
      about = "",
      contactNumber,
      gender,} = req.body;

    // get userId
    const id = req.user.id; //-->middleware-->auth.js->1st fxn->decoded->req.user k andar daal diya h-->is payload/decode  ---->is payload ko login k time generate kiya tha-->payload->is payloaad m email,id,accountType pada hua h
    // and we need id->so,go to middleware->request->user..->id nikal lena
    // validation
    // if (!contactNumber || !gender || !id) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "All fields are required",
    //   });
    // }
    // find profile-->since,aapne profile already bana rkhi h
    // how??-->kya mere paas profileId padi h kya ?->no   // ->we have user id...uske andar profile id ho skti h

    // so userDetails  nikal k le aate h
    // user k detail m profile id mil skti h-->wo mil gyi-->additional details h
    const userDetails = await User.findById(id);
    userDetails.firstName = firstName;
    userDetails.lastName = lastName;
    await userDetails.save();
  	const profile = await Profile.findById(userDetails.additionalDetails);
    // pura data nikal liya-->profile ka data
    // const profileDetails = await Profile.findById(profileId);*
	// Update the profile fields
  profile.dateOfBirth = dateOfBirth;
  profile.about = about;
  profile.contactNumber = contactNumber;//abhi Db m change nhi hua h...bs jo data aya h usko change kiya
  profile.gender = gender; 
  // upar k 4 ...objects h...
    // ab save fxn krke Db m entry kro..  //alternate-->create se kr skte the...
    await profile.save(); //object ka naam ->profileDetails
    // done..
    const updatedUserDetails = await User.populate(
      userDetails,
      "additionalDetails"
    );
    // return res
  	return res.json({
			success: true,
			message: "Profile updated successfully",
			updatedUserDetails,
		});
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// deleteAccount
//Explore -> how can we schedule this deletion operation----chromejone
exports.deleteAccount = async (req, res) => {
  try {
    // get id to delete
    // validation-->check valid user or not
    // 1.delete profile[additional details]
    // 2.delete user[]
    // response retrun
	// TODO: Find More on Job Schedule
		// const job = schedule.scheduleJob("10 * * * * *", function () {
		// 	console.log("The answer to life, the universe, and everything!");
		// });
		// console.log(job);
    // START
    // get id to delete
    // console.log("Printing Id:",req.user.id);
    const id = req.user.id;
    // console.log("Printing Id:",req.user);
    // validation-->check valid user or not
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // 1.delete profile[additional details]
    await Profile.findByIdAndDelete({ _id: user.additionalDetails });
    //TODO: HW unenroll user form all enrolled courses

    // 2.delete user[]
    await User.findByIdAndDelete({ _id: id });
    // response retrun

    return res.status(500).json({
      success: false,
      message: "User cannot be deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User cannot be deleted successfully",
    });
  }
};
//

exports.getAllUserDetails = async (req, res) => {
  try {
    // get id
    // validation &  get user details

    // return response

    // START
    // get id
    const id = req.user.id;
    // validation & get user details
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec(); //

    // return response
    return res.status(200).json({
      success: true,
      message: "User Data Fetched Successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};
// to enroll students in a course
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId})
      .populate({
        path: "courses",
        populate: {
        path: "courseContent",
        populate: {
          path: "subSection",
        },
        },
      })
    .exec()

//not my ---lb
// isse progress bar update ho rhi
userDetails = userDetails.toObject()
var SubsectionLength = 0
for (var i = 0; i < userDetails.courses.length; i++) {
let totalDurationInSeconds = 0
SubsectionLength = 0
for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
  totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
  userDetails.courses[i].totalDuration = convertSecondsToDuration(
  totalDurationInSeconds
  )
  SubsectionLength +=userDetails.courses[i].courseContent[j].subSection.length
}
let courseProgressCount = await CourseProgress.findOne({
  courseID: userDetails.courses[i]._id,
  userId: userId,
})
courseProgressCount = courseProgressCount?.completedVideos.length
if (SubsectionLength === 0) {
  userDetails.courses[i].progressPercentage = 100
} else {
  // To make it up to 2 decimal point
  const multiplier = Math.pow(10, 2)
  userDetails.courses[i].progressPercentage =
  Math.round(
    (courseProgressCount / SubsectionLength) * 100 * multiplier
  ) / multiplier
}
}



    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    // console.log("ENROLLED COURSES",userDetails.courses)
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};



exports.instructorDashboard = async(req,res)=>{
  try {
      //geting intructor all courses
    const courseDetails= await Course.find({instructor:req.user.id});
    // traversing each course

//getting info from course
    const courseData =courseDetails.map((course)=>{
      const totalStudentsEnrolled= course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled*course.price;
     

      //create a new object with the additional fields
      const courseDataWithStats={
        _id:course._id,
        courseName:course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
        // totalDuration
      }
      return courseDataWithStats
    })

res.status(200).json({courses:courseData})
  } catch (error) {
    console.error(error);
		res.status(500).json({message:"Internal Server Error"});
  }
}