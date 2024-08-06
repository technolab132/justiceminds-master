import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { FaAlignRight, FaSun, FaUserCircle } from "react-icons/fa";
import { logout } from '../utils/auth';
const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if code is running on the client side
      const storedUser = localStorage.getItem('sb-sbyocimrxpmvuelrqzuw-auth-token');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData.user); // Set the user data from the stored object
      }
    }
  }, []);
  return (
    <div className="fixed top-0 z-[1000] w-full dark:bg-[#000] bg-white border-b border-b-1 dark:border-[#1c1c1c] border-[#e7e7e7] flex py-2 sm:py-3 flex-row justify-between items-center ">
      <a href="/" className="logo ml-5">
        {/* <img
                src="/jmlogosmall.png"
                style={{ width: "40px" }}
              /> */}
        {/* <h3 id='logo'>Justice Minds</h3> */}
        <div className="flex flex-row gap-3">
          <img src="/smalllogo.png" className="invert dark:invert-0" style={{ width: "55px" }} />
          <div className="flex flex-col gap-1">
            {/* <h5 id='logo1'>Justice Minds</h5>
              <span className='text-xs'>Guardians of Highest Serving Best Interest</span> */}
          </div>
        </div>
      </a>
      <div className="items mr-10">
      
        <DropdownMenu className="dark sm:hidden">
          <DropdownMenuTrigger className="sm:hidden">
            <FaAlignRight />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark bg-black z-[2000] border-gray-800">
            <a href="/"><DropdownMenuItem className={`focus:bg-[#1d1d1d] ${
                router.pathname === "/dashbaord"
                  ? "text-white bg-gray-700 "
                  : ""
              }`}>Dashboard</DropdownMenuItem></a>
            <a href="/publicchat"><DropdownMenuItem className={`focus:bg-[#1d1d1d] ${
                router.pathname === "/publicchat"
                  ? "text-white bg-gray-700"
                  : ""
              }`}>Chats</DropdownMenuItem></a>
            <a href="/incidents"><DropdownMenuItem className={`focus:bg-[#1d1d1d] ${
                router.pathname === "/incidents"
                  ? "text-white bg-gray-700"
                  : ""
              }`}>Incidents</DropdownMenuItem></a>
            <a href="/transcribe"><DropdownMenuItem className={`focus:bg-[#1d1d1d] ${
                router.pathname === "/transcribe"
                  ? "text-white bg-gray-700"
                  : ""
              }`}>Transcribe</DropdownMenuItem></a>
            <a href="/journals"><DropdownMenuItem className={`focus:bg-[#1d1d1d] ${
                router.pathname === "/journals"
                  ? "text-white bg-gray-700"
                  : ""
              }`}>Journals</DropdownMenuItem></a>
            <a href="/agency"><DropdownMenuItem className={`focus:bg-[#1d1d1d] ${
                router.pathname === "/agency"
                  ? "text-white bg-gray-700"
                  : ""
              }`}>Agencies</DropdownMenuItem></a>
            <a href="/maps"><DropdownMenuItem className={`focus:bg-[#1d1d1d] ${
                router.pathname === "/maps"
                  ? "text-white bg-gray-700"
                  : ""
              }`}>Maps</DropdownMenuItem></a>
          </DropdownMenuContent>
        </DropdownMenu>
        <ul className="gap-5 hidden sm:flex">
          <li style={{paddingTop:'6px'}}>
            <a
              className={`hover:underline text-[15px]  ${
                router.pathname === "/" ? "dark:text-white text-gray-900"
                : "dark:text-gray-500 text-gray-500"
              }`}
              href="/dashboard"
            >
              Dashboard
            </a>
          </li>
          {/* <li>
            <a
              className={`hover:underline text-[15px]  ${
                router.pathname === "/publicchat"
                  ? "dark:text-white text-gray-900"
                  : "dark:text-gray-500 text-gray-500"
              }`}
              href="/publicchat"
            >
              Chats
            </a>
          </li>
          <li>
            <a
              href="/incidents"
              className={`hover:underline text-[15px]  ${
                router.pathname === "/incidents"
                ? "dark:text-white text-gray-900"
                : "dark:text-gray-500 text-gray-500"
              }`}
            >
              Incidents
            </a>
          </li>
          <li>
            <a
              href="/transcribe"
              className={`hover:underline text-[15px]  ${
                router.pathname === "/transcribe"
                ? "dark:text-white text-gray-900"
                : "dark:text-gray-500 text-gray-500"
              }`}
            >
              Transcribe
            </a>
          </li>
          <li>
            <a
              href="/journals"
              className={`hover:underline text-[15px]  ${
                router.pathname === "/journals"
                ? "dark:text-white text-gray-900"
                : "dark:text-gray-500 text-gray-500"
              }`}
            >
              Journals
            </a>
          </li>
          <li>
            <a
              className={`hover:underline text-[15px]  ${
                router.pathname === "/agency" ? "dark:text-white text-gray-900"
                : "dark:text-gray-500 text-gray-500"
              }`}
              href="/agency"
            >
              Agencies
            </a>
          </li>
          <li>
            <a
              className={`hover:underline text-[15px]  ${
                router.pathname === "/maps" ? "dark:text-white text-gray-900"
                : "dark:text-gray-500 text-gray-500"
              }`}
              href="/maps"
            >
              Maps
            </a>
          </li> */}
          <li>
          <div >
          <DropdownMenu>
            <DropdownMenuTrigger>
              {user && user.user_metadata && user.user_metadata.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="User Profile" className="rounded-full w-8 h-8 cursor-pointer" />
              ) : (
                <FaUserCircle className="text-2xl cursor-pointer" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark bg-black border-gray-800 absolute right-0 ml-4 top-full mt-2 z-[3000]">
              <DropdownMenuItem onClick={logout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
            {/* <a className={`hover:underline text-[15px]  ${
                router.pathname === "/" ? "dark:text-white text-gray-900"
                : "dark:text-gray-500 text-gray-500"
              }`} href="" onClick={logout}>
              Logout
            </a> */}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
