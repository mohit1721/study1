const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary  } = require("../utils/imageUploader");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")
require("dotenv").config();

//1.createCourse handler fxn
exports.createCourse = async (req, res) => {
  try {
       // Get user ID from request object
       const userId = req.user.id;
    //fetch data                                            //ye jo tag h..wo Objectid h..since reference rkhi h
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag:_tag,
      category,
      status,
      instructions:_instructions,
      courseLanguage,
      courseLevel
   
    } = req.body;
        // Convert the tag and instructions from stringified Array to Array
        const tag = JSON.parse(_tag);
        const instructions = JSON.parse(_instructions);
    
    //get thumbnail image from request files
    const thumbnail = req.files.thumbnailImage;
    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail ||
      !category ||
      !courseLanguage ||
      !courseLevel
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Mandatory",
      });
    }
    if (!status || status === undefined) {
      status = "Draft";
    }

    // check for instructor validation???why nedd DB call here for instructor--> course k andar instructor store krna padta....--uski objectId store krni padti...to uske liye Db call krni h
    // const userId = req.user.id;

    // const instructorDetails = await User.findById(userId, {
    //   accountType: "Instructor",
    // });

     // Check if the user is an instructor
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });
    // console.log("Instructor Details: " + instructorDetails); //
    // TODO : Verify that userId and instructorDetails._id  are same or different ?
    // let say is userId k corresponding data hi nhi mila...
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }
 if (!status || status === undefined) {
			status = "Draft";
		}
    //check given category is valid or not
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }
    // upload image to cloudinary
    const thumbnailImage   = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
 
    // console.log(thumbnailImage);
    // create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id, //instructor ek ObjectId h...
      whatYouWillLearn:whatYouWillLearn,
      price,
      tag: tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions: instructions,
      language : courseLanguage,
      level:courseLevel
    });
    // user [instructor] ko update ...create list m
    // add the new course to the user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // Add the new course to the Categories
    await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // return res
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Course",
      error: error.message,
    });
  }
};

// 2.getAllCourses handlers fxn

exports.getAllCourses = async (req, res) => {
  try {
    //TODO: change the below statement incrementally
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
        createdAt:true,
        category:true,
      }
    )
      .populate("instructor")
      .exec();
    return res.status.json({
      success: true,
      message: "Data for all courses fetched successfully",
      data: allCourses, //data pass kr diya
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};
// 3.getcourseDetails
exports.getCourseDetails = async (req, res) => {
  try {
    // get id
    const { courseId } = req.body;
    // const userId = req.user.id;
    // find course details
    const courseDetails = await Course.findOne({
      _id: courseId,
    }) //is basis pe find out krna h
      // jo jo chhiye///  populate v krna h
      .populate({
        path: "instructor",
        populate:[ {
          path: "additionalDetails",
        },
        {
          path:"courses",
        },]
      })
      .populate("category")
      .populate(
      {  
      path:"ratingAndReviews",//TO SHOW REVIEWS COURSE-WISE**++
      populate:{
        path:"user"
      }    
      })

      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select:"-videoUrl",
        },
      })
      .exec();

   
    //   validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with  ${courseId}`,
      });
    }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)


    // return res //success
    return res.status(200).json({
      success: true,
      message: "Course Details fetched successfully",
      data: {
        courseDetails,
        totalDuration,
      },
    });
  } catch (error) {
    // (error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });}
  
};


// COPIED
// Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      // console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// video
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    // console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id
  
    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

//     // let totalDurationInSeconds = 0
//     // courseDetails.courseContent.forEach((content) => {
//     //   content.subSection.forEach((subSection) => {
//     //     const timeDurationInSeconds = parseInt(subSection.timeDuration)
//     //     totalDurationInSeconds += timeDurationInSeconds
//     //   })
//     // })
//     let totalDuration=0;
// // 1. traverse each course of instructor
//     for(const courseId of instructorCourses)
// {
//   // 
//   const courseDetails = await Course.findOne({
//     _id: courseId,
//   })
//     // Check if courseDetails is null or undefined
//     if (!courseDetails) {
//       console.error("Course details not found for courseId:", courseId);
//       continue; // Skip to next iteration of the loop
//     }
  
//     // Check if courseContent is null or undefined
//     if (!courseDetails.courseContent || !Array.isArray(courseDetails.courseContent)) {
//       console.error("Invalid course content for courseId:", courseId);
//       continue; // Skip to next iteration of the loop
//     }
//   let totalDurationInSeconds = 0
//   courseDetails.courseContent.forEach((content) => {

//     if (!content.subSection || !Array.isArray(content.subSection)) {
//       console.error("Invalid subsections for content:", content);
//       return; // Skip this content and continue to next iteration of forEach
//     }
//   content.subSection.forEach((subSection) => {
//     let timeDurationInSeconds = parseInt(subSection.timeDuration)
//     totalDurationInSeconds += timeDurationInSeconds
//   })
// })
//  // Add duration of current course to totalDuration
//  totalDuration += totalDurationInSeconds;
//  totalDuration = convertSecondsToDuration(totalDurationInSeconds)
// }
    


//     // const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
    
    // console.log(instructorCourses.totalDuration)
    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data:instructorCourses,
    
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}



// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}