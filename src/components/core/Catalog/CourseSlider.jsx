import React from 'react'
import "swiper/css/free-mode"
import CourseCard from './CourseCard'
import { Swiper, SwiperSlide } from 'swiper/react';
// import {SwiperCore} from 'swiper';
import 'swiper/css/scrollbar';
import { Keyboard, Scrollbar, Navigation, Pagination } from 'swiper/modules';
import { FreeMode ,Autoplay} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import { EffectCoverflow } from 'swiper/modules';
// SwiperCore.use([Autoplay]);
// 
const CourseSlider = ({Courses}) => {
    // console.log("COURSE-SLIDER COURSES:",Courses)
  return (
    <>
    {
        Courses?.length ?(
            <Swiper
            // slidesPerView={1}
            loop={true}     
            scrollbar={{ draggable: true }}
            spaceBetween={25}         
            freeMode ={true}
            pagination={{ clickable: false }}
            // modules={[Autoplay,FreeMode,Pagination,Navigation]}
            className="w-full max-h-[30rem]"
            autoplay={{
                delay: 2500,
            disableOnInteraction: false,
            }}       
            // navigation={true}
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        // pagination={true}
        modules={[EffectCoverflow,Autoplay, Pagination]}
            breakpoints={{
                1024:{slidesPerView:3,},
                768:{slidesPerView:2,}
            }
            
            }                    
            >
            {
                Courses?.map((course,index)=>(
                    <SwiperSlide
                    key={index}                   
                    >
                <CourseCard course={course} Height={"h-[250px]"} />
                    </SwiperSlide>
                )
                )
            }

            </Swiper>

        ):(
            <p className='text-xl text-richblack-5 font-medium'>No Courses Found</p>

        )
    }
    </>
  )
}

export default CourseSlider