import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {LiaEdit} from "react-icons/lia"
import IconBtn from "../../common/IconBtn";
// import {formattedDate} from "../../../utils/dateFormatter"
const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  return (
    <>
      <h1 className="text-richblack-5 font-medium mb-14 text-3xl">My Profile</h1>

      {/* section 1 */}
      <div className="text-white flex items-center gap-x-4 rounded-md justify-between border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 ">
      <div className=" flex items-center gap-x-4 ">
      <img src={user?.image}
          className="aspect-square w-[78px] rounded-full object-cover "
          alt={`profile-${user?.firstName}`}
      />
      <div className=" space-y-1 sm:flex-col text-sm ">
          <p className="md:text-lg font-semibold text-richblack-5">{user?.firstName + " " + user.lastName } </p>
          <p className="text-xs md:text-sm text-richblack-5">{user?.email} </p>
      </div>
      </div>
      <IconBtn
      text="Edit"
      className="flex "
      onclick={()=>{
      navigate("/dashboard/settings")
      }}>
      <LiaEdit/>

      </IconBtn>


      </div>

      {/* section 2 */}
      <div className="text-richblack-5 p-8 px-12 rounded-md flex flex-col my-10 gap-y-10 border-[1px] border-richblack-700 bg-richblack-800 ">
      <div className=" flex w-full items-center justify-between">
      <p className="text-lg font-semibold text-richblack-5">About</p>
      <IconBtn
      text='Edit'
      onclick={()=>{
      navigate("/dashboard/settings")
      }}
      >
           <LiaEdit/>
          </IconBtn>
      </div>
      <p
      className={`${user?.additionalDetails?.about? "text-richblack-5" : "text-richblack-400"}`}
      >
      {user?.additionalDetails?.about ?? "Write Something About Yourself"}
      </p>
      </div>
      {/* section 3
      */}
      <div className="text-richblack-5 p-8 px-12 rounded-md flex flex-col my-10 gap-y-10 border-[1px] border-richblack-700 bg-richblack-800 ">
      <div className=" flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">Personal Details</p>

          <IconBtn
          text="Edit"
          onclick={() => {
              navigate("/dashboard/settings")
          }} 
             
          >
           <LiaEdit/>
          </IconBtn>
         
      </div>

<div>
<div className="flex flex-col md:flex-row gap-y-5 md:gap-x-20 ">
       
<div>
<div>
              <p className="text-richblack-600 text-sm mb-2">First Name</p>
              <p className="text-sm font-medium text-richblack-5">{user?.firstName}</p>
          </div>
         
          <div>
              <p className="text-richblack-600 text-sm mb-2">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">{user?.lastName}</p>
          </div>

          <div>
              <p className="text-richblack-600 text-sm mb-2">Gender</p>
              <p className="text-sm font-medium text-richblack-5">{user?.additionalDetails?.gender ?? "Add Gender"}</p>
          </div>

</div>

<div>
    
<div>
              <p className="text-richblack-600 text-sm mb-2">Email</p>
              <p className="text-sm font-medium text-richblack-5">{user?.email}</p>
          </div>
          <div>
              <p className="text-richblack-600 text-sm mb-2">Phone Number</p>
              <p className="text-sm font-medium text-richblack-5">{user?.additionalDetails?.contactNumber ?? "Add Contact Number"}</p>
          </div>
          <div>
              <p className="text-richblack-600 text-sm mb-2">Date of Birth</p>
              <p className="text-sm font-medium text-richblack-5">{(user?.additionalDetails?.dateOfBirth ) ?? "Add Date of Birth"}</p>
          </div>
</div>


      </div>
</div>


      </div>




    </>
  );
};
export default MyProfile;
