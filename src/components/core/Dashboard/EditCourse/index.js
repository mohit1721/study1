import React from 'react'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import RenderSteps from '../AddCourse/RenderSteps'
import { getFullDetailsOfCourse } from '../../../../services/operations/courseDetailsAPI'
import { setCourse, setEditCourse } from '../../../../slices/courseSlice'


export default function EditCourse () {

    const dispatch = useDispatch()
    //courseId-->parameter k andar course ki id veji h-->observerd from url...[on clicking edit button]
const {courseId} =useParams();   //also jahan onclick h wohaan[CoursesTable-->line no. 84] v course ki id ko send krni hogi,tbhi to url[params] se yehaan le skunga
const {course}=useSelector((state)=>state.course);
const { token } = useSelector((state) => state.auth)
const [loading, setLoading] = useState(false)

// data phle render k aa jana chiye..isliye UseEffect ka use kr liya
useEffect(()=>{
    const populateCourseDetails=async()=>{
        setLoading(true);
        //mujhe course ki saari ki saari details chahiye
       const result =await getFullDetailsOfCourse(courseId,token); 
       //check if result k andar details present h
       if(result?.courseDetails){
        dispatch(setEditCourse(true)); //edit wala flag ko true mark kr di..[[present in slice]]
        //secondly course ko set kr do..isse course m data aa gyi
        dispatch(setCourse(result?.courseDetails))

       }
       setLoading(false);
    }
    populateCourseDetails();
},[])


if(loading){
    return (
        <div>Loading...</div>

    )
}

  return (
    <div className='text-white'   >
    <h1>Edit Course</h1>
    {/* //sare purane logic */}
    <div>
    {/* mere paas course k andar data h to mai us data ko show krunga ...RenderSteps component ko
    and,edit wale flag to true,mark krna pdega
    */}
{/* course k andar ka data,aayega kahhan se to usko-->> call krna padega */}

{
    course?(<RenderSteps/>):(<p>Course Not Found</p>)
}
    </div>
    
    </div>
  )
}
