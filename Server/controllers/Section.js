const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");
exports.createSection = async (req, res) => {
  try {
    // data fetch
    // data validation
    // create section
    // update course with section ObjectId
    // return res
    // START

    // data fetch
    const { sectionName, courseId } = req.body;

    // data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }
    // create section
    const newSection = await Section.create({ sectionName });

    // update course with section ObjectId....
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId, //find wala kaam krna h using CourseId
      {
        //update ...courseContent with Newsection ki Id ko
        $push: {
          courseContent: newSection._id, //create krne se id padi hoti h
        },
      },
      { new: true }
    ).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .exec();
    // HW .:use populate to replace sections/sub-sections both in the updatedCourseDetails
    // console.log(updatedCourse)
    // Return the updated course object in the response
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// updateSection
exports.updateSection = async (req, res) => {
  try {
    //  data fetch
    // data validation
    // update data-->data update krne se course m change nhi krne ki zaroorat nhi
    // return res

    //  data fetch
    const { sectionName, sectionId ,courseId} = req.body;

    // // data validation
    // if (!sectionName || !sectionId) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "Missing Properties",
    //     });
    //   }

    // update data-->data update krne se course m change nhi krne ki zaroorat nhi
    const section = await Section.findByIdAndUpdate(
      sectionId, //kis basis--id
      { sectionName }, //kya data change krna chahte ho
      { new: true }
    );
    // update k baad *course* create ,then send 
const course=await Course.findById(courseId)
.populate({
  path:"courseContent", //section is the courseContent
  populate:{//nested population...m subSection populate krna h
    path:"subSection",
  },
}).exec();
    // return res

    res.status(200).json({
      success: true,
      message: section,//
      data:course,
    });
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// DELETE a section
exports.deleteSection = async (req, res) => {
  try {
    //HW -> req.params -> test
    // const { sectionId } = req.params;
    const { courseId ,sectionId} = req.body;

    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    })

// await Section.findByIdAndDelete(sectionId);
// section ko find krke rakh lo taaki,uske subsections ko delete krne m kaam ayega ko
    const section=await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      })
    }
      // Delete the associated subsections
  await SubSection.deleteMany({ _id: { $in: section.subSection } })
  await Section.findByIdAndDelete(sectionId);
    //HW -> Course ko bhi update karo
    //findding course

// find the updated course and return it
    const course = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    }).exec()

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
