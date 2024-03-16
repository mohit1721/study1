const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");
const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,  //MOHIT - UNCOMMENT
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes
  },
});
//iske baad likhna h
async function sendVerificationEmail(email, otp) {
  try {
    // Create a transporter to send emails

    // Define the email option 

    // Send the email
    const mailResponse = await mailSender(
      email,
      "Verification Email from StudyNotion",
      emailTemplate(otp)
    );
    // console.log("Email sent successfully", mailResponse.response);
  } catch (error) {
    console.log("Error occured while sending verification email :", error); //good practice
    throw error;
  }
}
//pre middleware
// Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
  // console.log("New document saved to database");

 // Only send an email when a new document is created
 if (this.isNew) {
  await sendVerificationEmail(this.email, this.otp);
}
  next();
});
const OTP = mongoose.model("OTP",OTPSchema)
//issse phle hi likhna h
module.exports = OTP;
