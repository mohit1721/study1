import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import { useState } from "react";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice";
import { AiOutlineDown } from "react-icons/ai";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";
import Footer from "../components/common/Footer";
import IconBtn from "../components/common/IconBtn";
const ViewCourse = () => {
  const [reviewModal, setReviewModal] = useState(false);
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate ();
  const location = useLocation ();
  const { sectionId, subSectionId } = useParams();
  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
    totalNoOfLectures,
  } = useSelector((state) => state.viewCourse);

// jb ye page render hoga..tab dikhega 
  useEffect(() => {
    const setCourseSpecificDetails = async () => {
      //data fetching
      const courseData = await getFullDetailsOfCourse(courseId, token);
      //yehaan slice k andar data insert krke, taaki aage ane wale components k anadar iss adata ko fetch kr paaun aur use kr paau
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent));//model se dekhna h
      dispatch(setEntireCourseData(courseData.courseDetails)); //
      dispatch(setCompletedLectures(courseData.completedVideos)); //ftega */
      let lectures = 0;
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));
    };
    setCourseSpecificDetails();
  }, [courseId,dispatch,token]);

  return (
    <>
      <div className="hidden relative min-h-[calc(100vh-14rem)] md:flex md:flex-row">
    
       <VideoDetailsSidebar setReviewModal={setReviewModal} />
        {/* For Video */}
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <Outlet /> 
          {/* outlet is for video */}
        </div>
      </div>

{/* for mobile */}
<div className="flex flex-col h-fit relative md:hidden">

{/* sidebar & video */}
<div className="flex flex-col-reverse mt-10 p-4 gap-y-1 mx-auto">
<VideoDetailsSidebar setReviewModal={setReviewModal} />
  {/* For Video */}
  <div className="h-[calc(100vh-3.5rem)] w-[calc(100vw-3.5rem)] normal-case flex-1 overflow-auto">
          <Outlet /> 
          {/* outlet is for video */}
  </div>
        
</div>

</div>

      <Footer/>
      {/* //modal */}
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  );
};

export default ViewCourse;
