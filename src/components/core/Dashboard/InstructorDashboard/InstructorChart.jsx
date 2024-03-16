import React from 'react'
import { useState } from 'react'
import {Chart,registerables} from "chart.js"//1.
import {Pie} from "react-chartjs-2"//2.

Chart.register(...registerables); //3.register chart

const InstructorChart = ({courses}) => {//import courses

    //using npm i chart.js

    //flag to show which chart is
    const [currChart,setCurrChart]=useState("students") //by default students ka show
    //function to  gen. random colors
    const getRandomColors=(numColors)=>{
        const colors=[];
        for(let i=0;i<numColors;i++)
        {
            const color=`rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}) `
            colors.push(color);
        }
        return colors;
    }
//create data for displaying student info
const chartDataForStudents={
    labels:courses.map((courses)=>courses.courseName),//hr courses k name...
//  jiska use krke pie chart bnega  
    datasets:[{
        data:courses.map((course)=>course.totalStudentsEnrolled),
        backgroundColor:getRandomColors(courses.length),
    }]
}

//create data for displaying income info
const chartDataForIncome={
    labels:courses.map((courses)=>courses.courseName),//hr courses k name...
    datasets:[{
        data:courses.map((course)=>course.totalAmountGenerated),
        backgroundColor:getRandomColors(courses.length),
    }]
}
//create options---[[payments,auth ]]
const options={
};
  return (
    <div className='flex flex-1 lg:h-[450px] flex-col gap-y-4 rounded-md bg-richblack-800 p-6'>
    <p className="text-lg font-bold text-richblack-5">Visualize</p>
    <div className="space-x-4 font-semibold"> 
        <button
        onClick={()=>setCurrChart("students")}
        className={`rounded-sm p-1 px-3 transition-all duration-200 
        ${currChart==="students"?"bg-richblack-700 text-yellow-50" :"text-yellow-400" }
        `}
        >
            Student
        </button>
        <button
          onClick={()=>setCurrChart("income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 
        ${currChart==="income"?"bg-richblack-700 text-yellow-50" :"text-yellow-400" }
        `}
          >
            Income
        </button>
    </div>
    <div className='relative mx-auto aspect-square h-full w-fullz'>
    {/* 4. */}
        <Pie
        data={currChart==="students"?chartDataForStudents:chartDataForIncome }
        options={options}
        />
    </div>

    </div>
  )
}

export default InstructorChart