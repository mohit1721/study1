import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "../../../../../slices/courseSlice";
import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
// import Upload from '../Upload';
import { RxCross1 } from "react-icons/rx";
import IconBtn from "../../../../common/IconBtn";
import Upload from "../Upload";

const SubSectionModal = ({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  // set value
  useEffect(() => {
    if (view || edit) {
      //only jb course created
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, []);
  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      //means form updated
      return true;
    } else {
      return false;
    }
  };
  const handleEditSubSection = async () => {
    const currentValues = getValues();
    const formData = new FormData();
    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);
    if (currentValues.lectureTitle !== modalData) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc);
    }

    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo);
    }
    setLoading(true);
    // API Call
    const result = await updateSubSection(formData, token);
    if (result) {
      //TODO: some must* to render on ui
      const updatedCourseContent = course.courseContent.map((section) =>
      section._id === modalData.sectionId ? result : section
    );  //sectionId modalData hi h
    const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
  };

  const onSubmit = async (data) => {
    if (view)
      //nothing to do
     {
       return;
      }
    if (edit) {
      //edit krne aaya aur form update hi nhu hua..no scene
      if (!isFormUpdated) {
        toast.error("NO Changes made to the form");
      } else {
        //edit kro
        handleEditSubSection(); //data prepare ,jo form k data ko collect kr rha h,uss data ko API Call krke verify krke,next step go 
      }
      return;
    }
    //normal case

    // ADD
    // data collect in formData object-->API Call-->Update/create--->next Step
    // course create--verify--next step

    const formData = new FormData();
    formData.append("sectionId", modalData); //modalData k andar sectionId hi h...to sirf use append ki
    formData.append("title", data.lectureTitle);//aur,baaki ye form se aaya
    formData.append("description", data.lectureDesc);//aur,pta kaise chlega kya kya send krni h...-->so, SEE THE CONTROLLER,ki wo kon kon si data fetch krke kaam kr rha h
    formData.append("video", data.lectureVideo);//you can send xtra values,but can't send less values
    setLoading(true);
    // API CALL
    const result = await createSubSection(formData, token);
    if (result) {
      // TODO  :check for updation.....[modalData se hi sectionId mil rha isme..to usi ko use kr rhe]
      const updatedCourseContent = course.courseContent.map((section) =>
      section._id === modalData ? result : section
    );
    const updatedCourse = { ...course, courseContent: updatedCourseContent };   
      
      dispatch(setCourse(updatedCourse));
    }
    //close modal
    setModalData(null);
    setLoading(false);
  };
  
  // const onSubmit = async (data) => {
  //   if (view) {
  //     return;
  //   }

  //   if (edit) {
  //     if (isFormUpdated) {
  //       toast.error("No changes made to the form");
  //     } else {
  //       // edit kardo
  //       handleEditSubSection();
  //     }

  //     return;
  //   }

  //   // Add
  //   const formData = new FormData();
  //   formData.append("sectionId", modalData);
  //   formData.append("title", data.lectureTitle);
  //   formData.append("description", data.lectureDesc);
  //   formData.append("video", data.lectureVideo);

  //   setLoading(true);

  //   //API Call
  //   const result = await createSubSection(
  //     formData,
  //     token,
  //   );

  //   if (result) {
  //     // TODO: check for updation
  //     const updatedCourseContent = course.courseContent.map((section)=>
  //     section._id === modalData ? result : section)

  //     const updatedCourse = {...course, courseContent:updatedCourseContent};
  //     dispatch(setCourse(updatedCourse))
  //   }

  //   setModalData(null);
  //   setLoading(false);
  // };  
  
  
  return (
<div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm ">
<div className=" my-10 w-11/12 max-w-[700px] rounded-lg bg-richblack-800 border-richblack-400  ">
{/* header */}
<div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5 ">
<p className="text-xl font-semibold text-richblack-5">
{" "}
{view && "Viewing"}
{add && "Adding"} {edit && "Editing"} Lecture{" "}
</p>
<button onClick={() => (!loading ? setModalData(null) : {})}>
<RxCross1 className="text-2xl text-richblack-5" />
</button>
</div>

<form onSubmit={handleSubmit(onSubmit)}
className="space-y-8 px-8 py-10"
>
<Upload
name="lectureVideo"
label="Lecture Video"
register={register }
setValue={setValue}
errors={errors}
video={true}
viewData={view ? modalData.videoUrl : null}
editData={edit ? modalData.videoUrl : null}
/>

{/* Title */}
<div className="flex flex-col space-y-2">
<label htmlFor="lectureTitle" className="text-sm text-richblack-5">Lecture Title<sup className="text-pink-200">*</sup></label>
<input 
id='lectureTitle'
placeholder='Enter Lecture Title'
{...register("lectureTitle", {required:true})}
className='w-full form-style'
/>
{errors.lectureTitle && (<span className="ml-2 text-xs tracking-wide text-pink-200">
Lecture Title is required
</span>)}
</div>

{/* Description */}
<div className="flex flex-col space-y-2">
<label htmlFor="lectureDesc" className="text-sm text-richblack-5">Lecture Description<sup className="text-pink-200">*</sup></label>
<textarea 
id='lectureDesc'
placeholder='Enter Lecture Description'
{...register("lectureDesc", {required:true})}
className='w-full form-style min-h-[130px]'
/>
{
errors.lectureDesc && (<span className="ml-2 text-xs tracking-wide text-pink-200">
Lecture Description is required
</span>)
}
</div>

{/* save Button */}
{
!view && (
<div className="flex justify-end">
<IconBtn 
text={loading ? "Loading...": edit ? "Save Changes" : "Save"}
/>
</div>
)
}

</form>
</div>


</div>
  );
};

export default SubSectionModal;


