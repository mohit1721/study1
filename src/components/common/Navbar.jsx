import React, { useRef } from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, NavLink, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import ProfileDropDown from "../core/Auth/ProfileDropDown";
// import { FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { categories } from "../../services/apis";
import { apiConnector } from "../../services/apiconnector";
import { BsChevronDown } from "react-icons/bs"
import { ACCOUNT_TYPE } from "../../utils/constants"
import NavbarMobile from "./NavbarMobile";
// import { isObject } from "chart.js/dist/helpers/helpers.core";
import useOnClickOutside from "../../hooks/useOnClickOutside";
 
const Navbar = () => {
  // useSelector ka use krke sb fetch krke lao
  const { token } = useSelector((state) => state.auth); //destructuring..FROM AUTH wali state/slice...token auth m h
  const { user } =  useSelector((state) => state.profile) // undefined;
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation(); //for matchroute fxn

  const [loading, setLoading]=useState(false);
  const [subLinks, setSubLinks] = useState([]);

  const fetchSublinks = async () => {
   (
    async ()=>{
      setLoading(true);
      try {
        const result = await apiConnector("GET", categories.CATEGORIES_API); //api/backend se call 
        console.log("Printing Sublinks result:", result);
        if(result)
        {
          setSubLinks(result.data.data);
        }
      } catch (error) {
        console.log("Could not fetch the category list");
      }
      setLoading(false);
    })()
  };

  useEffect(() => {
    fetchSublinks();
  }, []);


  // useEffect(() => {
  //   (async () => {
  //     setLoading(true)
  //     try {
  //       const res = await apiConnector("GET", categories.CATEGORIES_API)
  //       setSubLinks(res.data.data)
  //     } catch (error) {
  //       console.log("Could not fetch Categories.", error)
  //     }
  //     setLoading(false)
  //   })()
  // }, [])


  const matchRoute = (route) => {
    // eslint-disable-next-line no-undef
    return matchPath({ path: route }, location.pathname); //route jo inpue m aa rha..aur current [[location.patname]] ko match kr rhe
  };
  // Mobile Navbar
  const [isOpen,setIsOpen]=useState(false);
  const ref=useRef(null);

  useOnClickOutside(ref,()=>setIsOpen(false));

  return (
    <div className={`backdrop-blur-lg bg-white/20 shadow-md z-50 flex w-full h-14 items-center justify-center border-b-[1px] border-b-richblack-700
    ${location.pathname !=="/" ? "bg-richblack-800":"bg-[#000c23]" } transition-all duration-200
  
  
    ${
        location.pathname.split("/").includes("dashboard") ||
        location.pathname.split("/").includes("view-course")
          ? // location.pathname.split("/").includes("courses")
            ""
          : "fixed top-0 w-screen z-20"
      }
      
    `}
    >   
  <div className="flex top-2 w-11/12 max-w-maxContent md:items-center justify-between  md:flex-row flex-row-reverse mx-auto">


    {/* Image +search bar-*/}
    <div className={`flex md:justify-start items-center gap-2`}>
    <Link to="/">
      <img src={logo} width={160} height={42} alt="logo" loading="lazy" />
    </Link>
    </div>      
            {/* Desktop Navbar */}
    {/* Navlinks */}
<nav className="md:block hidden">
<ul className="flex gap-x-6 text-richblack-25 hover:cursor-pointer">
  {
    NavbarLinks.map((link, index) => (
    <li key={index}>
      {link.title === "Catalog" ? (  
        <div className={`group relative flex cursor-pointer items-center
        gap-1 text-richblack-25
        ${
              matchRoute("/catalog/:catalogName")
                ? "text-yellow-25"
                : "text-richblack-100"
            }`
            }     ///group->for hovering on div
        > 
          <p>{link.title}</p>
          <BsChevronDown />
          <div
          className="invisible absolute left-[50%] top-[50%] z-[1000] flex flex-col w-[200px] translate-x-[-50%] translate-y-[3em]
          rounded-md bg-richblack-5
          p-4 text-richblack-900 transition-all duration-150
          opacity-0 group-hover:translate-y-[1.65em]
          group-hover:visible
          group-hover:opacity-100
          lg:w-[300px]
           select-none
          ">
          {/* // big rectangle */}
        <div
            className="absolute left-[50%] top-0
          translate-y-[-40%] translate-x-[80%] rotate-45
          -z-10 select-none
            h-6 w-6 rounded bg-richblack-5"></div>
              {/*now, sublinks ka data add */}
              {loading?(<p className="text-center">Loading...</p>):subLinks?.length ? ( //non-empty
             <>
              {
                subLinks?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                ?.map((subLink, index) => (
              <Link to={`/catalog/${subLink.name
                .split(" ")
                .join("-")
               .toLowerCase()            
              }`}
               key={index}
              className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
              >
                <p className="">{subLink.name} </p>
              </Link>
            ))
              }
             </>
          ) : (
            <div className="text-center">No Courses Found</div>
          )
          }
          </div>          
        </div>
      ) : (
        <NavLink to={link?.path}>
          {/*link attached -->  */}
          <p
            className={`${//matchroue-->is fxn
              matchRoute(link?.path) //agar clicked h to yellow..if ->>path[Home ka] ===current url[location.pathname]
                ? "text-yellow-25"
                : "text-richblack-100"
            }`}
          >
            {link.title}
          </p>
        </NavLink>
      )}
    </li>
  ))}

</ul>
</nav>
  {/* login/signup/dashboard */}
<div className="lg:flex gap-x-4 items-center hidden">
{user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
<Link to="/dashboard/cart" className="relative ">
  <AiOutlineShoppingCart className="text-2xl text-richblack-200"/>
  {totalItems > 0 && (<span className="absolute -top-1 -right-2 grid h-5 w-5 
   animate-bounce rounded-full bg-yellow-800
  place-items-center overflow-hidden text-center text-xs font-bold text-yellow-100 ">{totalItems}{" "}</span>)}
</Link>
)}
{/* show login btn */}
{token === null && (
<Link to="/login">
  <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
    Log in
  </button>
</Link>
)}
{token === null && (
<Link to="/signup">
  <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
    Sign Up
  </button>
</Link>
)}
{/* user h to profile */}
{token !== null && <ProfileDropDown />} 
</div>
        {/* Mobile Nvbar */}
<nav className="mr-4 inline-block lg:hidden">
<NavbarMobile 
loading={loading}
subLinks={subLinks}
matchRoute={matchRoute}
isOpen={isOpen}
setIsOpen={setIsOpen}
  />
</nav>

  </div>
    </div>
  );
};
export default Navbar;






// import { useEffect,useRef, useState } from "react"
// import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
// import { BsChevronDown } from "react-icons/bs"
// import { useSelector } from "react-redux"
// import { Link, matchPath, useLocation } from "react-router-dom"

// import logo from "../../assets/Logo/Logo-Full-Light.png"
// import { NavbarLinks } from "../../data/navbar-links"
// import { apiConnector } from "../../services/apiconnector"
// import { categories } from "../../services/apis"
// import { ACCOUNT_TYPE } from "../../utils/constants"
// import ProfileDropDown from "../core/Auth/ProfileDropDown"

// // const subLinks = [
// //   {
// //     title: "Python",
// //     link: "/catalog/python",
// //   },
// //   {
// //     title: "javascript",
// //     link: "/catalog/javascript",
// //   },
// //   {
// //     title: "web-development",
// //     link: "/catalog/web-development",
// //   },
// //   {
// //     title: "Android Development",
// //     link: "/catalog/Android Development",
// //   },
// // ];

// function Navbar() {
//   const { token } = useSelector((state) => state.auth)
//   const { user } = useSelector((state) => state.profile)
//   const { totalItems } = useSelector((state) => state.cart)
//   const location = useLocation()

//   const [subLinks, setSubLinks] = useState([])
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     (async () => {
//       setLoading(true)
//       try {
//         const res = await apiConnector("GET", categories.CATEGORIES_API)
//         setSubLinks(res.data.data)
//       } catch (error) {
//         console.log("Could not fetch Categories.", error)
//       }
//       setLoading(false)
//     })();
//   }, [])

//   // console.log("sub links", subLinks)

//   const matchRoute = (route) => {
//     return matchPath({ path: route }, location.pathname)
//   }

//   return (
//     <div
//       className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
//         location.pathname !== "/" ? "bg-richblack-800" : ""
//       } transition-all duration-200`}
//     >
//       <div className="flex w-11/12 max-w-maxContent items-center justify-between">
//         {/* Logo */}
//         <Link to="/">
//           <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
//         </Link>
//         {/* Navigation links */}
//         <nav className="hidden md:block">
//           <ul className="flex gap-x-6 text-richblack-25">
//             {NavbarLinks.map((link, index) => (
//               <li key={index}>
//                 {link.title === "Catalog" ? (
//                   <>
//                     <div
//                       className={`group relative flex cursor-pointer items-center gap-1 ${
//                         matchRoute("/catalog/:catalogName")
//                           ? "text-yellow-25"
//                           : "text-richblack-25"
//                       }`}
//                     >
//                       <p>{link.title}</p>
//                       <BsChevronDown />
//                       <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150
//          group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
//                         <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
//                         {loading ? (
//                           <p className="text-center">Loading...</p>
//                         ) : subLinks?.length ? (
//                           <>
//                             {subLinks
//                               ?.filter(
//                                 (subLink) => subLink?.courses?.length > 0
//                               )
//                               ?.map((subLink, i) => (
//                                 <Link
//                                   to={`/catalog/${subLink.name
//                                     .split(" ")
//                                     .join("-")
//                                     .toLowerCase()}`}
//                                   className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
//                                   key={i}
//                                 >
//                                   <p>{subLink.name}</p>
//                                 </Link>
//                               ))
// }
//                           </>
//                         ) : (
//                           <p className="text-center">No Courses Found</p>
//                         )}
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   <Link to={link?.path}>
//                     <p
//                       className={`${
//                         matchRoute(link?.path)
//                           ? "text-yellow-25"
//                           : "text-richblack-25"
//                       }`}
//                     >
//                       {link.title}
//                     </p>
//                   </Link>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </nav>
//         {/* Login / Signup / Dashboard */}
//         <div className="hidden items-center gap-x-4 md:flex">
//           {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
//             <Link to="/dashboard/cart" className="relative">
//               <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
//               {totalItems > 0 && (
//                 <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
//                   {totalItems}
//                 </span>
//               )}
//             </Link>
//           )}
//           {token === null && (
//             <Link to="/login">
//               <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
//                 Log in
//               </button>
//             </Link>
//           )}
//           {token === null && (
//             <Link to="/signup">
//               <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
//                 Sign up
//               </button>
//             </Link>
//           )}
//           {token !== null && <ProfileDropDown />}
//         </div>
        // <button className="mr-4 md:hidden">
        //   <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        // </button>
//       </div>
//     </div>
//   )
// }

// export default Navbar;
