const { contactUsEmail } = require("../mail/templates/contactFormRes")
const Contact = require("../models/Contact")
const mailSender = require("../utils/mailSender")
exports.contactUsController = async (req, res) => {

  try {
    const { email, firstname, lastname, message, phonenumber, countrycode } = req.body
    // console.log(req.body)
    //validate
    if (!firstname || !email || !phonenumber || !message) {
      return res.status(400).json({
        success: false,
        message: "All fileds are needed",
      });
    }
    const proccessedLastName=lastname? lastname:"";
    //saving data in db
    const contactDetails=await Contact.create({
      firstname: firstname,
      lastname:proccessedLastName,
      email: email,
      phonenumber:`${countrycode}-${phonenumber}`,
      message:message,
    })
    if(!contactDetails){
      return res.status(400).json({
        success: false,
        message: "contact details are not found",
      });
    }
    const mailSendToUser = await mailSender(
     contactDetails.email,
      "Your Data send successfully",
      contactUsEmail(contactDetails)
      // contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )
    console.log("Email Res ", mailSendToUser)
    
    if(!mailSendToUser){
      return res.status(400).json({
        success: false,
        message: "Mail to user is not send Successfully",
      });
    }
    const mailSendToMe=await mailSender(
      `mohitkumarmandal962@gmail.com`,
      "You Got a Response ",
      contactUsEmail(contactDetails)
    )
    console.log("Email to Me", mailSendToMe)
    return res.json({
      success: true,
      message: "Conatct me Details create successfully",
    })
  } catch (error) {
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}
