import React, { useState } from "react";
import { sidebarLinks } from "../../../data/dashboard-links";
import { logout } from "../../../services/operations/authAPI";

import { useDispatch, useSelector } from "react-redux";
import { SidebarLink } from "./SidebarLink";
import { useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import ConfirmationModal from "../../common/ConfirmationModal";

const Sidebar = () => {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const { loading: authLoading } = useSelector((state) => state.auth);
const dispatch= useDispatch();
const navigate=useNavigate();
const[confirmationModal,setConfirmationModal]=useState(null) //to track ConfirmationModal ,isko dikhau ya hatau

  if (profileLoading || authLoading) {
    return <div className="mt-10">Loading...</div>;
  }

  return (
    <div className='hidden lg:flex text-white h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10'>
    <div className=''>

        <div className='flex flex-col'>
            {
                sidebarLinks.map((link,index) => {
                    if(link.type && user?.accountType !== link.type) return null;
                   
                    return (
                        <SidebarLink key={link.id}  link={link} iconName={link.icon}/>
                    )
                })}
        </div>
              {/* Horizontal line */}
        <div className='mx-auto mt-6 mb-6 h-[1px] w-11/12 bg-richblack-700'></div>

        <div className='flex flex-col'>
                <SidebarLink 
                    link={{name:"Settings", path:"dashboard/settings"}}
                    iconName="VscSettingsGear"
                />

                <button 
                    onClick={ () => {setConfirmationModal({
                        text1: "Are You Sure ?",
                        text2: "You will be logged out of your Account",
                        btn1Text: "Logout",
                        btn1Handler: () => dispatch(logout(navigate)),
                        btn2Text:"Cancel",          
                        btn2Handler: () => setConfirmationModal(null), //invisible kr diya
                    })}}
                    className='text-sm px-8 py-2 font-medium text-richblack-300'
                    >

                    <div className='flex mx-auto items-center gap-x-2'>
                        <VscSignOut className='text-lg'/>
                        <span>Logout</span>
                    </div>

                </button>

        </div>

    </div>
{/*  add modal---->hmesa last m include krte h*/}
{confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
</div>

  );
};
export default Sidebar;
