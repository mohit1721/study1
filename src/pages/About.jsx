import React, { useEffect, useState } from "react";
import HighlightText from "../components/core/HomePage/HighlightText";
import BannerImage1 from "../assets/Images/aboutus1.webp";
import Bannerimage2 from "../assets/Images/aboutus2.webp";
import Bannerimage3 from "../assets/Images/aboutus3.webp";
import Quote from "../components/core/AboutPage/Quote";
import FoundingStory from "../assets/Images/FoundingStory.png";
import StatsComponent from "../components/core/AboutPage/StatsComponent";
import LearningGrid from "../components/core/AboutPage/LearningGrid";

import "../components/core/highL.css"
import ContactFormSection from "../components/core/AboutPage/ContactFormSection";
import ReviewSlider from "../components/common/ReviewSlider";
import Footer from "../components/common/Footer";
import { apiConnector } from "../services/apiconnector";
import { ratingsEndpoints } from "../services/apis";
const About = () => {


  
  return (
    <div className="text-white">
      {/* section 1 */}
      <section className="bg-richblack-700">
        <div className="w-11/12 mx-auto relative justify-between flex max-w-maxContent flex-col gap-10 text-center text-white">
          <header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
            Driving Innovation In Online Education for a
            <HighlightText text={"Brighter Future"} />
            <p className="text-center text-sm leading-6 mx-auto font-medium mt-3 text-richblack-300 lg:w-[95%]">
              Lernix is at the forefront of driving innovation in online
              education. We're passionate about creating a brighter future by
              offering cutting-edge courses, leveraging emerging technologies,
              and nurturing a vibrant learning community.
            </p>
          </header>

     <div className="lg:h-[150px] sm:h-[70px]">
     <div className="absolute bottom-0 left-[50%] translate-x-[-50%] translate-y-[30%] w-[100%]  grid grid-cols-3 gap-x-3 lg:gap-5 ">
            <img src={BannerImage1} alt=""  loading="lazy"/>
            <img src={Bannerimage2} alt=""  loading="lazy"/>
            <img src={Bannerimage3} alt=""  loading="lazy" /> 
          </div>
     </div>

        </div>
      </section>

      {/* section 2 */}

      <section className="border-b border-richblack-700">
        <div className="mx-auto flex flex-col w-11/12 max-w-maxContent justify-between gap-10 text-richblack-500">
         <div className="max-h-maxContent mt-28">
         <Quote />
         </div>
        </div>
      </section>

      {/* section 3 */}

      <section>
        <div className="mx-auto w-11/12 max-w-maxContent justify-between flex flex-col gap-10 text-richblack-500">
          {/* founding story div */}
          <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
            {/* left part founding story*/}
            <div className="gap-10 flex flex-col my-24 lg:w-[50%]">
              <h1 className=" text-4xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045]  bg-clip-text font-semibold text-transparent lg:w-[70%] ">Our Founding Story</h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Our e-learning platform was born out of a shared vision and
                passion for transforming education. It all began with a group of
                educators, technologists, and lifelong learners who recognized
                the need for accessible, flexible, and high-quality learning
                opportunities in a rapidly evolving digital world.
              </p>

              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                As experienced educators ourselves, we witnessed firsthand the
                limitations and challenges of traditional education systems. We
                believed that education should not be confined to the walls of a
                classroom or restricted by geographical boundaries. We
                envisioned a platform that could bridge these gaps and empower
                individuals from all walks of life to unlock their full
                potential.
              </p>
            </div>
            {/* right */}
            <div>
              <img src={FoundingStory}
                alt="FoundingStory"
                loading="lazy"
                className="shadow-[0_0_20px_0] shadow-[#FC6767]" />
            </div>
          </div>


          {/* vision and mission */}
          <div className="flex flex-col items-center lg:flex-row justify-between lg:gap-10">
            {/* left part */}
            <div className="gap-10 my-24 flex flex-col lg:w-[40%]">
              <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%]">Our Vision</h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                With this vision in mind, we set out on a journey to create an
                e-learning platform that would revolutionize the way people
                learn. Our team of dedicated experts worked tirelessly to
                develop a robust and intuitive platform that combines
                cutting-edge technology with engaging content, fostering a
                dynamic and interactive learning experience.
              </p>
            </div>
            {/* right part */}
            <div className="gap-10 my-24 flex flex-col lg:w-[40%]">
            <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
                Our mission
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Our mission goes beyond just delivering courses online. We
                wanted to create a vibrant community of learners, where
                individuals can connect, collaborate, and learn from one
                another. We believe that knowledge thrives in an environment of
                sharing and dialogue, and we foster this spirit of collaboration
                through forums, live sessions, and networking opportunities.
              </p>
            </div>

          </div>

        </div>

      </section>

{/* section 4--stats */}
<StatsComponent />

{/* section 5 */}
<section className="mx-auto max-w-maxContentTab lg:max-w-maxContent mt-20 w-11/12 flex flex-col items-center justify-between gap-5 mb-[140px] ">
    <LearningGrid />
    <ContactFormSection />
</section>

<section className="w-11/12 max-w-maxContentTab lg:max-w-maxContent mx-auto p-4 relative my-20 flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <div className="text-center text-4xl font-semibold mt-8">
            Reviews from other learners           
          </div>
          <div className="w-[100%] h-[100%]">
          <ReviewSlider />
          </div>

      </section>

<Footer/>
    </div>
  );
};
export default About;
