import React from 'react'
import * as Icons from 'react-icons/vsc'
// import { LiaShoppingCartSolid } from "react-icons/lia";
import { useDispatch } from 'react-redux';
import { NavLink, matchPath, useLocation } from 'react-router-dom';
// import { resetCourseState } from "../../../slices/courseSlice"
// sirf ek tag on sidebar
export const SidebarLink= ({link,iconName}) => {
    const Icon=Icons[iconName];
    const location =useLocation();//jispe click wo highlight..
    // const dispatch=useDispatch(); //
    const matchRoute=(route)=>{ //jahaan v tab hoga...jis tab p hu usko active dikhana h..hmesa matchRoute
        return matchPath({path:route},location.pathname)//= removed
    }
  return ( //ek tab...
    <NavLink 
    to={link.path}
    className={`relative px-8 py-2 text-sm font-medium ${matchRoute(link.path) ?"bg-yellow-800":"bg-opacity-0" }`}
     > 
     {/* left-border--    // jb clicked to tbhi show krne k liye matchRoute*/}
    <span className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50
    ${matchRoute(link.path)?"opacity-100":"opacity-0"}`}
     ></span>
     <div className='flex items-center gap-x-2'>
     {/* Icon Goes Here */}
      <Icon className="text-lg" />
      <span>{link.name}</span>
     </div>
    </NavLink>
  )
}
