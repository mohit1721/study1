import React from 'react'

const Stats=[
    {count:"5K",   label:"Active Students"},
    {count: "10+", label: "Mentors"},
    {count: "200+", label: "Courses"},
    {count: "50+", label: "Awards"},
]
 const StatsComponent = () => {
  return (
    <section className='bg-richblack-700'>
    <div className='flex flex-col gap-10 justify-between w-11/12 max-w-maxContent text-white mx-auto'>
    <div className=' text-white gap-x-6 grid text-center md:grid-cols-4 grid-cols-2 '>
        {
            Stats.map((data,index)=>{
                return (
                    <div 
                    className="flex flex-col py-10"
                    
                    key={index}>
                        <h1 className='text-[30px] font-bold text-richblack-5 '>
                           { data.count}
                        </h1>
                        <h2 className='text-richblack-500 font-semibold text-[16px]'>
                            {data.label}
                        </h2>
                    </div>
                )
            })
        }
    </div>
</div>
    </section>
  )
}
export default StatsComponent