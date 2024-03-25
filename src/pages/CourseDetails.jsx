import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buyCourse } from "../services/operations/StudentFearuresAPI";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRating";
import Error from "./Error";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import ConfirmationModal from "../components/common/ConfirmationModal";
import RatingStars from "../components/common/RatingStars";
import { formatDate } from "../services/formatDate";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import Footer from "../components/common/Footer";
import { BiInfoCircle } from "react-icons/bi";
import { ACCOUNT_TYPE } from "../utils/constants";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-hot-toast";
import { CourseAccordionBar } from "../components/core/Course/CourseAccordionBar";
import CourseReviewSlider from "../components/common/CourseReviewSlider";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import { apiConnector } from "../services/apiconnector";
import { ratingsEndpoints } from "../services/apis";
function CourseDetails() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.profile);
  const { paymentLoading } = useSelector((state) => state.course);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  //courseId parameter se aayegii
  const { courseId } = useParams(); //DESTRUCTURE MUST
  const [confirmationModal, setConfirmationModal] = useState(null); ///5
  const [reviews, setReviews] = useState([]);
  //1.
  const [courseData, setCourseData] = useState(null);
// .pure course ka data..show on 1st rendering...jb courseId chamge ho
  useEffect(() => {
    const getCourseFullDetails = async () => {
      try {
        const result = await fetchCourseDetails(courseId); //1. api call -->course ki saari ki saari detail le ayegi
        setCourseData(result);
      } catch (error) {
        console.log("Could not fetch course details");
      }
    };
    getCourseFullDetails();
  }, [courseId]);

  //2
  const [avgReviewCount, setAverageReviewCount] = useState(0);

  useEffect(() => {
    let allReviews = [];
    const count = GetAvgRating(courseData?.data?.courseDetails.ratingAndReviews);
    if(courseData?.data?.courseDetails)
   {
    courseData?.data?.courseDetails?.ratingAndReviews?.forEach((review)=>{
      allReviews=[...allReviews,review];
    })}
    setAverageReviewCount(count);
    setReviews(allReviews);
  }, [courseData]); //2. jaise hi Coursedata aa jaye




  // kis section ko open dikhan h ya nhi-->agar empty array h iska mtlb->kisiko open nhi dikhana h
 
 

 
  const [isActive, setIsActive] = useState(Array(0));//by-default all closed sections
  const handleActive = (id) => {
    setIsActive(
      //toggle
      !isActive.includes(id) //agar isActive m ye id present nhi h
        ? isActive.concat(id) //to present karao
        : isActive.filter((e) => e!== id) //agar present h to usko hatao
    );
  };
  //3
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  useEffect(() => {
    let lectures = 0;
    courseData?.data?.courseDetails?.courseContent?.forEach((sec) => {
      //
      lectures += sec.subSection.length || 0;
    });
    setTotalNoOfLectures(lectures);
  }, [courseData]);
  //Instructor Other courses

  const [otherCourses, setOtherCourses] = useState([]);

  useEffect(() => {

    const filteredCourses =
      courseData?.data?.courseDetails?.instructor?.courses?.filter(
        (course) => course._id !== courseId
      );
    // console.log("current course ko chhor k baaki courses show kr do: ", filteredCourses);
    setOtherCourses(filteredCourses);
  }, [courseData, courseId]);
  //5
  // TO UPDATE-->DONE..Bought course
  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch);//ye fxn services m h...jo Backend ki API ko call kr rha h
      return;
    }
    //agar token nhi h-->koi person jo logged in nhi h wo course buy krne ki kosis kr rha h
    setConfirmationModal({
      //TODO     -->jb v modal use kro to usko add kr do -->niche add kro**
      text1: "you are not Logged in", //data set kr diya
      text2: "Please login to purchase the course",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null), //close the modal
    });
  };
  if (paymentLoading) {
    // console.log("payment loading")
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }
const handleAddToCart=()=>{
  if(user && user?.accountType===ACCOUNT_TYPE.INSTRUCTOR)
  {
    toast.error("You are an Instructor. You can't buy a course.");
      return;
  }
  if(token){
    dispatch(addToCart(courseData.data?.courseDetails))
    return;
  }
  setConfirmationModal({
    text1: "You are not logged in!",
    text2: "Please login to add To Cart",
    btn1Text: "Login",
    btn2Text: "Cancel",
    btn1Handler: () => navigate("/login"),
    btn2Handler: () => setConfirmationModal(null),
  });
}
  //4
  if (loading || !courseData) {
    return <div>Loading...</div>;
  }
  if (!courseData.success) {
    return (
      <div>
        <Error />
      </div>
    );
  }




//6. data bahar le leta hu then yehaan se utilize krunga
  const {
    // _id:course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
    language
  } = courseData.data?.courseDetails; // 

  return (
    <div className="text-white mt-9 z-0">
   
<div className={`relative w-full bg-richblack-800`}>
 {/* Hero Section */}
  <div className="mx-auto box-content 2xl:relative px-4 lg:w-[1260px]">

<div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center
py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]
">
    {/* image to show in mobile */}
    <div className="lg:hidden block max-h-[30rem] relative">
  <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>  
    <img
      src={thumbnail}
      alt="thmb"
      className="aspect-video object-center w-full"
    />
 
  </div>
 

  <div className="z-20 my-5 flex flex-col justify-center gap-4 py-4 text-lg text-richblack-5 ">
  
        <p className="text-4xl font-bold text-richblack-5 sm:text-[42px] capitalize">{courseName}</p>
        <p className={`text-richblack-200`}>{courseDescription} </p>
        <div className="flex flex-col md:flex-row gap-x-2 items-center">
          <div className="flex gap-x-2">
          <span className="text-yellow-25">{avgReviewCount || 0} </span>
          <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
          </div>

          <a href="#reviews"
          className="hover:underline scroll-smooth text-yellow-100 hover:text-yellow-25 "
          >{`(${ratingAndReviews.length} reviews)`} </a>
          <span className="font-semibold capitalize text-blue-100">{`(${studentsEnrolled.length} students enrolled)`} </span>
        </div>
        <div>
          <p >Created By{" "} <span className="font-semibold capitalize text-caribbeangreen-50">{`${instructor.firstName}`}</span> </p>
        </div>

        <div className="flex flex-wrap gap-4 text-lg">
          <p className="flex items-center gap-2">
        
          <BiInfoCircle /> Created At {formatDate(createdAt)}</p>
          <p className="flex items-center gap-2 text-pink-500 font-semibold">
          <HiOutlineGlobeAlt />{language} </p>
        </div>
{/* for mobile   */}
<div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
<p className="spaxe-x-3 pb-4 text-3xl font-semibold text-richblack-5">Rs.{price} </p>
<button className="yellowButton text-richblack-900 bg-yellow-50 w-full rounded-md text-lg font-semibold " onClick={
  user && courseData?.data?.courseDetails?.studentsEnrolled.includes(user?._id) 
   ? ()=>navigate("/dashboard/enrolled-courses")
   : handleBuyCourse

}>
               {
                user && courseData?.data?.courseDetails?.studentsEnrolled.includes(user?._id) 
   ?"Go To Course" :" Buy Now"
               }
              </button>
<button onClick={handleAddToCart} className="blackButton" >

{
                user && courseData?.data?.courseDetails?.studentsEnrolled.includes(user?._id) 
   ?"" :"Add to Cart"
               }
</button>
</div>



        <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] lg:block lg:absolute translate-y-24 md:translate-y-0 ">
          <CourseDetailsCard
            course={courseData?.data?.courseDetails}
            setConfirmationModal={setConfirmationModal}
            handleBuyCourse={handleBuyCourse} //logged in h to buy v kr skta h
          />
        </div>
      </div>
</div>

  </div>
</div>

<div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
  <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
  <div className="my-8 border border-richblack-600 p-8">
        <p className="text-3xl font-semibold">What You'll Learn</p>
        <div className="mt-5"> {whatYouWillLearn} </div>
      </div>
{/* Course Content Section */}
      <div className="max-w-[830px]">
        <div className="flex flex-col gap-3">
          <p className="text-[28px] font-semibold">Course Content</p>
          <div className="flex flex-wrap gap-2 justify-between">
          <div className="flex gap-2">
            <span>{courseContent.length} section(s)</span>

            <span>{totalNoOfLectures} lecture(s) </span>
            <span>{courseData.data?.totalDuration} total length</span>
          </div>

          <div>
            <button
               className="text-yellow-25"
              onClick={() => setIsActive([])} //all close-->so empty Array[storing kon kon sa section open dikhau]..if empty array..koi section open nhi dikhana h
            >
              Collapse all Sections
            </button>
          </div>
        </div>
        </div>
    {/* Course Details Accordion */}
       <div className="py-4">
               {
                courseContent?.map((course,index)=>(
                  <CourseAccordionBar
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                  />
                ))
               }
       </div>

 {/* Author Details */}
<div id="instructor" className="mb-4 py-4">
<p className="text-[28px] font-semibold">Author</p>
<div className="flex flex-row items-center py-4 mx-auto gap-2 capitalize">
  <img
src={
  instructor.image ? instructor.image : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
}
alt="Author"
className="h-14 w-14 rounded-full object-cover"
  />
  <p className="text-lg text-caribbeangreen-200">{instructor.firstName} {instructor.lastName} </p>
</div>
<p className="text-richblack-50">{instructor?.additionalDetails?.about} </p>
</div>
      </div>
  </div>
</div>

    {/* //Author, instructor/user image,name ,about */}
 

    {/* rating review */}
{
  
  <div>
    {
      !reviews.length ?( <div
      className="text-3xl text-center text-caribbeangreen-25 font-semibold mb-4">
        No Reviews Of This course Till Now 
      </div>) :(
        <section 
     id="reviews"
    className="w-11/12 scroll-smooth capitalize max-w-maxContentTab lg:max-w-maxContent mx-auto relative my-2 flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
 <div className="text-center text-4xl font-semibold mt-8 text-caribbeangreen-5">
            Reviews from other learners           
          </div>
          <div className="w-[100%] h-[100%] ">
          <CourseReviewSlider reviews={reviews}/>
          </div>

      </section>
      )
    }
  </div>


}
{/* Instructor Other Courses */}

<div className="mx-auto items-center w-11/12 box-content max-w-maxContentTab px-4 py-2 lg:max-w-maxContent">
          <h2 className="text-center text-4xl font-semibold mt-4 capitalize text-caribbeangreen-50">
            More Courses by {`${instructor.firstName} ${instructor.lastName}`}
          </h2>
          <div className="py-8 mx-auto items-center w-11/12">
            {otherCourses?.length > 0 ? (
              <CourseSlider Courses={otherCourses} />
            ) : (
              <div className="w-full mx-auto">
                <p className="text-center mt-10 text-3xl text-caribbeangreen-200">
                  No More Courses are Present
                </p>
              </div>
            )}
          </div>
        </div>


    {/* footer */}
    <Footer/>

      {/* 5 */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CourseDetails;
