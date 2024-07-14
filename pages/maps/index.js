import React, { useEffect, useState } from "react";
// import MarkmapHooks from './markmap-hooks';
import MarkmapClass from "../../components/markmap-class";
import MarkmapHooks from "../../components/markmap-hooks";
import Navbar from "@/components/Navbar";
import LoadingComponent from "@/components/LoadingComponent";
import { setCookie } from "nookies";
import { parse } from "cookie";
import Login from "@/components/Login";
const index = () => {
  const [type, setType] = useState("hooks");

  const [isLoading, setisLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Parse the cookie after the page is mounted
    const cookies = parse(document.cookie);
    setIsLoggedIn(cookies.isLoggedIn === "true");
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Set the "isLoggedIn" cookie to expire immediately
    setCookie(null, "isLoggedIn", "true", { maxAge: -1 });
    setIsLoggedIn(false);
  };

  const Component = type === "hooks" ? MarkmapHooks : MarkmapClass;
  return (
    <>
      {isLoggedIn ? (
        <div className="flex flex-col h-screen p-2">
          <Navbar />
          <Component className="overflow-auto" />
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default index;
