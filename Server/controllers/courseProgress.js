const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");
//it keeps track of.. user iss course ki kitni video complete kr li h..
exports.updateCourseProgress = async(req,res)=>{
    
try{
    const {courseId,subSectionId}= req.body;
    const userId=req.user.id;
    //check if subSection id is Valid
        //validation
        if(!courseId || !subSectionId || !userId){
            return res.status(401).json({
              success:false,
              message: "All fileds are required"
            })
          }
      //check if subsection is present or not
    const subSection=await SubSection.findById(subSectionId);
    if(!subSection){
        return res.status(404).json({error:"Invalid SubSection"})
    }
    // console.log("SubSection Validation Done");
    //check for old entry 
    let courseProgress = await CourseProgress.findOne({
        courseID:courseId,
        userId:userId,
    });
if(!courseProgress){
return res.status(404).json({
    success:false,
    message:"Course Progress does not exist"
})
}
else
{  
//   console.log("Course Progress Validation Done");
//course progress valid
    // check for Re-Completing video/subSection
    if(courseProgress.completedVideos.includes(subSectionId))
    {
        return res.status(400).json({
            success:false,
            message:"SubSection Already Completed"
        })
    }
    //phle se completed nhi h
    //push into completed video
    courseProgress.completedVideos.push(subSectionId) //updated state...ko save krnna pdega
//    console.log("course progress push done")
}
await courseProgress.save();
// console.log("Course Progress Save call Done");
// return V. IMP 
return res.status(200).json({
    success:true,
    message:"Course Progress Updated Successfully*",

})
}
    catch(error) {
      console.log("ERROR WHILE UPDATING COURSE PROGRESS",error.message);
        return res.status(400).json({
            success:false,
            message:"Internal Server Error"});
    }
}
//ab route create krni chahiye..go to route


// exports.updateCourseProgress = async (req, res) => {
 
  
//     try {
//       const { courseId, subSectionId } = req.body
//       const userId = req.user.id
//           //validation
//     if(!courseId || !subSectionId || !userId){
//       return res.status(401).json({
//         success:false,
//         message: "All fileds are required"
//       })
//     }
//       // Check if the subsection is valid
//       const subsection = await SubSection.findById(subSectionId)
//       if (!subsection) {
//         return res.status(404).json({ error: "Invalid subsection" })
//       }
  
//       // Find the course progress document for the user and course
//       let courseProgress = await CourseProgress.findOne({
//         courseID: courseId,
//         userId: userId,
//       })
  
//       if (!courseProgress) {
//         // If course progress doesn't exist, create a new one
//         return res.status(404).json({
//           success: false,
//           message: "Course progress Does Not Exist",
//         })
//       } else {
//         // If course progress exists, check if the subsection is already completed
//         if (courseProgress.completedVideos.includes(subSectionId)) {
//           return res.status(400).json({ 
//             success:false,
//             message: "Subsection already completed" })
//         }
  
//         // Push the subsection into the completedVideos array
//         courseProgress.completedVideos.push(subSectionId)
//       }
  
//       // Save the updated course progress
//       await courseProgress.save()
  
//       return res.status(200).json({
//         success:true,
//         message: "Course progress updated" })
//     } catch (error) {
//       console.error(error)
//       return res.status(500).json({
//         success:false,
//         error: "Internal server error" })
//     }
//   }