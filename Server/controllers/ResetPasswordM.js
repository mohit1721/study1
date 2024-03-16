//resetPasswordToken--->mail send

//resetPassword-->DB m store after changing

const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
//resetPasswordToken--->mail send

exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req body
    //check user for this email, email validation
    //<....link generate-->
    //generate token...
    //  update user by adding token and expiration time
    // create url .
    // send email containing url
    // return response

    //get email from req body
    const email = req.body.email;
    //check user for this email, email validation
    //check user for this email , email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      });
    }
    //<....link generate-->
    //generate token...
    // const token = crypto.randomUUID(); //..abhi k liye ...UUID hi as a token maan lete h
    const token = crypto.randomBytes(20).toString("hex");

    //  update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() +3600000,
      },
      { new: true } //naya wala update hoke show hoga
    );
    // console.log("DETAILS", updatedDetails);
    // create url .
    const url = `http://localhost:3000/update-password/${token}`; //always diff link ...because of token...which will diff always
    // send email containing url
    await mailSender(email,
       "Password Reset Link", 
       `Your Password Reset Link ${url} .Please click this url to reset your password.`);
    // return response
     res.json({
      success: true,
      message:
        "Email sent successfully ,please check your email and Change Password",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error.message,
      success: false,
      message: "Something went wrong while sendig reset pwd mail ",
    });
  }
};

//resetPassword-->DB m store after changing
//naye password ko reset /enter kr rhe ho

exports.resetPassword = async (req, res) => {
  try {
    //1.data fetch
    const { password, confirmPassword, token } = req.body//ye frontend se hoga
    //2.validation
    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      })
    }
    //use of token--->user k andar password ki entry ko update krna padega
    //user ki entry nikaloge kaise-->using token....//taki baad m nye password ko update kr sku
    //3.get user details from db using token
    const userDetails = await User.findOne({ token: token });
    // 4.if no entry--invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is invalid",
      });
    }
    // 5.token time check
    if (!(userDetails.resetPasswordExpires > Date.now())) {
      //5 min. nikl chuki h...5:05 < 6:00
      return res.status(403).json({
        success: false,
        message: `Token is Expired, Please Regenerate Your Token`,
      })
    }
    // 6.hash pwd
    const encryptedPassword = await bcrypt.hash(password, 10);
    // 7.password update
    await User.findOneAndUpdate( //GALYI--++--->not findByIdAndDelete
      { token: token }, //searching criteria
      { password: encryptedPassword }, //ye wali value update
      { new: true } //new vali value return kr dena
    )
    // 8.return res
     res.json({
      success: true,
      message: `Password Reset successful`,
    })
  } catch (error) {
    
    return res.json({
      error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
    })
  }
}


// exports.resetPassword = async (req, res) => {
//   try {
//     const { password, confirmPassword, token } = req.body

//     if (confirmPassword !== password) {
//       return res.json({
//         success: false,
//         message: "Password and Confirm Password Does not Match",
//       })
//     }
//     const userDetails = await User.findOne({ token: token })
//     if (!userDetails) {
//       return res.json({
//         success: false,
//         message: "Token is Invalid",
//       })
//     }
//     if (!(userDetails.resetPasswordExpires > Date.now())) {
//       return res.status(403).json({
//         success: false,
//         message: `Token is Expired, Please Regenerate Your Token`,
//       })
//     }
//     const encryptedPassword = await bcrypt.hash(password, 10)
//     await User.findOneAndUpdate(
//       { token: token },
//       { password: encryptedPassword },
//       { new: true }
//     )
//     res.json({
//       success: true,
//       message: `Password Reset Successful`,
//     })
//   } catch (error) {
//     return res.json({
//       error: error.message,
//       success: false,
//       message: `Some Error in Updating the Password`,
//     })
//   }
// }