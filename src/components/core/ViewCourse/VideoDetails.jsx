import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import 'video-react/dist/video-react.css';
// import {AiFillPlayCircle} from "react-icons/ai"
import IconBtn from '../../common/IconBtn';
import {
    BigPlayButton,
    ControlBar,
    CurrentTimeDisplay,
    ForwardControl,
    PlayToggle,
    PlaybackRateMenuButton,
    Player,
    ReplayControl,
    TimeDivider,
    VolumeMenuButton,
  } from "video-react";
const VideoDetails = () => {

const {courseId,sectionId,subSectionId}=useParams();
const navigate =useNavigate();
const dispatch = useDispatch();
const location = useLocation();
const playerRef = useRef();
const {token }=useSelector((state)=>state.auth);
const {courseSectionData,courseEntireData,
    completedLectures}=useSelector((state)=>state.viewCourse);

const [videoData,setVideoData] = useState([]);
const [videoEnded,setVideoEnded] = useState(false);
const [loading,setLoading]=useState(false);
const [previewSource, setPreviewSource] = useState("");//thumnail
useEffect(()=>{
    // pehle render p/kuch data k change p kya show krna h..uske liye useEffect ka use kr lenge
    const setVideoSpecificDetails =async()=>{
        if(!courseSectionData.length)
            return;

            if(!courseId && !sectionId && !subSectionId){
                navigate("/dashboard/enrolled-courses");
            }
            else{
                //filtering 
                //let's assume ki all 3 fields are present
                    // fetch kon si video dikhani h
                    // section
                    const filteredData = courseSectionData?.filter(
                        (section)=>section._id === sectionId
                    )
                    // sub-section
                    const filteredVideoData =filteredData?.[0].subSection.filter(
                        (topic)=>topic._id === subSectionId
                    )
                    setVideoData(filteredVideoData?.[0]);
                    setPreviewSource(courseEntireData?.thumbnail)
                    setVideoEnded(false);
            }
    }
    setVideoSpecificDetails();
},[courseSectionData,courseEntireData,location.pathname])


const isFirstVideo=()=>{
//0th index of section+subsection
const currentSectionIndex = courseSectionData.findIndex(
    (data)=>data._id === sectionId
)
const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
    (data)=>data._id === subSectionId
)
if(currentSectionIndex === 0  && currentSubSectionIndex === 0){
    return true;
}
else{
    return false;
}
}
const isLastVideo=()=>{
    const currentSectionIndex = courseSectionData.findIndex(
        (data)=>data._id === sectionId
    )
    const noOfSubSections =courseSectionData[currentSectionIndex].subSection.length;
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
        (data)=>data._id === subSectionId
    )
        if(currentSectionIndex === courseSectionData.length-1 &&
            currentSubSectionIndex === noOfSubSections -1
            ){
                return true;
            }
            else
{
    return false;
}
}

const goToNextVideo=()=>{

    const currentSectionIndex = courseSectionData.findIndex(
        (data)=>data._id === sectionId
    )
    const noOfSubSections =courseSectionData[currentSectionIndex].subSection.length;
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
        (data)=>data._id === subSectionId
    )
       if(currentSubSectionIndex!==noOfSubSections-1){
        //means same section k andar aur lectures exist kr ske h
        const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSectionIndex+1]._id;
        //next video pr jana h,jo same section ki h
        navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
    
    }
    else{
        //different section ki first video pr jana h
        const nextSectionId=courseSectionData[currentSectionIndex+1]._id;
        const nextSubSectionId=courseSectionData[currentSectionIndex+1].subSection[0]._id;
        //iss video pr jao
        navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
    }

}

const goToPrevVideo=()=>{
    const currentSectionIndex = courseSectionData.findIndex(
        (data)=>data._id === sectionId
    )
    const noOfSubSections =courseSectionData?.[currentSectionIndex]?.subSection.length;
    const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
        (data)=>data._id === subSectionId
    )
if(currentSubSectionIndex !== 0)
{
    //same section ,prev video
    const prevSubSectionId=courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1]._id;
    //ab uss video p chle jao
    navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)

}
else
{
    //different section last video
    const prevSectionId=courseSectionData[currentSectionIndex-1]._id;
    const prevSubSectionLength = courseSectionData[currentSectionIndex-1].subSection.length;
    const prevSubSectionId=courseSectionData[currentSectionIndex-1].subSection[prevSubSectionLength-1]._id;
 //ab uss video p chle jao
 navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)

}


}
const handleLectureCompletion=async()=>{
//dummy code ,later will replace it

//PENDING ---> COURSE PROGRESS 
setLoading(true);

const res = await markLectureAsComplete(
    {courseId :courseId,subSectionId:subSectionId},
    token)

//state update 
if(res){
    dispatch(updateCompletedLectures(subSectionId))
}
setLoading(false);
}


// const handleLectureCompletion = async () => {
//     setLoading(true)
//     const res = await markLectureAsComplete(
//       { courseId: courseId, subSectionId: subSectionId },
//       token)
//     if (res) {
//       dispatch(updateCompletedLectures(subSectionId))
//     }
//     setLoading(false)
//   }

  return (
    <div className="lg:mx-6 lg:mt-0 mt-20 mx-0 ">
<div className="flex flex-col gap-5 text-white">
{
        !videoData ? (
            <img
            src={previewSource}
            alt="Preview"
            className="h-full w-full rounded-md object-cover"
          />
        ):(
            //use video player -npm i video-react
        <Player  
            ref={playerRef}
            aspectRatio="16:9"
            playsInline
            onEnded={()=>setVideoEnded(true)}
            src={videoData?.videoUrl}
            >  
        <BigPlayButton position="center" />        
            {/* <AiFillPlayCircle  /> */}
        <ControlBar>
        {/*Forwar and backward buttons  */}
        <ReplayControl seconds={10} order={1.1} />
        <ForwardControl seconds={30} order={1.2} />
        <PlayToggle />
            {/* Current display time */}
        <CurrentTimeDisplay order={4.1} />

        {/* Divider Sign */}
        <TimeDivider order={4.2} />

        {/* Speed of the Video */}
        <PlaybackRateMenuButton
        rates={[0.75, 1, 1.25, 1.5, 1.75, 2]}
        order={7.1}/>
        {/* volume */}
        <VolumeMenuButton />
    </ControlBar>

 {/* Render When Video Ends */}
{
videoEnded && (
    <div 
    style={{
    backgroundImage:
    "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
}}
className='full absolute inset-0 z-[100] grid h-full place-content-center font-inter'>
    {
        !completedLectures.includes(subSectionId) && (
            <IconBtn 
            disabled={loading}
            customClasses="text-xl text-richblack-400 max-w-max px-4 mx-auto bg-caribbeangreen-200"
            onclick={()=>handleLectureCompletion()} //fxn call on click
            text={!loading ? "Mark As Completed": "Loading..."}
            />
        )
    }
    {/* Rewatch btn*/}
        <IconBtn
            disabled={loading}
            onclick={()=>{
                //seek 0 krna h-->0 se dubara se start krna h
                if(playerRef?.current){
                    playerRef.current?.seek(0);
                    setVideoEnded(false);
                }
            }} //fxn call on click
            text="Rewatch"
            customClasses="text-xl max-w-max px-4 mx-auto mt-2"
            />

        <div className='mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl'>
            {
                !isFirstVideo() && (
                    <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className='blackButton text-white'
                    >
                        Prev
                    </button>
                )
            }
            {
                !isLastVideo()&& (
                    <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className='blackButton text-white'
                    >
                        Next
                    </button>

                )
            }
        </div>
    </div>
)
}
        </Player>
        )
    }

<div className='text-start md:mx-1.5'>
<h1 className='mt-4 text-3xl font-semibold lg:mx-0 mx-auto'>
    {videoData?.title}
</h1>
<p claasName="pt-2 pb-6 mx-auto lg:mx-0 text-center">
    {videoData?.description}
</p>
</div>
    
</div>
    </div>
  )
}

export default VideoDetails