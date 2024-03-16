import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { useSelector } from 'react-redux';
import { getInstructorData } from '../../../../services/operations/profileAPI';
import { Link } from 'react-router-dom';
import InstructorChart from './InstructorChart';
// Instruction Dashboard
const Instructor = () => {
    const [loading,setLoading]=useState(false);
    const {token} =useSelector ((state)=>state.auth)
    const {user}= useSelector ((state)=>state.profile)
    const[instructorData,setInstructorData]= useState(null);
    const [courses,setCourses]=useState([]);
    useEffect(()=>{
        const getCourseDataWithStats = async()=>{
            setLoading(true);
            //pending
            const instructorApiData = await getInstructorData(token);
            const result = await fetchInstructorCourses(token);
            // console.log(instructorApiData);

            //backend se call krke data leke aye ho aur state variable k anddar set kr diya h
            if(instructorApiData.length){//if valid 
                setInstructorData(instructorApiData);
            }
            if(result){
                setCourses(result);
            }
            setLoading(false);
        }
        getCourseDataWithStats();
    },[])

    const totalAmount =instructorData?.reduce((acc,curr)=>acc+curr.totalAmountGenerated,0);
    const totalStudents =instructorData?.reduce((acc,curr)=>acc+curr.totalStudentsEnrolled,0);
   
  return (
    <div className='text-white'>
    <div className='space-y-2'>
      <h1 className='text-2xl font-bold text-richblack-5'>Hi {user?.firstName} 👋</h1>
      <p className="font-medium text-richblack-200">Let's start something new</p>
    </div>
    {loading ? (    
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div div className="spinner"></div>
        </div>)
    :courses.length > 0 
      ? (<div>
          <div className=''>
          <div className='my-4 flex flex-col md:flex-row lg:h-[450px] gap-y-4 md:gap-x-4'>
        
          <InstructorChart courses={instructorData}/>
              
              <div className='flex items-center min-w-[250px] flex-col rounded-md bg-richblack-800 p-6 '>
                  <p className="text-lg font-bold text-richblack-5"> Statistics</p>
                  <div className='mt-4 space-y-4'>
                  <div>
                      <p className='text-richblack-200 text-lg'>Total Courses</p>
                      <p className='text-3xl font-bold text-richblack-50'>{courses.length}</p>
                  </div>

                  <div>
                      <p className='text-richblack-200 text-lg'>Total Students</p>
                      <p className='text-3xl font-bold text-richblack-50'>{totalStudents}</p>
                  </div>

                  <div>
                      <p className='text-richblack-200 text-lg'>Total Income</p>
                      <p className='text-3xl font-bold text-richblack-50'>{totalAmount}</p>
                  </div>
                  </div>

              </div>
          </div>
      </div>
      <div className="rounded-md bg-richblack-800 p-6 lg:gap-6">
          {/* Render 3 courses */}
          <div className='flex items-center justify-between'>
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <Link to="/dashboard/my-courses">
                  <p className="text-xs font-semibold text-yellow-50">View all</p>
              </Link>
          </div>
          <div className='my-4 flex items-start gap-4 lg:space-x-6 flex-col lg:flex-row'>
          {/* sirf 3 card chahiye ..isliye slice(0,3) ,then use map*/}
              {                
                  courses.slice(0,3).map((course,index)=> (
                      <div className='lg:w-1/3 w-11/12 ' key={index}>
                          <img 
                              src={course.thumbnail}
                              alt='courseThumbnail'
                              className='h-[201px] w-full rounded-md object-cover'
                          />
                          <div className='w-full mt-3'>
                              <p>{course.courseName}</p>
                              <div className='mt-1 flex items-center space-x-2'>
                                  <p className="text-xs font-medium text-richblack-300">{course.studentsEnrolled.length} students</p>
                                  <p className="text-xs font-medium text-richblack-300"> | </p>
                                  <p className="text-xs font-medium text-richblack-300">Rs {course.price}</p>
                              </div>

                          </div>
                      </div>
                  ))
              }
          </div>
      </div>
      </div>
      
      )
      :(
          <div className='mt-20 rounded-md bg-richblack-800 p-6 py-20'>
          <p className="text-center text-2xl font-bold text-richblack-5">You have not created any courses yet</p>
          <Link to={"/dashboard/add-course"}>
              <p className='mt-1 text-center text-lg font-semibold text-yellow-50'>Create a Course</p>
          </Link>
      </div>)}
  </div>
  )}
export default Instructor