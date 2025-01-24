const express = require("express");
const router = express.Router();
const { auth, isInstructor,isStudent } = require("../middlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
<<<<<<< HEAD
} = require("../controllers/Profile");
const { changePassword } = require("../controllers/Auth");

=======
} = require("../controllers/Profile")
const { changePassword } = require("../controllers/Auth");
>>>>>>> fcb6f7b19227a1dfe79b0a6a2e21f03ba68e65ca
// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile",auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.put("/changePassword", auth, changePassword)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth,getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/instructorDashboard",auth ,isInstructor ,instructorDashboard)
module.exports = router
