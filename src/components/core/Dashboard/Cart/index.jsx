import React from "react";
import { useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart);

  return (

    <div className="text-white">
      {/* div can remove */}
      <h1 className="text-3xl text-richblack-5 font-semibold mx-2 mb-10">Your Cart</h1>
      <p className="border-b border-b-richblack-400 text-richblack-300 font-semibold mx-2 mb-1"> {totalItems} Courses in cart </p>
       {/* Horizontal line */}
       {/* <div className='mx-auto mt-6 mb-6 h-[1px] w-11/12 bg-richblack-700'></div> */}
     
        {total > 0 ? (
          <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
            <RenderCartCourses />
            <RenderTotalAmount />
          </div>
        ) : (
          <p className="mt-14 text-center text-3xl text-richblack-100 ">Your Cart is Empty</p>
        )}
  
    </div>
  );
}
