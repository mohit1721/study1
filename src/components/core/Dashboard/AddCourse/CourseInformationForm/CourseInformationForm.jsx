import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import RequirementField from "./RequirementField";
import { setStep, setCourse} from '../../../../../slices/courseSlice';
import IconBtn from "../../../../common/IconBtn";
import { toast } from "react-hot-toast";
import { COURSE_STATUS } from "../../../../../utils/constants";
import Upload from "../Upload";
import ChipInput from "./ChipInput";
const CourseInformationForm = () => {
  const limitWords = (text, maxWords = 100) => {
    const words = text.trim().split(/\s+/);  // Split by any whitespace
    return words.slice(0, maxWords).join(' ');  // Get the first 100 words
  };
  
  const {
    register,
    handleSubmit,
    setValue,
    getValues,watch ,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const {token} = useSelector((state)=>state.auth);
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);
  const selectedCategory = watch("courseCategory"); // Use watch to track category
const selectedLevel = watch("level"); // Use watch to track
const selectedLanguage= watch("language"); // Use watch to track
  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      if (categories.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    };
    // if (editCourse) {  //course m ye saari cheezein h...
    //   setValue("courseName", course.courseName); //mapp with values/variables
    //   setValue("courseShortDesc", course.courseDescription);
    //   setValue("coursePrice", course.price);
    //   setValue("courseTags", course.tag);
    //   setValue("courseBenefits", course.whatYouWillLearn);
    //   setValue("courseCategory", course.category);
    //   setValue("courseRequirements", course.instructions);
    //   setValue("courseImage", course.thumbnail);
    //   setValue("courseLanguage", course.language);
    //   setValue("courseLevel", course.level);
    // }
    if (editCourse && course) {  
      setValue("courseName", course.courseName || ""); 
      // setValue("courseShortDesc", course.courseDescription || "");
      setValue("courseShortDesc", limitWords(course.courseDescription || "", 100));  // Limit to 100 words
      setValue("coursePrice", course.price || "");
      // setValue("courseTags", course.tag || []);
      setValue("courseTags", Array.isArray(course.tag) ? course.tag : []);
      setValue("instructions", Array.isArray(course.instructions) ? course.instructions : []); // Ensure instructions is an array

      setValue("courseBenefits", course.whatYouWillLearn || "");
      // setValue("courseCategory", course.category || {});
      setValue("courseCategory",  course.category?._id || "");

      // setValue("courseRequirements", course.instructions || []);
      setValue("courseImage", course.thumbnail || "");
      setValue("language", course.language || "");
      setValue("level", course.level || "");
    }


    getCategories(); //call
  }, [editCourse]);
  const isFormUpdated=()=>{
    const currentValues = getValues();
    // if not equal [!==] ,return true..[[updated]]
        if(
        currentValues.courseName!==course.courseName||
        currentValues.courseShortDesc !== course.courseDescription ||
        currentValues.coursePrice !== course.price ||        
        currentValues.courseTags.toString() !== course.tag.toString() ||
        currentValues.courseBenefits !== course.whatYouWillLearn ||
        currentValues.courseCategory._id !== course.category._id ||
        currentValues.courseImage !== course.thumbnail ||
        currentValues.instructions.toString() !== course.instructions.toString()||
        currentValues.language !== course.language ||
        currentValues.level !== course.level             
        )
       { return true;}
    console.log("Course NAME UPDATED->",currentValues.courseName )
        return false;
  }

//handles next-button click**
 
const onSubmit = async (data) => {
if(editCourse){
 if(isFormUpdated()){
     //jb change /update hua  h tbhi ye logic
  const currentValues=getValues();
  const formData=new FormData();//FormData ka object bna lo..jisma sara form ka data rhne wala h
  formData.append("courseId",course._id); // is formdata m sara data append kr lo..*
  //append only changed/updated values
  if(currentValues.courseName!== course.courseName){
      formData.append("courseName",data.courseName);
  }
  
  if(currentValues.courseShortDesc !== course.courseDescription) {
      formData.append("courseDescription", data.courseShortDesc);
  }
  if (currentValues.courseCategory?.id !== course.category?._id) {
    formData.append("category", data.courseCategory);
}
if (currentValues.courseTags.toString() !== course.tag.toString()) {
  formData.append("tag", JSON.stringify(data.courseTags));
}
 
  if(currentValues.coursePrice !== course.price) {
      formData.append("price", data.coursePrice);
  }

  if(currentValues.courseBenefits !== course.whatYouWillLearn) {
      formData.append("whatYouWillLearn", data.courseBenefits);
  }
  if (currentValues.courseImage !== course.thumbnail) {
    formData.append("thumbnailImage", data.courseImage);
  }
  if (currentValues.courseLanguage !== course.language) {
    formData.append("language", data.language);
  }
  if (currentValues.courseLevel !== course.level) {
    formData.append("level", data.level);
  }
  

  // if(currentValues.instructions.toString() !== course.instructions.toString()) {
  //     formData.append("instructions", JSON.stringify(data.instructions));
  // }
  if (JSON.stringify(currentValues.instructions) !== JSON.stringify(course.instructions)) {
    formData.append("instructions", JSON.stringify(data.instructions));
}

  setLoading(true);
  const result = await editCourseDetails(formData,token); //saare data[[formdata]],ko API call m daalunga, jo editCourseDetails ki API Hogi
  setLoading(false);
  if(result){ //isme,validate krke result aaya..agar validate kr li to,next step
      dispatch(setStep(2));
      dispatch(setCourse(result)) //++course ki value ko v change kr di updated value k sath
  }
 
 }
 else{
    toast.error("NO changes made to the form");
}
return;
}

// AGAR PEHLI BAAR CREATE KRNE AAYE HO TO,USKA ALAG SE CODE

// create a new course
const formData=new FormData();
formData.append("courseName",data.courseName);
formData.append("courseDescription", data.courseShortDesc);
formData.append("price", data.coursePrice);
formData.append("tag", JSON.stringify(data.courseTags));
formData.append("whatYouWillLearn", data.courseBenefits);
// formData.append("category", data.courseCategory);
formData.append("category", data.courseCategory?._id || data.courseCategory);

formData.append("instructions", JSON.stringify(data.instructions));
formData.append("status", COURSE_STATUS.DRAFT);
formData.append("thumbnailImage", data.courseImage);
formData.append("language", data.language);
formData.append("level", data.level);
setLoading(true);
console.log("BEFORE add course API call");
console.log("PRINTING FORMDATA", formData);
// **
const result =await addCourseDetails(formData,token);
if(result){
    dispatch(setStep(2));
    dispatch(setCourse(result));//++course ki value ko v change kr di updated value k sath
}
setLoading(false);
// **
console.log("AFTER add course API call");
console.log("PRINTING FORMDATA", formData);


  }
 
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 space-y-8 "
     
    >
    {/* course title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseName">
          Course Name <sup className="text-pink-200">*</sup>{" "}
        </label>
        <input       
          id="courseName"
          placeholder="Enter Course Name"
          {...register("courseName", { required: true })}
          className="w-full form-style"
        />
        {errors.courseName && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Name is required
          </span>
        )}
      </div>
 {/* Course Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Course Description<sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="min-h-[130px] resize-x-none form-style w-full"
        />
        {errors.courseShortDesc && <span className="ml-2 text-xs tracking-wide text-pink-200">Course Description is Reqired<sup className="text-pink-200">*</sup></span>}
      </div>
{/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="coursePrice" className="text-sm text-richblack-5">
          Course Price <sup className="text-pink-200">*</sup>{" "}
        </label>
      <div className="relative">
      <input
          id="coursePrice"
          placeholder="Enter Course Price"
          {...register("coursePrice", { required: true, valueAsNumber: true,
          pattern:{
            value:/^(0|[1-9]\d*)(\.\d+)?$/,
          }
           })}
          className="w-full form-style !pl-12"
        />
  <HiOutlineCurrencyRupee className="left-3 absolute -translate-y-1/2 top-1/2 text-richblack-400 text-2xl inline-block" />
      </div>      
        {errors.coursePrice && <span className="ml-2 text-xs tracking-wide text-pink-200">Course Price is Reqired<sup className="text-pink-200">*</sup></span>}
      </div>
{/* course category */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="courseCategory"
        className="text-sm text-richblack-5"
        >
          Course Category <sup className="text-pink-200">*</sup>{" "}
        </label>
        <select
          id="courseCategory"
          // defaultValue=""
          value={selectedCategory || ""}  // Controlled input: bind to state

          className="form-style w-full"
          {...register("courseCategory", { reuired: true })}
        >
        {/* ye by-default dikhega.[choose a category]..baki k liye api acl se lana pdega..using map */}
          <option value="" disabled>  
            Choose a Category
          </option>
          {/* else,jo backend m h..[created-by- admin] */}
          {!loading &&
            courseCategories.map((category, index) => (
              <option key={index} value={category._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && <span className="ml-2 text-xs tracking-wide text-pink-200">Course Category is Required<sup className="text-pink-200">*</sup></span>}
      </div>

     {/* Course Level */}
     <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Level <sup className="text-pink-200">*</sup>
        </label>
        <select
       
          // defaultValue=""
          id="level"
          value={selectedLevel || ""}  // Controlled input: bind to state
          className="form-style w-full"
          {...register("level", { required: true })}
        >
          <option value="" disabled>
            Choose a Level
          </option>
          {!loading &&
            ["All", "Beginner","Intermediate","Adavance"]?.map((level, indx) => (
              <option key={indx} value={level}>
                {level}
              </option>
            ))}
        </select>
        {errors.level && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Level is required
          </span>
        )}
      </div>

   {/* Course language */}
   <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="language">
          Course Language
          <sup className="text-pink-200">*</sup>
        </label>
        <select
          id="language"
      
          className="form-style w-full"
          // defaultValue=""
          value={selectedLanguage || ""}  // Controlled input: bind to state
          {...register("language", { required: true })}
        >
          <option value="" disabled>
            Choose a Language
          </option>
          {!loading &&
            ["English", "Hindi"]?.map((level, indx) => (
              <option key={indx} value={level}>
                {level}
              </option>
            ))} 
        </select>
        {errors.language && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Language is required
          </span>
        )}
      </div>

  {/* create a custom component for handling tags input */}
        <ChipInput
            label="Tags"
            name="courseTags"
            placeholder="Enter tags and press enter"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues = {getValues}
        />

         {/* create a component for uploading and showing preview of media */}
        {/* <Upload
            name=
            label=
            register={}
            errors=
            setValue={}
            /> */}
        {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />
        {/*     Benefits of the Course */}
        <div className="flex flex-col space-y-2">
            <label>Benefits of the course<sup className="text-pink-200">*</sup></label>
            <textarea
            id='coursebenefits'
            placeholder='Enter Benefits of the course'
            {...register("courseBenefits", {required:true})}
            className='min-h-[130px] resize-x-none w-full form-style'
            />
            {errors.courseBenefits && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Benefits of the course are required <sup className="text-pink-200">*</sup>
                </span>
            )}
        </div>
        <RequirementField
            name="instructions"
            label="Instructions"
            register={register}           
            errors={errors} 
            setValue={setValue}
            getValues={getValues}//ssss
            // initialRequirements={course.instructions || []}  // Pass initial requirements for pre-filling

        />
        {/* buttons */}
    <div className="flex justify-end gap-x-2">
    {
        editCourse &&(
            <button
            onClick={()=>dispatch(setStep(2))}
            className={`flex cursor-pointer py-[8px] px-[20px] font-semibold text-richblack-900 rounded-md items-center gap-x-2 bg-richblack-300`}
            >
                Continue without Saving
            </button>
        )
    }
          <IconBtn
            disabled={loading}
            text={!editCourse ? "Next" : "Save Changes"}
            >
          <MdNavigateNext />
        </IconBtn>
    </div>
    </form>
  );
};

export default CourseInformationForm;
