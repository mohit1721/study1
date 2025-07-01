import React from 'react'
import {HiChatBubbleLeftRight} from "react-icons/hi2"
import {BiWorld} from "react-icons/bi"
import {FcCallback} from "react-icons/fc"
const InfoSectionData = [
    {
      heading: "Chat on us",
      desc1: "Our friendly team is here to help.",
      desc2: "info@lernix.com",
       icon : <HiChatBubbleLeftRight fontSize={25}/>
    },
    {
      heading: "Visit us",
      desc1: "Come and say hello at our office HQ.",
      desc2: "Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016",
       icon : <BiWorld fontSize={25}/>
    },
    {
      heading: "Call us",
      desc1: "Mon - Fri From 8am to 5pm",
      desc2: "+123 456 7869",
       icon : <FcCallback fontSize={25}/>
    },
  ]
  
const InfoSection = () => {
  return (
    <div className='lg:w-[40%]'>
    <div className='flex flex-col gap-6 rounded-xl bg-richblack-800 p-4 lg:p-6'>
    {
        InfoSectionData.map((element,index)=>(
            <div key={index} 
            className='flex flex-col gap-[2px] p-3 text-sm text-richblack-200 '
            >
            <div className='flex flex-row items-center gap-3'>
                {element.icon}
                <h1 className='text-lg font-semibold text-richblack-5'>{element.heading}</h1>
            </div>
            <p className='font-medium'>{element.desc1}</p>
              <p className='font-semibold'>{element.desc2}</p>
            </div>
        ))
    }
    </div>
    </div>
  )
}

export default InfoSection