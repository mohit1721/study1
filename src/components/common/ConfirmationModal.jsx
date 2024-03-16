import React from 'react'
import IconBtn from './IconBtn'

 const ConfirmationModal = ({modalData}) => { //modalData-->
  return (
    <div className='fixed inset-0 z-[1000] !mt-0 backdrop-blur-sm bg-opacity-10 bg-white overflow-auto grid place-items-center  '>
    <div className='w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6 '>
         {/* heading */}
        <p className='text-2xl font-semibold text-richblack-5'>
            {modalData?.text1}
        </p>
        {/* text */}
        <p className='mt-3 mb-5 leading-6 text-richblack-200'>
            {modalData?.text2}
        </p>
        {/* buttons */}
        <div className='flex items-center gap-x-4'>
            <IconBtn
                onclick={modalData?.btn1Handler}
                text={modalData?.btn1Text}
            />
            {/* cancel button */}
            <button
             onClick={modalData?.btn2Handler}
             className='rounded-md bg-richblack-200 cursor-pointer font-semibold py-[8px] px-[20px] text-richblack-900'               
            >
                 {modalData?.btn2Text}
            </button>
        </div>
    </div>
    
    </div>
  )
}
export default ConfirmationModal