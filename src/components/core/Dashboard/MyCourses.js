import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { GrFormAdd } from "react-icons/gr";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';
import IconBtn from '../../common/IconBtn';
import CoursesTable from './InstructorCourses/CoursesTable';
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
// ye INSTRUCTOR ki COURSES h mot Student
const MyCourses = () => {
    const {token}=useSelector((state)=>state.auth);
    const naviagte=useNavigate();
    const [courses,setCourses]=useState([]);

    //1. pehle render pe API Call,fetch all courses
        useEffect(()=>{
            const fetchCourses=async()=>{
                const result=await fetchInstructorCourses(token);
                
                if(result){
                    setCourses(result);
                }
            }
            // call the fxn
            fetchCourses();
        },[]);
        // const totalDuration=courses?.totalDuration
  return (
    <div className=''>
    <div className='text-white mb-14 flex items-center justify-between'>
        <h1 className='text-3xl '>My Courses</h1>
        <IconBtn  
            text="Add Course"
            onclick={()=>naviagte("/dashboard/add-course")}
            >
            <GrFormAdd fontSize={25} />
          </IconBtn>
    </div>
    {/* agar courses h tbhi table render */}
{courses && <CoursesTable courses={courses} setCourses={setCourses}/>}
    
    </div>
  )
}

export default MyCourses