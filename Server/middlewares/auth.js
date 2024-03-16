const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv")
require("dotenv").config();
const User = require("../models/User");
//auth
//isStudent
//isInstructor
//isAdmin

//START
//auth
exports.auth = async (req, res, next) => {
  try {
    //jo v ordering define krte h saare middlewares ki...usko routes m define krte h
    //auth-->json token vrify krte the...jo jwt send kiya h..wo verify krte the..wo shi h ya nhi...
    //token milne k 3 ways-->cookie,body,bearer-token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");
    //if token missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: `Token is Missing`,
      });
    }

    //verify the token-->using the verify fxn on the basis of secret_key
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET); //MOHIT decode = await jwt....///CHANGE 2
      // console.log(decode);
      req.user = decode;
    } catch (error) {
      //verification --issue
      return res.status(401).json({
        success: false,
        message: "Token is Invalid",
      })
    }
    // If JWT is valid, move on to the next middleware or request handler
    next(); //next middlleware

    //isStudent
    //isInstructor
    //isAdmin
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Something went wrong while validating the token`,
    });
  }
};

//isStudent
exports.isStudent = async (req, res, next) => {
  try {
    //2nd way....db m se account type value ko access kr lo
    const userDetails = await User.findOne({email:req.user.email});

    //1st way
    // if (req.user.accountType !== "Student") {

      // 2nd way
      if (userDetails.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Students only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

//isInstructor

exports.isInstructor = async (req, res, next) => {
  try {
    //2nd way....db m se account type value ko access kr lo
    // const userDetails = await User
    // const userDetails = await User.findOne({ email: req.user.email });

    //1st way
    if (req.user.accountType !== "Instructor") {

//2nd way
// if (userDetails.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Instructor only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

//isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    //2nd way....db m se account type value ko access kr lo
    // const userDetails = await User/
    //1st way
    // console.log("Printing AccountType ", req.user.accountType);

//2nd way-
    const userDetails = await User.findOne({ email: req.user.email });
		// console.log(userDetails);

		// console.log(userDetails.accountType);
    // 1st way
    // if (req.user.accountType !== "Admin") {

      //2nd way
      if (userDetails.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};
