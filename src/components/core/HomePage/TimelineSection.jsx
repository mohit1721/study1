import React from "react";

import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import timelineImage from "../../../assets/Images/TimelineImage.png";

const timeline = [ //Data ..array of objects
  {
    Logo: Logo1,
    heading: "Leadership",
    Description: "Fully committed to the success company",
  },
  {
    Logo: Logo2,
    heading: "Responsibility",
    Description: "Fully committed to the success company",
  },
  {
    Logo: Logo3,//imported images
    heading: "Flexibility",
    Description: "Fully committed to the success company",
  },
  {
    Logo: Logo4,
    heading: "Solve The Problem",
    Description: "Fully committed to the success company",
  },
];

const TimelineSection = () => {
  return (
    <div>
      <div className="flex lg:flex-row flex-col gap-20 items-center">
        <div className="w-[45%] flex flex-col gap-14 lg:gap-5">
          {timeline.map((element, index) => {
            return (
              <div className="flex flex-row lg:gap-6" key={index}>
              {/* logo */}
                <div className="flex gap-6" key={index} >
                  <div className="w-[50px] h-[50px] bg-white rounded-full justify-center flex items-center shadow-[#00000012] shadow-[0_0_62px_0]">
                  <img src={element.Logo} alt="logos" />
                  </div>
                 
                </div>
                {/* heading+description */}
                <div>
                  <h2 className="font-semibold text-[18px]">
                    {element.heading}
                  </h2>
                  <p className="text-base">{element.Description}</p>
                </div>
                {/* <div
                  className={`hidden ${
                    timeline.length - 1 === index ? "hidden" : "lg:block"
                  }  h-14 border-dotted border-r border-richblack-100 bg-richblack-400/0 w-[26px]`}
                ></div> */}
              </div>
            );
          })}
        </div>

        {/* right part */}
        <div className="relative w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px] ">
          <img
            src={timelineImage}
            alt="timelineImage"
            className=" shadow-white object-cover h-fit  "
          />
          {/* green section--to overlap  [[left-[50%] translate-x-[-50%] translate-y-[-50%]]py-6] */}
          <div
            className="absolute bg-caribbeangreen-700  flex flex-row text-white uppercase py-10 
          left-[7%] bottom-[-13%]"
          >
            <div className="flex flex-row gap-5 items-center lg:border-r border-caribbeangreen-300 px-7 lg:px-14 ">
              <p className=" text-3xl font-bold">10</p>
              <p className=" text-caribbeangreen-300 text-sm w-[75px]">
                years of Experience
              </p>
            </div>
            <div className="flex gap-5 items-center px-7 lg:px-14  ">
              <p className=" text-3xl font-bold w-[75px]">250</p>
              <p className=" text-caribbeangreen-300 text-sm w-[75px]">
                Types of courses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;
