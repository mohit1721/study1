import React from "react";
import CTAButton from "../HomePage/Button";
// import HighlightText from "./HighlightText";
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
const CodeBlocks = ({
  //jb v mera ye component use ho rha hoga..ye sari properties input m di jayegi
  position, //props
  heading,
  subheading,
  ctabtn1,
  ctabtn2,//ye sb content, input m dusre component se le rhe h 
  codeblock,
  backgroundGradient,
  codeColor,
  codeBg
}) => {
  return (              //position input m aayi h..baki ..
    <div className={`flex flex-col ${position} my-20 justify-between gap-10`}>
      {/* section I */}
      <div className="w-[100%] flex flex-col gap-8 lg:w-[50%]">
        {heading}
        <div className="text-richblack-300 font-bold ">{subheading}</div>
        <div className="flex gap-7 mt-7">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
            <div className="flex gap-2 items-center">
              {ctabtn1.btnText}
              {/* //ctabtn1 ka text/active/linkto use krni h*** */}
              <FaArrowRight />
            </div>
          </CTAButton>

          <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
            {ctabtn2.btnText}
          </CTAButton>
        </div>
      </div>
      {/*  Section II -->CODE */}
      <div className={`border relative select-none border-richblack-600 h-fit code-border flex flex-row text-[10px] sm:text-sm leading-[18px] w-[100%] py-4 lg:w-[500px]`}>
        {/*TODO: HW ->BG Gradient */}
    <div className={`${codeBg} absolute`}>
    </div>
    <div className="text-center flex flex-col select-none w-[10%] text-richblack-400 font-inter font-bold">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>
        {/* code wali animation */}
        <div
          className={`w-[90%] z-10 flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2 ${backgroundGradient}`}
        >
          <TypeAnimation //not a component..its library
            sequence={[codeblock,10000, ""]} //code ki value-->present in codeblock
            repeat={Infinity}
            cursor={true}
            style={{ whiteSpace: "pre-line", display: "block"}} //pre-line..line break
            omitDeletionAnimation={true} //**cursor instant starting se start -- */
          />
        </div>
      </div>
    </div>
  );
};
export default CodeBlocks;
