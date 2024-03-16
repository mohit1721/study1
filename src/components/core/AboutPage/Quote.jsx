import React from "react";
import HighlightText from "../HomePage/HighlightText";
import "../../core/highL.css"
const Quote = () => {
  return (
    <div className="text-white text-xl md:text-4xl font-semibold mx-auto text-center py-5 pb-20">
      We are passionate about revolutionizing the way we learn. Our innovative
      platform
      <HighlightText text={"combines technology"} />
      <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold"> expertise</span>, and community to
      create an
      <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
        {" "}
        unparalleled educational experience.
      </span>
    </div>
  );
};
export default Quote;
