import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn';
import {IoAddCircleOutline} from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux';
import { setCourse,
     setEditCourse,
      setStep } from '../../../../../slices/courseSlice';
import { toast } from 'react-hot-toast';
import { createSection,
     updateSection } from '../../../../../services/operations/courseDetailsAPI';
import NestedView from './NestedView';
import { MdNavigateNext } from "react-icons/md"

const CourseBuilderForm = () => {
const {register,handleSubmit,setValue,formState:{errors}}=useForm();
const[editSectionName,setEditSectionName]=useState(null);
const {course}=useSelector((state)=>state.course);
const dispatch=useDispatch();
const [loading,setLoading]=useState(false);
const {token}=useSelector((state)=>state.auth)

const onSubmit=async (data)=>{
    //create+edit/update the section-->[[create/update entry in database]]
    setLoading(true);
    let result;
    if(editSectionName){
        // checking->editing/creating
        // we are editing the section name-->so calling updateSection API
        result = await updateSection(
            {
            sectionName:data.sectionName,
            sectionId:editSectionName,  //see the backend controller++services[frontend]
            courseId:course._id,
            },token
        )
    }else{
        //create section
        // ..so call create section API
        result= await createSection ({
            sectionName:data.sectionName,
            courseId:course._id,
             
        },token)
    }
// update values

if(result){
    dispatch(setCourse(result))//feed result...[section add/update krne se course ki value v change ho gyi ...to course ki value ko v update krna pdega]
    setEditSectionName(null);//edit done
    setValue("sectionName","");//all set..
    setLoading(false);
}
// loading false
setLoading(false);
}

const cancelEdit=()=>{
    setEditSectionName(null)
    setValue("sectionName",""); //qki form ka use kr rhe h isliye,wapas se set Value ""
  }
const goBack=()=>{
//ab edit kroge
dispatch(setStep(1));
dispatch(setEditCourse(true));
}
const goToNext=()=>{
if(course?.courseContent?.length===0){
    toast.error("Please Add atleast one Section");
    return;
}
if(course.courseContent.some((section)=>section.subSection.length===0)){
toast.error("Please add atleast one lecture in each section")
return;
}
// if everything is good
dispatch(setStep(3));
}
//III->L-2->43:00 
const handleChangeEditSectionName=(sectionId,sectionName)=>{
    // 2 case->values add/NO
    // toggle
    if(editSectionName===sectionId){
        cancelEdit();
        return
    }
// else
    setEditSectionName(sectionId);
    setValue("sectionName",sectionName);
} 

    return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
    <p className="text-2xl font-semibold text-richblue-5">Course Builder</p>
    <form onSubmit={handleSubmit(onSubmit)} >
        <div className="flex flex-col space-y-2">
            <label htmlFor='sectionName' >Section Name<sup className="text-pink-200">*</sup></label>
            <input
    id='sectionName'
    placeholder='Add Section Name'
    {...register("sectionName",{required:true})}
    className='w-full form-style'
       />
{
    errors.sectionName && (<span className="ml-2 text-xs tracking-wide text-pink-200">Section Name is Required </span>)
}
        </div>


<div className='mt-10 flex w-full'>
    <IconBtn
    type='Submit'
    text={editSectionName?"Edit Section Name":"Create Section"}
    outline={true}
    className={"text-white "}
    >
         <IoAddCircleOutline className='text-yellow-50' size={20}/>
    </IconBtn>
{editSectionName&&(
    <button
    type='button'
    onClick={cancelEdit}
    className='text-sm text-richblack-300 underline ml-10'
    ></button>
)}
</div>
</form>

{/* NESTED VIEW */}

{course?.courseContent?.length>0 && 
(
    <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
)}
{/* buttons */}
<div className='flex justify-end gap-x-3 mt-10'>
<button 
onClick={goBack}
className='rounded-md cursor-pointer flex items-center'
>
    Back
</button>

<IconBtn
text="Next" disabled={loading} onclick={goToNext}
>
      <MdNavigateNext />
</IconBtn>
</div>


    </div>
  )
}

export default CourseBuilderForm