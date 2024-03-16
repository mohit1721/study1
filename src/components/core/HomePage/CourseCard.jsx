import React from 'react'
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";
const CourseCard = ({cardData,currentCard,setCurrentCard}) => {
  const {heading,description,lessionNumber,level}=cardData;
  return (
    <div 
  className={`w-[360px] lg:w-[30%] h-[300px] box-border cursor-pointer rounded-sm
  ${
    currentCard===heading ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50  text-richblack-25" : "bg-richblack-800 text-richblack-25 " 
  }
  group hover:text-richblue-500 hover:bg-richblack-5 transition-all duration-200
  `}
  onClick={() => setCurrentCard(heading)}
    >
    <div
    className='border-b-[2px] border-dashed border-richblack-400 flex flex-col gap-3 p-6 h-[80%] '
    >
    <div 
    className={`${currentCard===heading ? "text-richblack-800" : "text-richblack-25" }
    font-semibold text-[20px] transition-all duration-75 group-hover:text-richblack-800 
     `}
    >
    {heading}
    </div>
    <div className='text-richblack-400'>{description} </div>

    </div>

    <div className='flex justify-between text-blue-300 px-6 py-4 font-medium '>
      <div className='flex items-center gap-2 text-[16px]'>
        <HiUsers/>
        <p>{level}</p>
      </div>
      <div className='flex items-center gap-2 text-[16px]'>
        <ImTree/>
      <p>{lessionNumber} Lessions </p>
      </div>
    </div>
    </div>
  )
}

export default CourseCard


// import React from "react";
// // Importing React Icons
// import { HiUsers } from "react-icons/hi";
// import { ImTree } from "react-icons/im";

// const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
//   const { heading, description, lessionNumber, level } = cardData;
//   return (
//     <div
//       className={`w-[360px] lg:w-[30%] h-[300px] box-border cursor-pointer
//       ${
//         currentCard === heading
//           ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50  text-richblack-25"
//           : "bg-richblack-800  text-richblack-25"
//       } transition-all duration-200 hover:bg-richblack-5 hover:text-richblue-500 group`}
//       onClick={() => setCurrentCard(heading)}
//     >
//       <div className="border-b-[2px] border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3">
//         <div
//           className={` ${
//             currentCard === heading ? "text-richblack-800" : "text-richblack-25"
//           }  font-semibold text-[20px] transition-all duration-20 group-hover:text-richblack-800`}
//         >
//           {heading}
//         </div>
//         <div className="text-richblack-400">{description}</div>
//       </div>

//       <div className="flex justify-between text-blue-300 px-6 py-3 font-medium">
//         <div className="flex items-center gap-2 text-[16px]">
//           <HiUsers/>
//           <p>{level}</p>
//         </div>
//         <div className="flex items-center gap-2 text-[16px]">
//           <ImTree/>
//           <p>{lessionNumber} Lession</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseCard;
