import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HighlightText from "../components/core/HomePage/HighlightText";
import Footer from "../components/common/Footer";
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
// import Footer from "../components/common/Footer";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import ReviewSlider from "../components/common/ReviewSlider";
import { apiConnector } from "../services/apiconnector";
import { ratingsEndpoints } from "../services/apis";

const Home = () => {
  return (
    <div className="mt-5">
      {/* section 1[dark blue ] */}
      <div
        className="relative mx-auto flex flex-col w-11/12 items-center text-white
    justify-between gap-8 max-w-maxContent "
      >
        <Link to={"/signup"}>
          <div
            className="group mx-auto mt-16 p-1 rounded-full bg-richblack-800 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] hover:drop-shadow-none font-bold text-richblack-200
    transition-all duration-200 hover:scale-105 w-fit "
          >
            <div
              className="flex flex-row items-center gap-2 rounded-full px-10 py-[10px]
          transition-all duration-200 group-hover:bg-richblack-900 "
            >
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className=" text-center text-4xl font-semibold mt-7 ">
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />
        </div>
        {/* subHeading */}
        <div className=" w-[90%] text-center text-lg font-bold text-richblack-200  ">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        <div className=" flex flex-row gap-7 mt-8  ">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>

          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        <div className="shadow-blue-200 mx-3 my-14 shadow-[10px_-5px_50px_-5px]">
          <video
          className="shadow-[20px_20px_rgba(255,255,255)]"
           muted loop autoPlay>
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* code section | */}
        <div>
          <CodeBlocks  
            position={"lg:flex-row"} //values send/
            heading={
              <div className="text-4xl font-semibold ">
                Unlock Your
                <HighlightText text={"Coding Potential"} />
                with our Online Courses
              </div>
            }
            subheading={ //ye sb values h jo ,send ki h CodeBlocks component ko 
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{ //
              btnText: "Try it yourself",
              linkto: "/signup",
              active: true, //for yellow
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>
            <html>
            <head><title>Example</title><link rel="stylesheet" href="styles.css">
            </head>
            <body>
            <h1><ahref="/">Header</ahref=>
            </h1>
            <nav><ahref="one/">One</ahref=><a href="two/">Two</a><ahref="three/">Three</ahref=>
            </nav>`}
            codeColor={"text-yellow-25"}
            codeBg={"codeblock1"}
           
          />
        </div>
        {/* Code Section || */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"} ///logic++**
            heading={
              <div className="text-4xl font-semibold ">
                Unlock Your
                <HighlightText text={"Coding Potential"} />
                with our Online Courses
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "Try it yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>
            <html>
            <head><title>Example</title><link rel="stylesheet" href="styles.css">
            </head>
            <body>
            <h1><ahref="/">Header</ahref=>
            </h1>
            <nav><ahref="one/">One</ahref=><a href="two/">Two</a><ahref="three/">Three</ahref=>
            </nav>`}
            codeColor={"text-[#34ebe8]"}
            codeBg={"codeblock2"}
          
           />
        </div>

        <ExploreMore/>

      </div>

      {/* Section 2 [white]*/}
      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[310px]">
          <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-8 mx-auto">
            <div className="lg:h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white lg:mt-8">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-3">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/signup"}>
                <div>Learn more</div>
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-8">
          <div className="flex flex-col lg:mt-20 justify-between lg:flex-row gap-7 mb-10 mt-[-95px] lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%] w-full">
              Get the Skills you need for a
              <HighlightText text={"Job that is in demand"} />
            </div>

            <div className="flex flex-col gap-10 lg:w-[40%] items-start">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div>Learn more</div>
              </CTAButton>
            </div>
          </div>

          <TimelineSection />
          
          <LearningLanguageSection />

        </div>
      

      </div>

      {/* section 3 [dark blue]*/}
            <div className="w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8 
            bg-richblack-900 text-white  ">
              <InstructorSection/>
          <section className="w-11/12 max-w-maxContentTab lg:max-w-maxContent mx-auto relative my-20 flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <div className="text-center text-4xl font-semibold mt-8">
            Reviews from other learners           
          </div>
          <div className="w-[100%] h-[100%]">
          <ReviewSlider />
          </div>

      </section>
            </div>


      {/* section 4--footer */}
            <Footer/>
    </div>
  );
};

export default Home;
