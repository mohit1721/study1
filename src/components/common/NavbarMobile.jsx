import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { sidebarLinks } from "../../data/dashboard-links";
import { AiOutlineDownCircle, AiOutlineShoppingCart } from "react-icons/ai";
import { AiOutlineRight } from "react-icons/ai";
import { VscSignOut } from "react-icons/vsc";
import { logout } from "../../services/operations/authAPI";
import ConfirmationModal from "./ConfirmationModal";
// import {Sidebar} from "../core/Dashboard/Sidebar ";
import { ACCOUNT_TYPE } from "../../utils/constants";
// import SidebarLink from "../core/Dashboard/SidebarLink";

import {SidebarLink} from "../core/Dashboard/SidebarLink";
// import Skeleton from "react-loading-skeleton";

const NavbarMobile = ({ loading, subLinks, matchRoute, isOpen, setIsOpen }) => {
  // For Mobile navbar

  const [confirmationModal, setConfirmationModal] = useState(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleCatalogClick = () => {
    setIsCatalogOpen(!isCatalogOpen);
  };

  const handleDashboardClick = () => {
    setIsDashboardOpen(!isDashboardOpen);
  };

  // height animation Dashboard
  const contentEl = useRef(null);
  const [sectionHeight, setSectionHeight] = useState(0);
  useEffect(() => {
    setSectionHeight(isDashboardOpen ? contentEl.current.scrollHeight : 0);
  }, [isDashboardOpen]);

  // height animation Catalog
  const contentElCatalog = useRef(null);
  const [sectionCatalogHeight, setSectionCatalogHeight] = useState(0);
  useEffect(() => {
    setSectionCatalogHeight(
      isCatalogOpen ? contentElCatalog.current.scrollHeight : 0
    );
  }, [isCatalogOpen]);

  return (
    <>
      <button
        className="flex-col justify-center items-center relative z-500"
        onClick={handleClick}
      >
        <span
          className={`bg-richblack-5 block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out
         ${isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`}
        ></span>

        <span
          className={`bg-richblack-5 block h-0.5 w-6 rounded-sm my-0.5 transition-all duration-100 ease-out 
        ${isOpen ? "opacity-0" : "opacity-100"}`}
        ></span>

        <span
          className={`bg-richblack-5 block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out
         ${isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`}
        ></span>

        {totalItems > 0 && (
          <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
            {totalItems}
          </span>
        )}
      </button>

      {/* Links */}
      <div
        className={`fixed top-14 left-0 ${
          isOpen ? "w-[30vh]" : "w-0"
        } h-screen ${
          location.pathname !== "/" ? "bg-richblack-800" : "bg-[#000c23]"
        } z-[100] flex justify-start items-center transition-all duration-[1s] flex-col overflow-hidden`}
      >
        <div
          className={`${
            isOpen
              ? "opacity-100 duration-[4.5s] "
              : "opacity-0 duration-[0.45s] "
          } w-full transition-all overflow-hidden`}
        >
          {/* *********************************Login and Profile Icon ****************************************/}
          <div
            className="w-full flex gap-4 items-center flex-col justify-center mt-5"
            onClick={handleClick}
           >
            {token === null && (
              <Link to="/login">
                <button className="border border-richblack-700 bg-richblack-800 px-10 py-[8px] rounded-md text-richblack-5">
                  Login
                </button>
              </Link>
            )}
            {token === null && (
              <Link to="/signup">
                <button className="border border-richblack-700 bg-richblack-800 px-10 py-[8px] rounded-md text-richblack-5">
                  {/* need to change text color */}
                  Sign Up
                </button>
              </Link>
            )}
            {token !== null && (
              <Link
                className="w-full flex flex-row gap-2 items-center justify-center"
                to={"dashboard/my-profile"}
              >
                <img
                  src={user?.image}
                  alt={`profile-${user?.firstName}`}
                  className="aspect-square w-[50px] rounded-full object-cover"
                />
                <div className="flex gap-3 items-center">
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-richblack-5 hover:underline hover:text-caribbeangreen-300">
                      {user?.firstName + " " + user?.lastName}
                    </p>

                    <p className="text-xs text-richblack-300">Welcome back</p>
                  </div>
                  <AiOutlineRight className="text-lg font-bold text-richblack-5" />
                </div>
              </Link>
            )}
            {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
              <Link
                to="/dashboard/cart"
                className="relative flex items-center text-richblack-5 gap-3 self-start ml-10"
              >
                <AiOutlineShoppingCart className="text-2xl text-richblack-100" />{" "}
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 left-3 grid h-4 w-4 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            {token !== null && (
              <div
                onClick={() => {
                  dispatch(logout(navigate));
                }}
                className="flex items-center text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 gap-3 self-start ml-10 font-bold"
              >
                <VscSignOut className="text-2xl" />
                Logout
              </div>
            )}
          </div>
          <div className="w-full h-[1.5px] bg-white my-5"></div>

          {/* *********************************Dashboard ****************************************/}

          {location.pathname.split("/").includes("dashboard") && (
            <>
              <div className="overflow-hidden">
                <button
                  className="flex gap-2 items-center"
                  onClick={handleDashboardClick}
                >
                  <p className="text-lg text-richblack-5 font-bold mx-3 my-2">
                    Dashboard
                  </p>
                  <AiOutlineDownCircle
                    className={`${
                      isDashboardOpen ? "rotate-180" : "rotate-0"
                    } text-lg font-bold text-richblack-5 transition-all duration-1000`}
                  />
                </button>

                {/* Condition */}

                <div
                  className="h-0 transition-[height] duration-1000"
                  ref={contentEl}
                  style={{
                    height: sectionHeight,
                  }}
                  onClick={handleClick}
                >
                  {/* first 3 links */}
                  <div className="flex flex-col text-richblack-50">
                    {sidebarLinks.map((link, index) => {
                      if (link.type && user?.accountType !== link.type)
                        return null;
                      return (
                        <SidebarLink
                          key={link.id}
                          link={link}
                          iconName={link.icon}
                        />
                      );
                    })}
                  </div>

                  {/* horizontal line */}
                  <div className="mx-auto my-2 h-[1px] w-full bg-richblack-700"></div>

                  {/* Setting and logout */}
                  <div className="flex flex-col text-richblack-50">
                    {/*Seettings */}
                    <SidebarLink

                      link={{
                        name: "Settings",
                        path: "/dashboard/settings",
                      }}
                      iconName="VscSettingsGear"
                    />
                    {/* Logout */}
                    <button
                      onClick={() => {
                        setConfirmationModal({
                          text1: "Are you Sure ?",
                          text2: "You will be logged out of your account.",
                          btn1Text: "Logout",
                          btn1Handler: () => {
                            dispatch(logout(navigate));
                            setConfirmationModal(null);
                          },
                          btn2Text: "Cancel",
                          btn2Handler: () => setConfirmationModal(null),
                        });
                      }}
                      className="px-8 py-2 text-sm font-medium text-richblack-300"
                    >
                      <div className="flex items-center gap-x-2">
                        <VscSignOut className="text-lg" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full h-[1.5px] bg-white my-5"></div>
            </>
          )}

          {/* *********************************Main Page ****************************************/}
          <ul
            className={`flex gap-x-6 text-richblack-25 hover:cursor-pointer flex-col gap-y-10 justify-center items-center`}
          >
            {NavbarLinks.map((link, index) => (
              <li
                key={index}
                className="flex justify-center items-center flex-col"
              >
                {link.title === "Catalog" ? (
                  <>
                    <button
                      className="relative flex flex-col justify-center items-center gap-1 text-richblack-25 overflow-hidden"
                      onClick={handleCatalogClick}
                    >
                      <div className="flex gap-2 mb-2 items-center">
                        <p className="text-center">{link.title}</p>
                        <IoIosArrowDropdownCircle />
                      </div>
                      {/* <AiOutlineDown/> */}

                      <div
                        className={`h-0 transition-[height] duration-1000 overflow-hidden`}
                        onClick={handleClick}
                        ref={contentElCatalog}
                        style={{
                          height: sectionCatalogHeight,
                        }}
                      >
                        {loading ? (
                        
                            <p>Loading...</p>
                     
                        ) : subLinks?.length ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="hover:bg-richblack-800 flex flex-col text-richblack-100 font-semibold"
                                  key={i}
                                >
                                  {i === 0 && (
                                    <div className="w-[30vh] mt-2 h-[1px] bg-white"></div>
                                  )}
                                  <p className="mt-2">{subLink.name}</p>
                                  <div className="w-[30vh] mt-2 h-[1px] bg-white"></div>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <div className="text-center">No Course Found</div>
                        )}
                      </div>
                    </button>
                    {/* <div className="w-[30vh] mt-3 bg-white h-[1px]"></div> */}
                  </>
                ) : (
                  <NavLink to={link?.path} onClick={handleClick}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-100"
                      } flex gap-1 justify-center items-center`}
                    >
                      {link.icon}
                      {link.title}
                    </p>
                    {/* <div className="w-[30vh] mt-3 bg-white h-[1px]"></div> */}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default NavbarMobile;
