import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import IconBtn from '../../../../common/IconBtn';
import { resetCourseState, setStep } from '../../../../../slices/courseSlice';
import { useEffect } from 'react';
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { useNavigate } from 'react-router-dom';

export default function PublishCourse () {

const {register,handleSubmit,setValue,getValues}=useForm();
const { course } = useSelector ((state) => state.course);
const { token } = useSelector((state) => state.auth);
const dispatch = useDispatch ();
const navigate = useNavigate ();
const [loading,setLoading]=useState (false);
// jb v pehla render hoga,set the public wali value
useEffect(()=>{
    if(course?.status===COURSE_STATUS.PUBLISHED){
        setValue("public",true);
    }
},[]);

const goBack=()=>{
    dispatch(setStep(2))
}
const goToCourses=()=>{
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
}
const handleCoursePublish=async ()=>{
    // agar already published h...ya fir ++ draft h...to koi form update nhi h ,to no need to API Call
    if((course?.status===COURSE_STATUS.PUBLISHED && getValues("public")===true)  || 
    (course.status===COURSE_STATUS.DRAFT && getValues("draft")===false)
    )
    //no updation in form
    //no need to API call
    {
    goToCourses(); //see the courses
    return; 
}
    //form update hua h
    //create formdata
    const  formData = new FormData();
    formData.append("courseId",course._id);
    const courseStatus=getValues("public")?COURSE_STATUS.PUBLISHED:COURSE_STATUS.DRAFT;
    formData.append("status",courseStatus);
    setLoading(true);  //for api call
    const result = await editCourseDetails(formData,token);
    if(result){
        goToCourses();
    }
    setLoading(false); 

}

const onSubmit=(data)=>{
    handleCoursePublish();
}
  return (
    <div className=' rounded-md border-[1px] bg-richblack-800 p-6 border-richblack-700 text-white ' >
    <p>Publish Course</p>
    <form onSubmit={handleSubmit(onSubmit)}>
    <div>
    <label htmlFor='public' >
  
    <input type='checkbox'
    id='public'
    {...register("public")} //
    className='rounded-md h-4 w-4 '
    />
   <span className='ml-3'>Make this Course as Public</span>

 </label>
</div>
<div className='flex justify-end gap-x-3 '>
    <button
    disabled={loading} //
    type='button'
    onClick={goBack}
className='flex items-center rounded-md bg-richblack-300 p-3'
    >
        back
    </button>

<IconBtn disabled={loading} text="save changes" />  

</div>
    </form>
    </div>
  )
}

//disables