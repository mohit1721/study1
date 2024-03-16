import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";
const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth); //fetch to send as input parameter to db call
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const navigate = useNavigate ()
  const getEnrolledCourses = async () => {
    try {
      const response = await getUserEnrolledCourses(token); //backend se data lake insert kra liya [setEnrolledCourses] m
          // Filtering the published course out
          // const filterPublishCourse = response.filter((ele) => ele.status !== "Draft")  
      setEnrolledCourses(response);
      // console.log("STUDENT ENROLLED IN COURSES",response)
    } catch (error) {
      console.log("Unable to Fetch enrolled courses");
    }
  };
  useEffect(() => {
    getEnrolledCourses();
}, []);




  return (
    <div className="w-100vw h-100vh">
      <div className="text-3xl text-richblack-50">Enrolled Courses</div>
        {/* Horizontal line */}
        <div className='mx-auto mt-6 mb-6 h-[1px] w-12/12 bg-richblack-700'></div>
      {!enrolledCourses ? (
        <div className="grid place-items-center">
        <div className="spinner"></div>
        </div>
       
      ) : !enrolledCourses.length ? ( //length=0
        <p className="mt-10 flex justify-center h-[20vh] w-full items-center text-richblack-5">You have not enrolled in any course yet!</p>
      ) : (
        //length>0
        <div className="my-8 text-richblack-5">
          <div className="flex rounded-t-lg bg-richblack-500">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>
          {/* cards ab shuru honge */}
          {enrolledCourses.map((course, index,arr) => (
            <div
            className={`flex items-center border border-richblack-700 ${
              index===arr.length-1 ? "rounded-b-lg": "rounded-none"
            }`}
            key={index}>
              <div
              className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3 md:flex-row flex-col "      
              onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  )
                }}
              >
                <img 
                className="md:h-14 md:w-14 rounded-lg object-cover h-[100px] w-[300px] "
                src={course.thumbnail} alt="thumbnail" />

                <div className="flex max-w-xs flex-col gap-2 ">
                  <p className="font-semibold"> {course.courseName} </p>
                  <p className="text-xs text-richblack-300" > 
                  {course.courseDescription.length>50?`${course.courseDescription.slice(0,50)}...`
                  :course.courseDescription} </p>
                </div>
              </div>

              <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3" >
                {/* <p>Progress: {course.progressPercentage || 0}%</p> */}
                <p>
                  {
                    course.progressPercentage>0 && course.progressPercentage===100 ?(<p>Completed</p>) :(<p>Progress: {course.progressPercentage || 0}%</p>)

                  }

                </p>

                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                  bgColor="#06D6A0"
                  transitionDuration="200"
                  transitionTimingFunction="ease-in"
                  // completedClassName="#06D6A0"
                  baseBgColor="#47A5C5"
                  animateOnRender
                  // baseBgColor="baseBgColor"
                />

     {/* <ProgressBar 
    completed={0}
    bgColor="#06D6A0"
    height="8px"
    width="202px"
    borderRadius="2000px"
    baseBgColor="#ffe400"
    labelColor="#09e8d3"
    transitionDuration="200"
    transitionTimingFunction="ease-in"
    animateOnRender
    maxCompleted={100}
    customLabel=""
    /> */}

              </div>
            </div>
          )
          
          )}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
