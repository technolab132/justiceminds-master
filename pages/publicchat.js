import Chat from '../components/Chat'
import PublicLogin from '../components/PublicLogin';
import React, { useEffect, useState } from 'react'
import { setCookie } from "nookies";
import { parse } from "cookie";
import Login from '../components/Login';
import Navbar from '../components/Navbar';

const publicchat = () => {
  const [isLoading, setisLoading] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [showmessage, setshowmessage] = useState("");

  
    const handleAccessSuccess = () => {
      setisLoggedIn(true);
    };

    const handleLogout = () => {
      // Set the "isLoggedIn" cookie to expire immediately
      setCookie(null, "isLoggedIn", "true", { maxAge: -1 });
      setisLoggedIn(false);
    };

  useEffect(() => {
    // Parse the cookie after the page is mounted
    const cookies = parse(document.cookie);
    setisLoggedIn(cookies.isLoggedIn === "true");
  }, []);

  setTimeout(() => {
    setshowmessage("");
  }, 5000);

  return (
    <>
    {isLoggedIn ? (
      <>
      <Navbar />
      <Chat logout={handleLogout} />
      </>
    ) : (
      <Login onSuccess={handleAccessSuccess} />
    )}
    </>
  )
}

export default publicchat