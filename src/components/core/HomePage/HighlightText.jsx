import React from 'react'
import "../../core/highL.css"
const HighlightText=({text})=> {//text jo paas kiya gya h,use retrieve as props kiye yehhan
  return (
    <span className='bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text font-bold' >
    {" "}
    {/* jo unput se text aya..use props se fetch krke yehaan use kiye */}
    {text}  {" "}
    </span>
  )
}

export default HighlightText