import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Dashboard/Sidebar";
const Dashboard = () => {
  //authLoading,profileLoading->is just naming 
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);

  if (profileLoading || authLoading) {
    return ( 
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
    <div className="spinner"></div>
  </div>);
  }

  return (
    <div className=" flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <div className="h-[calc(100vh-3.5rem)] overflow-auto w-full ">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;

// OUTLET-[a component]--->jb nhi pta hota h tb use krte h-->
// my-profile,cart,enrolled courses