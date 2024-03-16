import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxDropdownMenu } from "react-icons/rx";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiDownArrow } from "react-icons/bi";

import { AiOutlinePlus } from "react-icons/ai";
import SubSectionModal from "./SubSectionModal";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import { setCourse } from "../../../../../slices/courseSlice";
import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
const NestedView = ({ handleChangeEditSectionName }) => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  //  States to keep track of mode of modal [add, view, edit]
  const [addSubSection, setAddSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null); //3 variables
  const [editSubSection, setEditSubSection] = useState(null);
   // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null);

  useEffect(() => {
    // console.log("Rendering it again");
  });

  const handleDeleteSection = async (sectionId) => { //interact with DB
    const result = await deleteSection(
      {
        sectionId,
        courseId: course._id,
        // token
        },
        token
        
        )
    //course m krne se phle
    if (result) {
      // updating course
      dispatch(setCourse(result)) //DHYAN++->PHLE SECTION K DATA 
    }
    setConfirmationModal(null)
  }

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId, token });
    // result-->updated section
    if (result) {
      //if valid result...course update
      // TODO: extra ..**must-->UPDATED SECTION SE COURSE UPDATE,then set**
// section ka data se course ka data m convert,then set
// yehaan course,slice ka data h
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      ); //else,purane wale [section] use
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      // purane wala use + updated wala use
      dispatch(setCourse(updatedCourse));
    }
    setConfirmationModal(null); //close modal
  };

  return (
<div>
<div className="rounded-lg bg-richblack-700 p-6 px-8">
{/* section+subsectio\m */}
{course?.courseContent?.map((section) => (
  <details key={section._id} open> 
  {/* by-default open krke rkha ek section ko */}
  {/* section -->in details tag ,so that,show/hide kr pau,collapse krke*/}
    <summary className="flex items-center justify-between gap-x-3 border-b-2">
      <div className="flex items-center gap-x-3">
        <RxDropdownMenu />
        <p>{section.sectionName} </p>
      </div>
      <div className="flex items-center gap-x-3 ">
        <button
          onClick={() =>
            handleChangeEditSectionName(
              section._id,
              section.sectionName
            )
          }
        >
          <MdEdit />
        </button>

    <button
      onClick={() => {
        setConfirmationModal({
          text1: "Delete this Section",
          text2: "All the lectures in this section will be deleted",
          btn1Text: "Delete",
          btn2Text: "Cancel",
          btn1Handler: () =>  handleDeleteSection(section._id),
          btn2Handler: () => setConfirmationModal(null),
        });
      }}
    >
      <RiDeleteBin6Line />
    </button>

        <span>|</span>
        <BiDownArrow className="text-xl text-richblack-300 " />
      </div>
    </summary>
    {/* sub sections */}
    <div className="px-6 pb-4">
      {section?.subSection?.map((data) => (
        <div
          key={data?._id}
          onClick={() => setViewSubSection(data)}  //ye hmesa ho rha tha kisi pr v click krne se-->so to prevent-->need to stop propagation
          className="flex items-center justify-between gap-x-3 border-b-2"
        >
{/* DropDown button */}
          <div 
          className="flex items-center gap-x-3">
            <RxDropdownMenu />
            <p>{data.title}</p>
          </div>
  {/* Edit and delete Button */}
            <div 
            //need to stop propagation->when edit/delete button click--->nhi to view wala section hmesa apply nhi hoga 
            onClick={(e) => e.stopPropagation()} //jisko click sirf wohi khulega...
            className="flex items-center gap-x-3">
            {/* edit btn */}
            <button
              onClick={() =>
                setEditSubSection({ ...data, sectionId: section._id })
              }
            >
              <MdEdit />
            </button>
                {/* for delete  */}
            <button
              onClick={() =>
                setConfirmationModal({
                  text1: "Delete this Sub Section",
                  text2: "selected Lecture will be deleted",
                  btn1Text: "Delete",
                  btn2Text: "Cancel",
                  btn1Handler: () =>
                    handleDeleteSubSection(data._id, section._id),
                  btn2Handler: () => setConfirmationModal(null),
                })
              }
            >
              <RiDeleteBin6Line />
            </button>
          </div>

        </div>
      )
      
      )}
      {/* new lecture add */}
      <button
        className="mt-4 flex items-center gap-x-2 text-yellow-50"
        onClick={() => setAddSubSection(section._id)}
      >
        <AiOutlinePlus />
        <p>Add Lecture</p>
      </button>
    </div>
  </details>
)        
)}
</div>

{
//agar add k andar kuch data h to modal show...else view sub section wala,agar iske andar data marked h to fir se sub section wala modal show ...else edit wala check...agar uska h to uska modal ..else div
addSubSection ? (
  <SubSectionModal
    modalData={addSubSection}
    setModalData={setAddSubSection}
    add={true}  //hmesa ye modal nhi show krna h..jab true hoga 
  />
) : viewSubSection ? (
  <SubSectionModal
    modalData={viewSubSection}
    setModalData={setViewSubSection}
    view={true}
  />
) : editSubSection ? (
  <SubSectionModal
    modalData={editSubSection}
    setModalData={setEditSubSection}
    edit={true}
  />
) : (
  <div></div>
)
}
{/* agar data h confirmationModal variable m to render confirmation modal component ,with send all the data as props*/}
{confirmationModal ? (
<ConfirmationModal modalData={confirmationModal} />
) : (
<div></div>
)}
</div>
  );
};

export default NestedView;
