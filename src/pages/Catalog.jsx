import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiconnector";
import { categories, ratingsEndpoints } from "../services/apis";
import { getCatalogaPageData } from "../services/operations/pageAndComponentData";
import CourseCard from '../components/core/Catalog/CourseCard';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import Footer from "../components/common/Footer";
import ReviewSlider from "../components/common/ReviewSlider";
const Catalog = () => {
const {catalogName}=useParams();//from url
const [catalogPageData,setCatalogPageData] = useState (null);
const [categoryId,setCategoryId]=useState(""); //since kbhi v koi v kisi pr v click kr skta h,to yehi refer krega

// Fetch all categories

// jb v naya url ban rha h ..tb useEffect wala case run hona chhahiye


useEffect(()=>{
const getcategories=async()=>{
    const res = await apiConnector("GET",categories.CATEGORIES_API);  //isse saari categories aa gyi
    //filtering -->UI m jo space h usko hatake hyphen(-) lga k,lowerCase m laa do...
        const category_id=res?.data?.data?.filter((ct)=>ct.name.split(" ").join("-").toLowerCase()===catalogName)[0]._id //is trh currently selected category ki id nikal li
      setCategoryId(category_id);
}
getcategories();

},[catalogName]); //call when catalogName is changed--->jb v main click krunga kisi particular field pr-->ek naya url banta h--->tb parameter k andar catalogName ki value change ho jayegi-->to jb nya url ban rha ,tbhi ye code render hona chahiye
//ab iss getcategoryDetails ko call marenge
// pehli wali useEffect se categoryId nikaalke,dusri wali useEffect se API Call kr rhe
useEffect(()=>{
//yehaan pr actual api hit hone wali h
const getcategoryDetails =async()=>{
  try {
    const res =await getCatalogaPageData(categoryId); //co
    console.log("PRinting res: ", res);
    setCatalogPageData(res);//res is catalogPageData
  } catch (error) {
    console.log(error)
  }
}

if(categoryId){
  getcategoryDetails();
}

},[categoryId]) //ye useEffect jb category id change hoti h tb call hoti h






  return (
    <div className="text-white mt-14">
    <div className="box-content bg-richblack-800 p-4">
     <div className="min-h-[260px] mx-auto flex flex-col justify-center gap-4 max-w-maxContentTab md:max-w-maxContent p-4 py-12 ">
     <p className='text-sm text-richblack-300'>{`Home/Catalog/`}
       <span className='text-yellow-25'>
           {catalogPageData?.data?.selectedCategory?.name}
       </span>
       {/* see using console log--> */}
       </p>

       <p className='text-3xl text-richblack-5'> {catalogPageData?.data?.selectedCategory?.name} </p>
       <p className='max-w-[870px] text-richblack-200'> {catalogPageData?.data?.selectedCategory?.description}</p>
     </div>
   </div>

 <div>
   {/* section 1 */}
   <div className="mx-auto w-full box-content max-w-maxContentTab md:max-w-maxContent p-4 py-12">
   <div className="text-4xl font-bold text-richblack-5 section_heading">Courses to get you started</div>
     <div className="flex my-4 border-b-[1px] border-richblack-600 text-sm">
       <p className="text-xl font-semibold text-yellow-100">Most Popular</p>
       {/* <p>New</p> */}
     </div>

     <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses} />
   </div>

   {/* section 2 Top Courses*/}
   <div className="mx-auto w-full box-content max-w-maxContentTab md:max-w-maxContent p-4 py-12">

     <div className="text-4xl font-bold text-richblack-5 section_heading">Top Courses in {catalogPageData?.data?.differentCategory?.name} </div>
     <div className="py-8">
       <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses}/>
     </div>
   </div>

   {/* <section 3 Frequently Bought*/}
   <div className="mx-auto w-full box-content max-w-maxContentTab md:max-w-maxContent p-4 py-12">
           <div className="text-4xl font-bold text-richblack-5 section_heading">Frequently Bought</div>
           <div className='py-8'>
               <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>

                   {
                       catalogPageData?.data?.mostSellingCourses?.slice(0,4)
                       .map((course, index) => (
                           <CourseCard course={course} key={index} Height={"h-[400px]"}/>
                       ))
                   }

               </div>

           </div>
    </div>
    <section className="w-11/12 max-w-maxContentTab lg:max-w-maxContent mx-auto relative my-20 flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <div className="text-center text-4xl font-semibold mt-8">
            Reviews from other learners           
          </div>
          <div className="w-[100%] h-[100%]">
          <ReviewSlider  />
          </div>

      </section>
 </div>

 {/* <Footer/> */}
 <Footer/>
</div>
  );
};

export default Catalog;
