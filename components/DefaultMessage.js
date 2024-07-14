import Link from "next/link";
import React, { useState, useEffect } from "react";
import Accordion from "./Accordian";

const DefaultMessage = ({ onlogout }) => {
  // const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // const handleResize = () => {
  //   setIsMobile(window.innerWidth <= 768);
  // };

  // useEffect(() => {
  //   window.addEventListener('resize', handleResize);
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);
  

  return (
    <div className="dark:bg-black bg-white"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        // backgroundColor: "#000000",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <img
        className="smallimg dark:invert-0 invert"
          src="/smalllogo.png"
          style={{ width: "30%", marginBottom: "30px", margin: "auto" }}
        />
        <img
        className="bigimg dark:invert-0 invert"
          src="/logo11.png"
          style={{ width: "80%", marginBottom: "30px", margin: "auto" }}
        />
        {/* <div className="inline-flex flex-col">
          <Link className="bg-[#1d1d1d] text-white px-8 py-2 cursor-pointer m-2" href={"/publicchat"}>View Chats</Link>
        <button
          onClick={onlogout}
          className=" text-white px-8 py-2 cursor-pointer m-6"
          style={{ background: "#1d1d1d" }}
        >
          LOGOUT
        </button>
        <Accordion />
        
        </div> */}
        
        {/* <h1 style={{color:"#fff", fontSize:"50px",fontWeight:"bolder", paddingBottom:"30px"}}>JusticeMinds</h1> */}
        {/* <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Welcome!</h1> */}
        {/* <p style={{ fontSize: "18px", color:"#adadad"}}>Select a name from the sidebar to view details.</p> */}
      </div>
    </div>
  );
};

export default DefaultMessage;
