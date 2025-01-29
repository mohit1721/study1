import React, { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { useSelector } from "react-redux";

const RequirementField = ({
  name,
  label,
  register,
  errors,
  setValue,
  getValues 
}) => {
  const [requirement, setRequirement] = useState("");
  const reqLists=getValues(name) || []
  const [requirementList, setRequirementList] = useState(reqLists);
  const { editCourse, course } = useSelector((state) => state.course);

  // #REGISTER ON FIRST RENDER
// useEffect(()=>{
//     register(name,{
//         required:true,
//         //validate:(value)=>value.length>0
//     })
// },[register, name])
// // #value jaise -jaise change hoti rhegi[[[{requirement ki List}]]],waise -waise update v krna h--
// useEffect(()=>{
//     setValue(name,requirementList)
// },[requirementList,setValue, name]) 



// ****
 // ✅ **Edit Mode: Pre-fill `requirementList`**
 useEffect(() => {
  if (editCourse && course?.instructions) {
    setRequirementList(course.instructions); // Load existing instructions
  }
  register(name, { required: true });
}, [editCourse, course, name, register]);

// ✅ **Update Form State Whenever `requirementList` Changes**
useEffect(() => {
  setValue(name, requirementList);
}, [requirementList, setValue, name]); 



  const handleAddRequirement = () => {
    if (requirement) {
      setRequirementList([...requirementList, requirement]); //purana data +new data
    setRequirement(""); //current data ko empty kr di
    }
  };
  const handleKeyDown = (event) => {
    // Check if user presses "Enter" or ","
    if (event.key === "Enter" || event.key === "," || event.key === " ") {
      // Prevent the default behavior of the event
      event.preventDefault()
      // Get the input value and remove any leading/trailing spaces
      // const chipValue = event.target.value.trim()
      // Check if the input value exists and is not already in the chips array
      // if (chipValue && !chips.includes(chipValue)) {
      //   // Add the chip to the array and clear the input
      //   const newChips = [...chips, chipValue]
      //   setChips(newChips)
      //   event.target.value = ""
      // }
      if (requirement) {
        setRequirementList([...requirementList, requirement]); //purana data +new data
      setRequirement(""); //current data ko empty kr di
      }
    }
  }
  const handleRemoveRequirement = (index) => {
    const updatedRequirementList = [...requirementList];
    updatedRequirementList.splice(index, 1);
    setRequirementList(updatedRequirementList);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name} className='text-sm text-richblack-5'>
        {label}
        <sup className="text-pink-200">*</sup>{" "}
      </label>
      <div>
        <input
          type="text"
          id={name}
          value={requirement}
          onKeyDown={handleKeyDown}
          onChange={(e) => setRequirement(e.target.value)}
          className="w-full form-style"
        />
        <button
          type="button"
          onClick={handleAddRequirement}

          className="font-semibold text-yellow-50"
        >
          Add
        </button>
      </div>
      {/* show the req. list  */}
      {requirementList.length > 0 && (
        <ul className="mt-2 list-inside list-disc">
          {requirementList.map((requirement, index) =>  (
            <li key={index} className="flex items-center gap-x-4 text-richblack-5">
              <span>{requirement}</span>
              <button
                type="button"
                onClick={() => handleRemoveRequirement(index)}
                className="text-xs text-pure-greys-300"
              >
                clear
              </button>
            </li>
          )
          )}
        </ul>
      )}
      {errors[name] && (<span className="ml-2 text-xs tracking-wide text-pink-200">{label} is required</span>)}
    </div>
  );
};

export default RequirementField;
// #REGISTER ON FIRST RENDER