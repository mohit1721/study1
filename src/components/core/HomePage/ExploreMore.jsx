import React from 'react'
import { useState } from 'react';
import {HomePageExplore} from "../../../data/homepage-explore" ///data imported
import HighlightText from './HighlightText';
import CourseCard from './CourseCard'
const tabsName=[
    "Free",
    "New to Coding",
    "Most Popular",
    "Skill Paths",
    "Career Paths",
]

 const ExploreMore = () => {

    const [currentTab,setCurrentTab]=useState(tabsName[0]); //by default--Free wale courses 
    const [courses,setCourses]=useState(HomePageExplore[0].courses); // courses linked with the tab
    const [currentCard,setCurrentCard]=useState(HomePageExplore[0].courses[0].heading)   // jispe click kia
    //fxn to set current values
    const setMyCards= (value)=>{ ///current card,current tab ko update krta h
        setCurrentTab(value);
        const result =HomePageExplore.filter((course)=>course.tag===value);
        setCourses(result[0].courses);//updating state variable
        setCurrentCard(result[0].courses[0].heading);
    }
  return (
    <div>
    <div className='text-4xl font-semibold text-center my-10 relative'>
        Unlock the 
        <HighlightText text={"Power Of Code"} />
        <p className='text-center text-richblack-300 font-semibold text-lg mt-1'>
        Learn to build anything you can Imagine
    </p>
    </div>
      {/* Tab section */}
      <div className='lg:flex -mt-5 mx-auto w-max gap-5
 rounded-lg text-richblack-200 p-1 bg-richblack-800 mb-5 border-richblack-100 
   font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]' >
        {
            tabsName.map((element,index)=>
               (
                    <div className={`text-[16px] lg:flex flex-row items-center gap-2
                    ${
                    currentTab===element
                     ? "bg-richblack-900 text-richblack-5 font-medium "
                    :  "text-richblack-200"} 
                    rounded-full transition-all duration-200 cursor-pointer
                    hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2  `}
                    key={index}
                    onClick={()=>setMyCards(element)} //jb tab m click...current card ki value sb change 
                    >
                    {/*tabsName m ho h wohi ayega..bs styling m dimaag lgana h  */}
                    {element} 
                    </div>
                )           
            )
        }
    </div>




        {/* blank space */}
    <div className='hidden lg:h-[200px] lg:block'></div>
    {/* card compo */}
        <div className='lg:absolute flex flex-wrap gap-10 lg:gap-0 justify-center lg:justify-between w-full mb-7 lg:-bottom-[6%] lg:left-[0.119%]'>

        {
            courses.map((element,index)=>(               
                    <CourseCard
                        key={index} //must
                        cardData={element}  //card ka data pass
                        currentCard={currentCard}  //current card k acc. styling
                        setCurrentCard={setCurrentCard}  //change current card 
                    />
                
            )                        
            )
        }

        </div>

    </div>
  )
}
export default ExploreMore