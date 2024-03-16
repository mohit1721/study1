const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
const otpTemplate = require("../mail/templates/emailVerificationTemplate")
require("dotenv").config();
// const { response } = require("express");

//sign up
exports.signup = async (req, res) => {
  //1.data fetch from request ki body
  //2.validate krlo
  //3.  2 password match krlo
  //4.check if user exist or not

  //5.find most recent OTP stored for the user
  //6.validate OTP

  //7.Hash password
  //8.entry create in DB

  //9.return res

  //START
  try {
    //1.data fetch from request ki body

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType, //
      contactNumber, //depend on you..
      otp, //MOHIT -UNCOMMENT
    } = req.body;
    //2.validate krlo //Check if All Details are there or not
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp  // MOHIT -UNCOMMENT
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //3.  2 password match krlo
    if (password !== confirmPassword) {
      return res.status(403).json({
        success: false,
        message:
          "Password and ConfirmPassword value does not match,please try again",
      });
    }
    //4.check if user exist or not[[db call]]
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    //5.find most recent OTP stored for the user
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1); //iss email ki aadhar pr otp find out krne ki kosis kr rhe h
    //ho skta h iss email ki corresponding multiple entries mil jaye...pr mujhe ..recent wali entry otp chahiye
    // console.log(response);//recentOTP

    //6.validate OTP
    if (response.length === 0) {
      //OTP nhi mila
      return res.status(400).json({
        success: false,
        message: "OTP Not Found",
      })
    }
     else if (otp !== response[0].otp) {
      //Invalid otp
      return res.status(400).json({
        success: false,
        message: "OTP Invalid/otp not matching",
      });
    }

    //7.Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user
    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    //8.entry create in DB  // Create the Additional Profile For User
    const profileDetails = await Profile.create({
      //sb m save then object Id
      gender: null,
      dateOfBirth: null,
      about: null, //start m sb null
      contactNumber: null,
    })
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType:accountType,
      approved: approved,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })

    return res.status(200).json({
      success: true,
      user,
      message: "User is registered Successfully",
     
    })

  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "User cannot be registrered. Please try again",
    });
  }
}

//####log in #####

exports.login = async (req, res) => {
  try {
    //1.get data from req body
    // 2.validation data
    //3. user check exist or not
    //4.generate JWT,after password matching
    //5.create cookie and send response

    // START***
    //1.get data from req body
    const { email, password } = req.body
    // 2.validation data
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `All fields are required, please try again`,
      })
    }
    //3. user check exist or not
    const user = await User.findOne({ email }).populate("additionalDetails"); //populate not needded
  // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not registered,please signup first`,
      })
    }
    //4.generate JWT,after password matching[compare fxn]
    if (await bcrypt.compare(password, user.password)) {
      
      const token = jwt.sign(
        { email: user.email, id: user._id,accountType: user.accountType}, // role: user.role  MOHIT->CHANGE-1
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      )
      // Save token to user document in database
      user.token = token; //toObject....need
      user.password = undefined;
      //5.create cookie and send response.. // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message:  `User Login Success`,
      })
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Login Failure, please try again`,
    })
  }
}

 //send otp  For Email Verification
exports.sendotp = async (req, res) => {
  try {
    //1.fetch email from request ki body
    const { email } = req.body;
    //2. check if user already exists
    const checkUserPresent = await User.findOne({ email }); // to be used in case of signup
    //3.if user already exists,then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }
    //4.generate OTP-->using generate fxn ....give length..+ ..
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      // digits:true,
    })

    // console.log("OTP Generated", otp);
    //5.make sure...otp is unique-->kaise pata lgega -->mera otp ka collection m check krta hu ..ye wala otp phke se exist krta h ki nhi
    const result = await OTP.findOne({ otp: otp });
    // console.log("Result is Generate OTP Func");
		// console.log("OTP", otp);
		// console.log("Result", result);
    //6.jb tk collection m se entry mil rhi h....tb tk new otp generate krta rhunga....
    while (result) {
      otp = otpGenerator.generate(6, {
        //  ###check
        // digits:true,
        upperCaseAlphabets: false,
      })

      //7.again check...unique or not
      // result = await OTP.findOne({ otp: otp }); ///
        // result = await OTP.findOne({ otp:otp}) // Re-query the database
    }
    //8.iss otp ki entry DB m krni h
    //make payload...//data
    const otpPayload = { email, otp }; // created at //by-default likha hua h
    //8.create an entry in db for OTP
    const otpBody = await OTP.create(otpPayload);
    // console.log("OTP Body", otpBody);
    //9.return response successful
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false,
      error: error.message });
  }
}




//change password -- Controller for Changing Password
//TODO:HOMEWORK
exports.changePassword = async (req, res) => {
  //1.get data from req body
  //2.get oldPassword, newPassword, confirmNewPassowrd
  //3.validation
  //4. //update pwd in DB
  //5.send mail - Password updated...
  //6.return response

  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, 
          message: "The password is incorrect" });
    }

    // Match new password and confirm new password
    if (newPassword !== confirmNewPassword) {
      // If new password and confirm new password do not match, return a 400 (Bad Request) error
      return res.status(400).json({
        success: false,
        message: "The password and confirm password does not match",
      });
    }

    // Update password
   
   
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      // console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }



};
