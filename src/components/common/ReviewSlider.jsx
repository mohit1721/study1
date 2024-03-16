import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Autoplay,FreeMode , Navigation, Pagination } from "swiper/modules";
import ReactStars from "react-rating-stars-component";
import { apiConnector } from "../../services/apiconnector";
import { ratingsEndpoints } from "../../services/apis";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";
const ReviewSlider = () => {
  //npm react-swiper
  // const [reviews, setReviews] = useState([]);
  // const truncateWords=15;
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fecthAllReviews = async () => {
  //     try {
  //       const response = await apiConnector(
  //         "GET",
  //         ratingsEndpoints.REVIEWS_DETAILS_API
  //       );

  //       if (response) {
  //         if (!response.data.success) {
  //           throw new Error(response.data.message);
  //         }
  //         setReviews(response?.data?.data);
  //         // console.log("REVIEWS_DETAILS_API RESPONSE.....",response)
  //       }
  //     } catch (error) {
  //       console.log("ERROR IN GETTING ALL REVIEWS....", error);
  //     }
  //   };

  //   fecthAllReviews();
  // }, []);
  
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);
  const truncateWords=15;
  useEffect(() => {
    const fecthAllReviews = async () => {
      try {
        const response = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        );

        if (response) {
          if (!response.data.success) {
            throw new Error(response.data.message);
          }
          setReviews(response?.data?.data);
          // console.log("REVIEWS_DETAILS_API RESPONSE.....",response)
        }
      } catch (error) {
        console.log("ERROR IN GETTING ALL REVIEWS....", error);
      }
    };

    fecthAllReviews();
  }, []);
 useEffect(() => {
    if (reviews.length > 0) {
      setLoading(false);
    }
  }, [reviews]);

  return (
    <div className=" text-white w-full rounded-md ">
      <div className="h-[190px] lg:max-w-maxContent max-w-maxContentTab my-[50px]">
        <Swiper
          slidesPerView={1}
          breakpoints={{
            1024: {
              slidesPerView: 4,
            },
            624: {
              slidesPerView: 2,
            },
        
          }}
          scrollbar={{ draggable: true }}
          spaceBetween={25}
          loop={true}
          freeMode ={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full "
        >
         <div>
         {reviews.map((review, index) => (
            <SwiperSlide key={index}>
            <div className="flex flex-col mx-auto items-center gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25 ">
            <div className="flex items-center gap-4">
            {
              loading?(
                <Skeleton
                  circle
                  containerClassName="avatar-skeleton"
                  className="h-9 w-9 bg-richblack-50"
                />
              ):(
                <img
    src={
      review?.user?.image ?
       review?.user?.image :
        `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
    }
    className="h-9 w-9 rounded-full object-cover"
                  alt="pic"
                />
              )

              
            }
            <div className="flex flex-col">
                      {loading ? (
                        <Skeleton count={2} className="w-[150px] bg-richblack-50" height={6}/>
                      ) : (
                        <>
                          <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                          <h2 className="text-[12px] font-medium text-richblack-500">
                            {review?.course?.courseName}
                          </h2>
                        </>
                      )}
                    </div>


            </div>
                  {loading ? (
                    <Skeleton count={3} height={5} width={200} className="bg-richblack-100"/>
                  ) : (
                    <p className="font-medium text-richblack-25">
                      {review?.review.split(" ").length > truncateWords
                        ? `${review?.review
                            .split(" ")
                            .slice(0, truncateWords)
                            .join(" ")} ...`
                        : `${review?.review}`}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    {loading ? (
                      <Skeleton width={30} height={2} className="bg-richblack-25"/>
                    ) : (
                      <h3 className="font-semibold text-yellow-100">
                        {review.rating.toFixed(1)}
                      </h3>
                    )}
                    {loading ? (
                      <Skeleton
                        count={1}
                        wrapper={ReactStars}
                        height="100%"
                        baseColor="#ebab34"
                        highlightColor="#f2cb07"
                        duration={0.9}
                        className="bg-richblack-25"
                      />
                    ) : (
                      <ReactStars
                        count={5}
                        value={review.rating}
                        size={20}
                        edit={false}
                        activeColor="#ffd700"
                        emptyIcon={<FaStar />}
                        fullIcon={<FaStar />}
                      />
                    )}
                  </div>

            </div>

            </SwiperSlide>
          )
          

          )}
         </div>
        </Swiper>
      </div>
    </div>
  );
};

export default ReviewSlider;