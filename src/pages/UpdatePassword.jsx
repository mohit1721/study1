import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react';
import { FaPassport } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
 import {PiEyeClosedDuotone,PiEyeDuotone} from "react-icons/pi";
 import { Link } from 'react-router-dom';
 import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
 import { resetPassword } from "../services/operations/authAPI";
//  This page's link comes in your email for reseting password 
 const UpdatePassword = () => {
    const dispatch= useDispatch();
    const location= useLocation();
    const navigate = useNavigate()
    const {loading} =useSelector((state)=>state.auth);
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);

    const [formData,setFormData]=useState({
        password:"",
        confirmPassword:"",
    })
    const {password,confirmPassword}=formData;//formData m se password aur confirmPassword nikal li..
    
    const handleOnChange=(e)=>{
        setFormData((prevData)=>(
            {
                ...prevData,//...-->copy prev. data
                [e.target.name]:e.target.value, //+ copy/update new data
            }
        ))
    }
    //action dispatch
    const handleOnSubmit =(e)=>{
        e.preventDefault();
        const token=location.pathname.split('/').at(-1);  //email m link k last m pada hoga
        dispatch(resetPassword(password,confirmPassword,token,navigate))   //DB/API call krega using resetPassword funct...uske liye password fetch krna padega[[in line-21]]
        
    
    }
  return (
    

    <div className='text-white'>
    {
        loading?<div>Loading</div>:<div>
            <h1>Choose New password</h1>
            <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            Almost done. Enter your new password and youre all set.
          </p>
          <form onSubmit={handleOnSubmit}>
        <label>
            <p className=''>New Password<sup>*</sup> </p>
            <input
            required
            className='w-full p-6 bg-richblack-600 text-richblack-5'
            type={showPassword?"text":"password"}
            name='password'
            value={password}
            placeholder='New Password'
            onChange={handleOnChange}
            />
                <span    // password ko visible -invisible kr rhe
                onClick={()=>setShowPassword((prev)=>!prev)} //prev. state toggle
                >  
                     {
                        showPassword ?
                         <PiEyeDuotone fontSize={24} /> 
                        :<PiEyeClosedDuotone fontSize={24}/>
                     }
                </span>
            
        </label>

        <label>
            <p className=''>Confirm New Password<sup>*</sup> </p>
            <input
            required
           
            type={showConfirmPassword?"text":"password"}
            name='confirmPassword'
            value={confirmPassword}
            onChange={handleOnChange}
            placeholder='Confirm Password'
            className='w-full p-6 bg-richblack-600 text-richblack-5'
            />
                <span
                onClick={()=>setShowConfirmPassword((prev)=>!prev)} //prev. state toggle
                >
                     {
                        showConfirmPassword ?
                         <PiEyeDuotone fontSize={24} /> 
                        :<PiEyeClosedDuotone fontSize={24}/>
                     }
                </span>
            
        </label>



       

                     <button type='submit'>
                        Reset Password
                     </button>


          </form>

          <div>
            <Link to="/login">
              <p>Back To Login</p>
            </Link>
          </div>
        </div>
    }
    
    </div>
  )
}
export default UpdatePassword