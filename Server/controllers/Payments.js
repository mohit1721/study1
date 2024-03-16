const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
// const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");
// const { convertSecondsToDuration } = require("../utils/secToDuration");
// NEW WAY-->FOR MULTIPLE Courses

// initiate the razorpay order
//bhale payment na kri ho

//1.to order initiate
exports.capturePayment = async (req, res) => {
  // jb buy now p click
  const {courses}=req.body;
  const userId=req.user.id;
  if(courses.length===0){
    return res.json({success:false,
      message:"Please provide CourseId"})
  }
  //total amount-->Rs.100*5


let totalAmount=0;
for(const course_id of courses){
  let course;
  try {

    course=await Course.findById(course_id); //  
    if(!course){
      return res.json({
        success:false,
        message:'Could not find the course',
    });
    }
   

const uid=new mongoose.Types.ObjectId(userId);
//chk if user already enrolled
if(course.studentsEnrolled.includes(uid)){
  return res.json({
    success:false,
    message:'Student is already enrolled',
});
}
totalAmount +=course.price;


} catch (error) {
    return res.json({
      success:false,
      message:error.message,
  });
  }
}
// const currency="INR";//-*****
const options={
  amount:totalAmount*100,
  currency:"INR",
  receipt:Math.random(Date.now()).toString(),
}
try {
  //create order/response
  const paymentResponse = await instance.orders.create(options);
  res.json({
    success:true,
    data:paymentResponse,
    msg:'order Created [glti..data send always ]'
  })  
} catch (error) {
  console.log(error);
  return res.status(400).json({
      success:false,
      message:"Could not initiate order",
  });
}
}
//2.verify the payment'
// only signatuure verifaction done here--->JO SIGNATURE TUMNE CREATE KIYA AUR, JO RAZORPAY SE AAYA H,KYA WO MATCH KR RHA H...IF YES..CONSIDER A SUCCESSFUL PAYMENT-->BASIS ON that Assign a course
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id=req.body?.razorpay_order_id;
    const razorpay_payment_id=req.body?.razorpay_payment_id;
    const razorpay_signature=req.body?.razorpay_signature;
    const courses =req.body?.courses;
    const userId=req.user.id;
    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
      return res.status(401).json({success:false,message:'Payment Failed '});
    }
// FROM RAZORPAY DOC.   //PIPE Optr
let body=razorpay_order_id+"|"+razorpay_payment_id;
const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_SECRET)
.update(body.toString())
.digest("hex");
if(expectedSignature === razorpay_signature){
//enroll karwao student
enrollStudents(courses,userId,res)
return res.status(200).json({success:true,message:"Payment Verified"});
//--->1.saare courses p traverse kro har course ki student enrolled andr ki list pr bacche ki userId insert kr do
//--->2.jo user h jisne course/courses buy kiye h ->wo saare k saare course/courses ids us bachche ki v course k list m insert kr do
//return res
}
// return res.status(500).json({success:false,message:"Payment Not Verified"});
}
// 3. after verification..enroll student
const enrollStudents=async(courses,userId,res)=>{
  // a.saare courses  p travel, har "course" ki "StudentsEnrolled" ki list m userId insert kr do bacche ki
  // b.jo user h,jo courses buy kiye h..us bachhe k "coursseList" m ,wo saare "courseId"s insert kr do
  if(!courses || !userId) {
  return res.status(404).json({
    success:false,
    message:"Please provide data for Course ID or UserId"});
}
//ab multiple courses h to har course k andar bacche ko insert krna padega--> 
//to har courses k andar traverse krna padega
for(const courseId of courses){
  try {
    // #NOTE-->push means->insert
  //1. find the course and enroll the student in it
  const enrolledCourse=await Course.findByIdAndUpdate(
    { _id: courseId },
  {$push:{studentsEnrolled:userId}}, // studentEnrolled m unserId ko insert kr di
  {new:true},  //for updated
)
// console.log("Enrolled course 1: ", enrolledCourse)
if(!enrolledCourse){
  return res.status(500).json({
    success: false,
    message: "Course not Found",
  }); 
}
// console.log("Enrolled course 2: ", enrolledCourse)
//verify payment done hone k baad,uss bachhe ki uss course m progress object create krni pdegi ,initially..
// A.
const courseProgress = await CourseProgress.create({
  courseID:courseId,
  userId:userId,
 completedVideos:[], //array empty at starting
})

// 2. find the student and add the course to their enrolled Courses
const enrolledStudent=await User.findByIdAndUpdate(
  userId, //ye chhuta tha
  {$push:{
    courses:courseId,
  courseProgress:courseProgress._id,//B. courseProgress associate 
  }, //course id m insert krna h
},
{new:true},
//bachhe ko mail send krdo
)

if (!enrolledStudent) {
  return res.status(401).json({
    success: false,
    message: "User Not Found",
  });
}

// console.log("Enrolled student: ", enrolledStudent)

const emailResponse =await mailSender(
  enrolledStudent.email,
 `Successfully Enrolled into ${enrolledCourse.courseName}`,
 courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstName} ${enrolledStudent.lastName}`) 
);

// console.log("Email Sent Successfully ", emailResponse.response)

  } catch (error) {
    console.log("Error while enrolling student in course and vice versa",error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });


  }
}

}



exports.sendPaymentSuccessEmail=async(req,res)=>{
  const {orderId,paymentId,amount}=req.body;
  const userId=req.user.id;
  if(!orderId || !userId || !paymentId|| !amount ) return res.status(400).json({success:false, message:"Please provide all the fields"});
//student ko dhundo aur mail send kro usko
try {
  //student ko dhundo 
  const enrolledStudent=await User.findById(userId);
  await mailSender(
    enrolledStudent.email,
    `Payment Recieved`,
    paymentSuccessEmail(`${enrolledStudent.firstName}`,
    amount/100,orderId,paymentId)
  )
} catch (error) {
  console.log("error in sending mail", error)
  return res.status(500).json({success:false, message:"Could not send email"})
}

}



// OLD WAY -->FOR SINGLE COURSE ONLY

// // capture the payment and initiate the Razorpay Order
// // CREATE ...PAYMENT ...
// exports.capturePayment = async (req, res) => {//JB TUM BUY-NOW PE CREATE CLICK KRTE HO
//   // 2 cheeze pta ahoni chahiye--->kon le rha ...kon si course le rha h
//   // get user ID, courseID
//   // courseId->send krne ka trika //  userID-->auth middleware-->payload.....user.req.id
//   const { course_id } = req.body;
//   const userId = req.user.id;
//   // validation
//   // valid courseID
//   if (!course_id) {
//     return res.json({
//       success: false,
//       message: "Please provide valid course ID",
//     });
//   }

//   // valid courseDetail
//   let course; //db call krna h
//   try {
//     course = await Course.findById(course_id); //course ka data mil gya
//     if (!course) {
//       return res.json({
//         success: false,
//         message: "Could not find the course",
//       });
//     }

//     // user already pay for the same course
//     //   convert userid from string to objectID
//     const uid = new mongoose.Types.ObjectId(userId);
//     if (course.studentsEnrolled.includes(uid)) {
//       return res.status(200).json({
//         success: false,
//         message: "Student is already Enrolled",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }

//   // order create
//   const amount = course.price;
//   const currency = "INR";
  
//   const options = {
//     //object h
//     amount: amount * 100,
//     currency,
//     reciept: Math.random(Date.now()).toString(),
//     notes: {
//       ///additional data
//       courseId: course_id,
//       userId,
//     },
//   };

//   try {
//     // initialize the paymenty using RZ
//     const paymentResponse = await instance.orders.create(options); //order create
//     console.log(paymentResponse);
//     // return response
//     return res.status(200).json({
//       success: true,
//       courseName: course.courseName,
//       courseDescription: course.courseDescription,
//       thumbnail: course.thumbnail,
//       orderId: paymentResponse.id,
//       currency: paymentResponse.currency,
//       amount: paymentResponse.amount, ///ye saari cheezein response m pass kr di
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({
//       success: false,
//       message: "Could not Instantiate Order",
//     });
//   }

//   // return res

//   // START

//   // course ki id send krne ka trika-->
// };
// // verify Signature of Razorpay Server-->USING WEBHOOK
// // AUTHORIZATION
// // jo db m secret h aur jo razorpay n veja h..un dono ki matching krni h
// exports.verifySignature = async (req, res) => {
//   const webhookSecret = "12345678"; //ye server[db] pe h
//   const signature = req.headers["x-razorpay-signature"]; //razorpay k andar isss key[x-razorpay-signature]          //ye razorpay se ayega
//   // step:A
//   const shasum = crypto.createHmac("sha256", webhookSecret);
//   //  step:B
//   //   Hmac ko string m convert krna h
//   shasum.update(JSON.stringify(req.body));
//   //  step:C
//   const digest = shasum.digest("hex");
//   // ab mujhe digest  ko aur signature ko match krna h

//   if (signature === digest) {
//     console.log("payment is authentorised");

//     // real story starts
//     //  courseId aur userID nikal lo  //
//     const { courseId, userId } = req.body.payload.payment.entity.notes;
//     try {
//       // fulfill the action

//       // find the course and enroll the student in it
//       const enrolledCourse = await Course.findOneAndUpdate(
//         { _id: courseId },
//         { $push: { studentsEnrolled: userId } },
//         { new: true }
//       );
//       // validate
//       if (!enrolledCourse) {
//         return res.status(500).json({
//           success: false,
//           message: "Course not found",
//         });
//       }
//       console.log(enrolledCourse);
//       // find the student and add the course to their list of enrolled courses me
//       const enrolledStudent = await User.findOneAndUpdateCourse(
//         { _id: courseId },
//         { $push: { courses: courseId } },
//         { new: true }
//       );
//       console.log(enrolledCourse);
//       // confirmation wala mail send krna h
//       const emailResponse = await mailSender(
//         enrolledStudent.email, // student k mail m send krna h
//         "Congratulation from CodeHelp",
//         "Congratulations ,You are onboard into the Codehelp course"
//       );
//       console.log(emailResponse);
//       return res.status(200).json({
//         success: true,
//         message: "Signature Verified and Course Added",
//       });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }
// else{
//     //signature match nhi hua
//     return res.status(400).json({
//         success: false,
//         message:"Invalid Request",
//     })
// }



// };
