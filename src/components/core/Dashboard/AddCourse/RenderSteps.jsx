import React from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm";
import CourseInformationForm from "./CourseInformationForm/CourseInformationForm";
import PublishCourse from "./PublishCourse/index";
const RenderSteps = () => {
  const { step } = useSelector((state) => state.course);

  const steps = [
    {
      id: 1,
      title: "Course Information",
    },
    {
      id: 2,
      title: "Course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ];
  return (
    <>
     {/* Progress Bar */}
      <div className="relative mb-2 flex w-full justify-center">
        { steps.length >0 && steps.map((item,index) => {
       return ( <>        
        <React.Fragment key={item.id}>
          {/* Circle and Number */}
          <div className={`flex flex-col items-center`}>
            <button
              className={`grid cursor-default aspect-square w-[34px] h-[34px] place-items-center rounded-full border-[1px] ${
                step === item.id
                  ? 'bg-yellow-900 border-yellow-50 text-yellow-50'
                  : 'border-richblack-700 bg-richblack-800 text-richblack-300'
              } transition-all duration-2 ${step > item.id
                  ? 'bg-yellow-50 text-yellow-900'
                  : ''}`}
            >
              {step > item.id ? <FaCheck /> : item.id}
            </button>
          </div>

          {/* dotted line / dashes between the label */}
          {item.id !== steps.length && (
              <>
                <div
                  className={`h-[calc(34px/2)] w-[33%]  border-dashed border-b-2 ${
                  step > item.id  ? "border-yellow-50" : "border-richblack-500"
                } `}
                ></div>
              </>
            )}
        </React.Fragment>
          </>
          )
        }
        
        )}
      </div>
{/* titles */}
      <div className="flex relative mb-16 justify-between select-none w-full ">
        {steps.map((item,index) => {
        return ( <>
            <div key={index} className="flex min-w-[90px] lg:min-w-[115px] flex-col items-center gap-y-2 ">
              <p className="text-sm text-richblack-5">{item.title} </p>
            </div>
          </>)
        }
        
        )
        }
      </div>

      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />}
    </>
  );
};

export default RenderSteps;
