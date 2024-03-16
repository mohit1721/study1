import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import { FiClock } from "react-icons/fi";
import { PiCursorLight } from "react-icons/pi";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../slices/cartSlice";
import { BsFillCaretRightFill } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";
import { FaMobileRetro } from "react-icons/fa6";
import { fetchCourseDetails } from "../../../services/operations/courseDetailsAPI";
// import { useState } from "react";
function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile); //1.0
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const dispatch = useDispatch();
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
  const { 
    thumbnail: ThumbnailImage, 
    price: CurrentPrice } = course; //course se ye nikal li

  const handleAddToCart = () => {
    //1st validation->instructor/jo logged-in nhi h wo,add to cart nhi kr skta

    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor, you can't buy a course");
      return;
    }
    if (token) { // admin + logged in wale course le sk
      // console.log("dispatching add to cart");
      dispatch(addToCart(course)); //add the course if logged in
      return;
    }
    //not logged in
    setConfirmationModal({
      text1: "you are not logged in",
      text2: "Please login to add to cart",
      btn1text: "login",
      btn2Text: "cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const handleShare = () => { //link copy krna h aur toast dikhana h
    //copy current location[link]
    copy(window.location.href); //window is object
    toast.success("Link Copied to Clipboard");
  };

  return (
    <div
    className={`flex flex-col backdrop-filter backdrop-blur-md bg-opacity-10 border border-richblack-100 gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}
    >
      <img
        src={ThumbnailImage} //course ->jo ki data h usse mil jayega
        alt="thumbnail"
        className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden object-cover md:max-w-full rounded-2xl"/>

      <div className="text-3xl font-semibold">Rs.{CurrentPrice}</div>
      <div className=" flex flex-col gap-4">
      {/* 1.1 */}
        <button
          className="bg-yellow-50 yellowButton w-full text-richblack-900 rounded-md transition duration-300 ease-in"
          onClick={
            user && course?.studentsEnrolled?.includes(user?._id) 
              ? () => navigate("/dashboard/enrolled-courses")
              : handleBuyCourse //fxn h
          }
        >
          {/*phle user leke aao then.. // course ki data --> studentenrolled -->wohaan pe current user logged in ki  id check kro present h ki nhi h   */}
          {/* agat studentEnrolled m present h current user ki id --> to usne buy kr rkha h course nhi to nhi */}

          {user && course?.studentsEnrolled?.includes(user?._id)
            ? "Go to course"
            : "Buy Now"}
        </button>

        {/* 2. add to cart-->only when phle se buy nhi kr rkha ho */}

        {
          // jb "enroll"** nhi kr rkha h
          (!user ||  !course?.studentsEnrolled.includes(user?._id) )&& (
            <button
              onClick={handleAddToCart}
              className="bg-richblue-800 blackButton w-full text-richblack-25 hover:text-white rounded-md transition duration-300 ease-in"
            >
              Add To Cart
            </button>
          )
        }
      </div>

      <div>
        <p className="text-center pb-3 pt-6 text-sm text-caribbeangreen-5">30-Day Money-Back Guarantee</p>
        <p className="my-2 text-xl font-semibold ">This Course Includes:</p>
        <div className=" flex flex-col gap-3 text-sm font-semibold text-caribbeangreen-100">
     
        <span className="flex flex-row gap-2 items-center font-semibold"><TiTick className=" text-caribbeangreen-100 h-[14px] w-[14px]"/> No Prerequisite Required</span>
        <span className="flex flex-row gap-2 items-center font-semibold"><FiClock className=" text-caribbeangreen-100 h-[14px] w-[14px]" />{courseData?.data?.totalDuration} on-demand video </span>
        <span className="flex flex-row gap-2 items-center font-semibold"><PiCursorLight className=" text-caribbeangreen-100 h-[14px] w-[14px]"/> Full Lifetime access</span>
        <span className="flex flex-row gap-2 items-center font-semibold"><FaMobileRetro className=" text-caribbeangreen-100 h-[14px] w-[14px]"/> Access on Mobile and TV</span>
          
          {/* {course?.instructions?.map((item, index) => (  // 
            <p key={index} className="flex gap-2 items-center">
              <BsFillCaretRightFill />
                    <span className="max-w-[306px]">{item}</span>
            </p>
          ))} */}

        </div>
      </div>

      <div className="text-center" >
        <button className=" mx-auto flex items-center gap-2 py-6 text-yellow-100" onClick={handleShare}><FaShareSquare size={15} />  Share</button>
      </div>
    </div>
  );
}

export default CourseDetailsCard;
