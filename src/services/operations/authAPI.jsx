import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../slices/authSlice"
import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { endpoints } from "../apis"


const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      // console.log("mk1");
      // console.log(email)
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      // console.log("mk2")
      // console.log("SENDOTP API RESPONSE.......", response)

      console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      // console.log("mk3")
      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
      // console.log("mk4")
    }
     catch (error) {
      // console.log("mk5")
      console.log("SENDOTP API ERROR........", error)
      // toast.error("Could Not Send OTP")
      toast.error(`${error.response.data.message}`);
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}


export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      // console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      // toast.error("Signup Failed")
      toast.error(`${error.response.data.message}`);
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}
//ye backend  ko call kr rha h..apna function h
export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      // console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      // toast.success("Login Successful")
      toast.success(`${response.data.message}`)
      dispatch(setToken(response.data.token))
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user, image: userImage }))
      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("user", JSON.stringify(response.data.user )) //#LEARNT IMP. OF LOCALSTORAGE 1:41:42
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("LOGIN API ERROR..........", error)
      // toast.error("Login Failed")
      toast.error(`${error.response.data.message}`);
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}
// updated
 

export function getPasswordResetToken(email,setEmailSent){
  return async (dispatch)=>{//since network/db call -->async
    const toastId=toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
    const response =await apiConnector("POST",RESETPASSTOKEN_API ,{email})  //controlller m sirf email chahiye tha isliye email send kiya sirf
    // console.log("RESET PASSWORD TOKEN RESPONSE..",response);
    if(!response.data.success){
      throw new Error(response.data.message);
    }
    toast.success("Reset Email Sent")
    setEmailSent(true);

    } catch (error) {
      console.log("RESET PASSWORD TOKEN ERROR",error);
      toast.error(`${error.response.data.message}`);
      // toast.error("Failed to send email for resetting password")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false));
   
  }
}
//yehaan resetPassword fxn jo backend ka fxn h bs usee call kr rhe..
// export function resetPassword(password,confirmPassword,token,navigate){
//   return async (dispatch)=>{
//     const toastId = toast.loading("Loading...")
//     dispatch(setLoading(true))
//     try {
//     const response =await apiConnector("POST",RESETPASSWORD_API,
//     {password,
//     confirmPassword,
//     token})
//     console.log("RESET PASSWORD RESPOONSE..",response);
//     if(!response.data.success){
//       throw new Error(response.data.message);
//     }
//     toast.success("Password has been reset successfully")
//     navigate("/login")
//     } catch (error) {
//       console.log("RESET PASSWORD ERROR",error);
//       toast.error("Unable to reset password")
//     }
//     toast.dismiss(toastId)
//     dispatch(setLoading(false));
//     }
  
// }
export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    // const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
        navigate
      })

      // console.log("RESETPASSWORD RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Password Reset Successfully")
      
      navigate("/login")
     
    
    } catch (error) {
      console.log("RESET PASSWORD ERROR............", error)
      // toast.error("Failed To Reset Password")
      toast.error(`${error.response.data.message}`);
      // return;
    }
    // toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}


