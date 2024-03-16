import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../services/apiconnector";
import { contactusEndpoint } from "../../services/apis";
import CountryCode from "../../data/countrycode.json"
import "../../../src/App.css"
import { toast } from "react-hot-toast";
const ContactUsForm = () => {
  const [loading, setLoading] = useState(false); //ye loading auth-Slice[[jo sirf auth m use hongi]] ki loading nhi h...ye openRoute ki h...koi v aa skta h
  const {
    register, //register naam ka ek fxn h..[already in-]
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm(); //useForm hook se ye saari cheezein fetch kr li..taaki easily use kr ske
  const submitContactForm = async (data) => {
    //submit hone pr sare data backend m send krni h..using kisi backend ki api
    // console.log("Logging data", data);
    const toastId = toast.loading("Loading...");
    try {
      setLoading(true);
      const response = await apiConnector("POST",contactusEndpoint.CONTACT_US_API,data);
      // const response = { status: "OK" };
      // console.log(" Loging response", response);
      toast.success("Message Sent Successful");
    } catch (error) {
      console.log("Error:", error.message);
      setLoading(false);
    }
    setLoading(false);
    toast.dismiss(toastId);
  };
  useEffect(() => {
    if (isSubmitSuccessful) {
      if(loading===false) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phonenumber: "",
      });
    }
    }
    
  }, [reset, isSubmitSuccessful,loading]); //reset fxn v aana chahiye-->qki isko hook sambhal rha naki main samhal r
  // so,form ka structure change hone pr ye changes show
  return (
    <form onSubmit={handleSubmit(submitContactForm)}>
      <div className="flex flex-col gap-7">
        <div className=" flex flex-col lg:flex-row gap-5">
          {/* first name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="firstname"><p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]"> First Name <sup className="text-pink-200">*</sup> </p></label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              placeholder="Enter First Name" //useFormhook -->a libray for easy to use..already in-built fxns are availale 
              {...register("firstname", { reuired: true })} ///sirf register se saaar kuchh automatic handle ho ja rha...form k submission hone se..jo phle manually handle kiya k
              className="form-style"
            />

            {errors.firstname && <span className="-mt-1 text-[12px] text-yellow-100">Please Enter your name</span>}
          </div>
          {/* last name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="lastname"><p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]"> Last Name</p></label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              placeholder="Enter last Name"
              {...register("lastname")} ///
              className="form-style"
            />
          </div>
        </div>
        {/* email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email"><p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]"> Email <sup className="text-pink-200">*</sup> </p></label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            {...register("email", { required: true })}
            className="form-style"
          />
          {errors.email && <span className="-mt-1 text-[12px] text-yellow-100">Please Enter your email address</span>}
        </div>

{/* phone No */}
<div className="flex flex-col gap-2">
<label className="lable-style" htmlFor="phonenumber"> <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]"> Phone Number <sup className="text-pink-200">*</sup> </p></label>
<div className="flex gap-5">
{/* dropdown */}
  <div className="flex w-[81px] flex-col gap-2">
  <select
    name="dropdown"
    id="dropdown"
    className='form-style'
    {...register("countrycode",{reuired:true})}>
        {
    CountryCode.map((element,index)=>{
    return(
        <option key={index} value={element.code} >
        {element.code} -{element.country}
        </option>
    )
})
        }
    </select>
  </div>

{/*ph no.  */}

    <div className="flex flex-col w-[calc(100%-90px)] gap-2">
    <input
    type="tel"
    name="phonenumber"
    id="phonenumber"
    placeholder="12345 67890"
    className="form-style"
    cols="30"
    rows="7"
{...register("phonenumber",{
     required:{value:true,message:"Please enter Phone Number"},//required:true hi h  ,but with message bs..
maxLength:{value:10,message:"Invalid Phone Number" }, //validation
minLength:{value:9,message:"Invalid Phone Number" },
valueAsNumber:{value:"Invalid Phone Number"}
},

)}
    />

    </div>

</div>



{
    errors.phonenumber&&(
        <span className="-mt-1 text-[12px] text-yellow-100"> 
            {errors.phonenumber.message}
        </span>
    )
}



</div>
        {/* message box */}
        <div className="flex flex-col gap-2">
          <label htmlFor="message"><p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]"> Message <sup className="text-pink-200">*</sup> </p></label>
          <textarea
            name="message"
            id="message"
            cols="30"
            rows="7"
            placeholder="Enter Your message here"
            {...register("message", { required: true })}
            className="form-style"
          />
          {errors.message && <span className="-mt-1 text-[12px] text-yellow-100">Please enter your message</span>}
        </div>

        {/* button */}
        <button
          className=" hover:text-yellow-900 rounded-md ease-in bg-yellow-50 text-center px-6 py-3 sm:text-[16px] hover:scale-95 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all duration-200 hover:shadow-none text-[16px] font-bold text-black"
          type="submit"
        >
            {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
};
export default ContactUsForm;
