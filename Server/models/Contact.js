const mongoose =require("mongoose");
const contactUsSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        maxLength:50,

    },
    lastname:{
        type:String,        
        maxLength:50,
    },
    email:{
        type:String,
        required:true,
    },
    phonenumber:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    
});
module.exports=mongoose.model("Contact",contactUsSchema);