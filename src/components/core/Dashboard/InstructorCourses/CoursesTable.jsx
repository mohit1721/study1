import React, { useEffect } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import ConfirmationModal from '../../../common/ConfirmationModal';
import {
    deleteCourse,
    fetchInstructorCourses,
  } from "../../../../services/operations/courseDetailsAPI"
import { formatDate } from "../../../../services/formatDate";
import { setCourse } from '../../../../slices/courseSlice';
import { COURSE_STATUS } from '../../../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { BsClockFill } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiFillCheckCircle } from "react-icons/ai";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
export default function CoursesTable ({courses,setCourses}) {

const dispatch=useDispatch();
const {token}=useSelector((state)=>state.auth);
const {loading,setLoading}=useState(false);
const [confirmationModal,setConfirmationModal] = useState(null);
const navigate=useNavigate()
// const [totalDuration, setTotalDuration] = useState(0);
const handleCourseDelete=async (courseId)=>{
setLoading(true);
await deleteCourse({courseId: courseId},token);
const result = await fetchInstructorCourses(token); //updated Course,after deleting one course
//feed
if(result){ //result is the updated Course
    setCourses(result); //correction,ye slice wali setCourse nhi h,ye jo props m aaya h wo wali h
}
setConfirmationModal(null);
setLoading(false);
}

// const totalDuration totalDuration =course?.reduce((acc,curr)=>acc+curr.totalDuration,0);
// useEffect (() => {
//     if (courses) {
//       const newTotalDuration = courses.map(item => item.totalDuration).reduce((acc, curr) => acc + curr, 0);
//       setTotalDuration(newTotalDuration);
//     }
//   }, [courses]);
// if (courses) {
    // const newTotalDuration = courses.map(item => item.totalDuration).reduce((acc, curr) => acc + curr, 0);
    // setTotalDuration(newTotalDuration);
    // console.log(newTotalDuration)
//   }


  return (
    <>
        {
            !courses ?(<div className='spinner'></div>):!courses.length?(
            <p>You have not Created any Course yet</p>
        ):(
            <div className=' text-white '>
    <Table className=' rounded-xl border border-richblack-800'>
    <Thead >
    <Tr className='flex gap-x-10 border-richblack-800 p-8'>
    <Th className="flex flex-1 text-left text-sm font-medium uppercase text-richblack-100 pivoted">
        Courses
    </Th>
    {/* <Th className="text-left text-sm font-medium uppercase text-richblack-100 pivoted">
        Duration
    </Th> */}
    <Th className="text-left text-sm font-medium uppercase text-richblack-100 pivoted">
        Price
    </Th>
    <Th className="text-left text-sm font-medium uppercase text-richblack-100 pivoted">
        Actions
    </Th>
    </Tr>
    </Thead>

    <Tbody>
{
    courses.length===0 ?(
        <Tr>
        <Td>
            No Courses Found
        </Td>

        </Tr>
    ):(  //courses>0

        courses?.map((course)=>(        //each course ka row generate hoga uska entire logic 
            
       
            <Tr key={course._id} className='flex gap-x-10 border-richblack-800 p-8'>
            <Td className='flex flex-1 gap-x-4 pivoted'>
            <img src={course?.thumbnail}
            className='h-[150px] w-[220px] rounded-lg object-cover'
            alt='img'
              />
              <div className='flex flex-col justify-between'>
            <p className='text-lg font-semibold text-richblack-5'>{course.courseName} </p>
            <p className="text-xs text-richblack-300">{
                course.courseDescription.split(" ").length >30 ? course.courseDescription.split(" ").slice(0,30).join(" ")+"..."
                :course.courseDescription
            }</p>


            <p className='text-[12px] text-white'>Created:{formatDate(course.createdAt)} </p>
            
            {
                course.status===COURSE_STATUS.DRAFT?(
                    <p className='text-pink-50 w-fit flex flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium'>
                    <BsClockFill className="flex h-3 w-3 items-center justify-center rounded-full" />
                    DRAFTED
                    </p>
                ):(
                    <p className="text-caribbeangreen-300 flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium">
                        <AiFillCheckCircle className="flex h-3 w-3 items-center justify-center rounded-full" />
                        PUBLISHED
                      </p>
                )
            }
              </div>

            </Td>

            {/* <Td className="text-left text-sm font-medium uppercase text-richblack-100 pivoted">
            {
                course?.totalDuration ? course.totalDuration: 0      
            
            }</Td> */}

            <Td className="text-left text-sm font-medium uppercase text-richblack-100 pivoted">₹{course.price}</Td>
            <Td className="text-left text-sm font-medium uppercase text-richblack-100 pivoted">
                <button
                disabled={loading} //means,jb loading ki value true hogi to iss button ko disable kr dena
            
                className="px-1 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300 "
            onClick={()=>{
                navigate(`/dashboard/edit-course/${course._id}`) //course id ,sent here is used by params in EditCourse folder..
            }}
            
                >
                   <FiEdit2 fontSize={20} />
                </button>
{/*edit k liye ,Re-Use the RENDER_STEPS wali component..
jo,EditCourse wali folder se 
.  */}

                <button
                 title="Delete"
                 className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000] "
                 disabled={loading}
                 onClick={()=>{
                    setConfirmationModal({
                        text1:"Do you want to delete this course?",
                        text2:"All the data related to this course will be deleted",
                        btn1Text: !loading ? "Delete" : "Loading...  ",
                        btn2Text: "Cancel",
                        btn1Handler:!loading ?()=>handleCourseDelete(course._id):()=>{

                        },
                        btn2Handler:!loading ?()=>setConfirmationModal(null):()=>{

                            },

                    })
                 }}

               
                >
                    <RiDeleteBin6Line fontSize={20}/>

                </button>
            </Td>
            </Tr>

        )
        
        
        )
    )
}

    </Tbody>



    </Table>
    {/* jb v confirmation modal use krenge ...use render krwaunga */}
    {confirmationModal && <ConfirmationModal modalData={confirmationModal}/> } 
    
    </div>
        )
        }
    </>
       
    
  )
}
