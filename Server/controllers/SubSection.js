const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
// create  a SubSection
exports.createSubSection = async (req, res) => {
  try {
    // fetch data from request body
    // sectionId  --> subsection kis section k andar hogi uske liye sectionId chahiye
    const { sectionId, title, description } = req.body;
    // extract file/video
    const video = req.files.video;
    // validation
    if (!sectionId || !title || !description || !video) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }
    // upload video to cloudinary-->get url
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    // secure url-->uploadDetails k anadr mil jayega
    // console.log(uploadDetails);
    // create a SubSection

      //ks
    const totalDuration = convertSecondsToDuration(`${uploadDetails.duration}`);
//  const totalDuration = courses.map(item => item.totalDuration).reduce((acc, curr) => acc + curr, 0);
// const newtotalDuration = convertSecondsToDuration(`${uploadDetails.duration}`);
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: totalDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // update section with this sub-section ObjectId-->using findByIdAndUpdate fxn
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId }, //kiske dwara update-->by section id
      {
        $push: {
          //kya changes...subsectio push krna h
          subSection: SubSectionDetails._id,
        }
      },
      { new: true }
    ).populate("subSection");


    //   section k andar subsection ka data id k form k show hoga-->to show ,use populate
    //   HW :log updated section here ,after adding populate query

    // return res
    return res.status(200).json({
      success: true,
      data:updatedSection//**sent**/
    });
  } catch (error) {
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//HW: updateSubSection
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body; //input se le rhe
    const subSection = await SubSection.findById(subSectionId);   //glti++ 

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();
    // GLTII++
    const updatedSection=await Section.findById(sectionId).populate("subSection") //data nikal liya
    return res.json({
      success: true,
      data:updatedSection,//response m updated section return kr rhi..TAKI UI M SHOW KR SKU UPDATED WALA....**must-->yehi fase the...
      message: "Section updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    });
  }
};

//HW:deleteSubSection

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    );
    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });

    }

    const updatedSection=await Section.findById(sectionId).populate("subSection") //data nikal liya
    return res.json({
      success: true,
      data:updatedSection,//data send***yehaan fase the**
      message: "SubSection deleted successfully",
      //send data to render on UI


    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    });
  }
};


// Profile ka dusra naam additional details


//  ->**UPDATED-SECTION KA USE KRKE UPDATED-COURSE BANANA PADEGA TB USSE MEIN SET KAR PAUNGA...DIRECTLY RESULT KO FEED KRNE SE GALAT HOGA  */
// DO IN NESTED_VIEW FILE