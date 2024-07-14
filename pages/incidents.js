import { createClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import Login from "../components/Login"; // Update the path
import { setCookie } from "nookies";
import { parse } from "cookie";
import Link from "next/link";
import FilterSidebar from "../components/FilterSidebar";
import DefaultMessage from "../components/DefaultMessage";
import dynamic from "next/dynamic";

// Replace the original import with a dynamic import
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.bubble.css";
import Navbar from "../components/Navbar";
import { TiDeleteOutline } from "react-icons/ti";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Complaints() {
  const [isLoading, setisLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [ForNameArray, setForNameArray] = useState([]);
  const [activeNameId, setActiveNameId] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleShowAll = () => {
    setShowAll(true);
    setSelectedName(null);
  };
  const handleCloseShowAll = () => {
    setShowAll(false);
  };

  const handleLogout = () => {
    // Set the "isLoggedIn" cookie to expire immediately
    setCookie(null, "isLoggedIn", "true", { maxAge: -1 });
    setIsLoggedIn(false);
  };

  useEffect(() => {
    // Fetch embed links from Supabase and set them in the state
    async function fetchEmbedLinkss() {
      const { data, error } = await supabase
        .from("Complaints")
        .select("id, complaint_text");
      if (error) {
        console.error("Error fetching Incidents:", error.message);
      } else {
        setForNameArray(data);
      }
    }

    fetchEmbedLinkss();
  }, []);

  const deleteIncident = async (id) => {
    try {
      // Ask for confirmation before deleting
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this incident?"
      );

      if (!isConfirmed) {
        // User canceled the deletion
        return;
      }

      // Delete the embed link with the given ID from the "Complaints" table
      const { error } = await supabase.from("Complaints").delete().eq("id", id);

      if (error) {
        console.error("Error deleting Incidents:", error.message);
      } else {
        // Remove the deleted embed link from the state
        setForNameArray((prevLinks) =>
          prevLinks.filter((link) => link.id !== id)
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSelectName = async (ID) => {
    setShowAll(false);
    const selectedRow = complaints.find((row) => row.id === ID);
    setSelectedName(selectedRow);
    setisLoading(true);

    const { data: ForNameData, error: ForNameError } = await supabase
      .from("Complaints")
      .select("*")
      .eq("complaint_for", selectedRow?.complaint_for);

    if (ForNameError) {
      console.error("ForNameError", ForNameError);
      return;
    }

    setForNameArray(ForNameData);
    setisLoading(false);

    // console.log(sentEmails);
  };

  useEffect(() => {
    if (selectedName) {
      setActiveNameId(selectedName.id);
    } else {
      setActiveNameId(null); // No active name
    }
  }, [selectedName]);

  const handleCloseDetailPanel = () => {
    setSelectedName(null); // Reset selectedName to null when the close button is clicked
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    // Parse the cookie after the page is mounted
    const cookies = parse(document.cookie);
    setIsLoggedIn(cookies.isLoggedIn === "true");
  }, []);

  useEffect(() => {
    // Fetch initial data from Supabase
    const fetchData = async () => {
      const { data, error } = await supabase.from("Complaints").select("*");
      if (error) {
        console.error(error);
        return;
      }
      setComplaints(data);
    };
    fetchData();
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <>
          <Navbar />
          <div className="flex justify-between items-center ">
            <div className="items-center absolute top-20 right-2">
              {showAll ? (
                <>
                  <button
                    className="mx-5 my-6 bg-black p-[15px]"
                    style={{ borderRadius: "5px" }}
                    onClick={handleCloseShowAll}
                  >
                    {`<Close Show All>`}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="mx-5 my-6 bg-black p-[15px]"
                    style={{ borderRadius: "5px" }}
                    onClick={handleShowAll}
                  >
                    {`<Show All>`}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex h-screen overflow-hidden pt-[60px] lg:pt-[80px]">
            {/* Sidebar Toggle Button */}

            {/* Sidebar */}
            <div
              className={` w-2/4 md:w-1/3 lg:w-1/5 md:flex-shrink-0 ${
                showSidebar ? "" : "hidden"
              }`}
            >
              {showSidebar && (
                <FilterSidebar
                  data={complaints}
                  activeNameId={activeNameId}
                  onSelectName={handleSelectName}
                />
              )}
            </div>

            {/* Dashboard */}
            {isLoading ? (
              <p className="p-8">Loading . . . </p>
            ) : (
              <div className="flex-grow md:w-2/3 lg:w-3/4 overflow-y-auto">
                {selectedName ? (
                  <section
                    className="text-gray-400 body-font"
                    style={{ overflowY: "scroll" }}
                  >
                    <div className="container px-2 py-4 mx-auto ">
                      <div className="">
                        <>
                          {complaints ? (
                            <>
                              {ForNameArray?.map((comp) => (
                                <div
                                  className="py-8 border-b-2 border-[#060606] bg-[#0f0f0f] p-5 justify-between flex flex-col "
                                  style={{ borderRadius: "5px" }}
                                >
                                  <div className=" mb-6">
                                    <div className="flex flex-col">
                                      {/* <button
                                        className="py-0.5 px-4 bg-red-500 text-white"
                                        onClick={() => deleteIncident(comp.id)}
                                      >
                                        Delete
                                      </button> */}
                                      <div
                                        className="flex mb-3 items-center gap-2 text-red-600 cursor-pointer"
                                        onClick={() => deleteIncident(comp.id)}
                                      >
                                        <TiDeleteOutline
                                          className="text-red-600"
                                          size={18}
                                        />
                                        <span>Delete</span>
                                      </div>
                                      <span className="flex items-center gap-3 font-semibold title-font text-white capitalize">
                                        <span className="text-[#9f9f9f]">
                                          Name:
                                        </span>
                                        {/* <br /> */}
                                        {comp.complainer_name}
                                      </span>
                                      <span className="flex items-center gap-3 font-semibold title-font text-white ">
                                        <span className="text-[#9f9f9f]">
                                          Email:
                                        </span>
                                        {comp.complainer_email}
                                      </span>
                                      <span className="mt-1 text-gray-500 text-md">
                                        Date :{" "}
                                        {new Date(
                                          comp?.created_at
                                        ).toLocaleString()}{" "}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-semibold title-font text-white capitalize">
                                      For: <br />
                                      {comp.complaint_for}
                                    </span>
                                  </div>

                                  <div className=" my-3 rounded-lg w-full bg-[#000000] p-5">
                                    {/* <div> */}
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: comp.complaint_text,
                                      }}
                                    ></div>
                                    {/* </div> */}
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <p>No Incidents to Display . . </p>
                          )}
                        </>
                      </div>
                    </div>
                  </section>
                ) : (
                  <>
                    {!showAll ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100vh",
                          backgroundColor: "#000000",
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <h1 className="text-3xl py-6">Incident Dashboard</h1>
                          <p className="text-gray-600 py-6">
                            Please select the <br />
                            Name of Complainee ( for whom )
                          </p>

                          <button
                            onClick={handleLogout}
                            className=" text-white px-8 py-2 cursor-pointer m-5"
                            style={{ background: "#1d1d1d" }}
                          >
                            LOGOUT
                          </button>
                          {/* <h1 style={{color:"#fff", fontSize:"50px",fontWeight:"bolder", paddingBottom:"30px"}}>JusticeMinds</h1> */}
                          {/* <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Welcome!</h1> */}
                          {/* <p style={{ fontSize: "18px", color:"#adadad"}}>Select a name from the sidebar to view details.</p> */}
                        </div>
                      </div>
                    ) : (
                      <section
                        className="text-gray-400 body-font overflow-y-scroll"
                        style={{ height: "100vh" }}
                      >
                        <div className="container px-5 pt-24 mx-auto">
                          <div className="mt-2">
                            <>
                              {complaints ? (
                                <>
                                  {complaints?.map((comp) => (
                                    <div
                                    className="py-8 border-b-2 border-[#060606] bg-[#0f0f0f] p-5 justify-between flex flex-col "
                                    style={{ borderRadius: "5px" }}
                                  >
                                    <div className=" mb-6">
                                      <div className="flex flex-col">
                                        {/* <button
                                          className="py-0.5 px-4 bg-red-500 text-white"
                                          onClick={() => deleteIncident(comp.id)}
                                        >
                                          Delete
                                        </button> */}
                                        <div
                                          className="flex mb-3 items-center gap-2 text-red-600 cursor-pointer"
                                          onClick={() => deleteIncident(comp.id)}
                                        >
                                          <TiDeleteOutline
                                            className="text-red-600"
                                            size={18}
                                          />
                                          <span>Delete</span>
                                        </div>
                                        <span className="flex items-center gap-3 font-semibold title-font text-white capitalize">
                                          <span className="text-[#9f9f9f]">
                                            Name:
                                          </span>
                                          {/* <br /> */}
                                          {comp.complainer_name}
                                        </span>
                                        <span className="flex items-center gap-3 font-semibold title-font text-white ">
                                          <span className="text-[#9f9f9f]">
                                            Email:
                                          </span>
                                          {comp.complainer_email}
                                        </span>
                                        <span className="mt-1 text-gray-500 text-md">
                                          Date :{" "}
                                          {new Date(
                                            comp?.created_at
                                          ).toLocaleString()}{" "}
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <span className="font-semibold title-font text-white capitalize">
                                        For: <br />
                                        {comp.complaint_for}
                                      </span>
                                    </div>
  
                                    <div className=" my-3 rounded-lg w-full bg-[#000000] p-5">
                                      {/* <div> */}
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: comp.complaint_text,
                                        }}
                                      ></div>
                                      {/* </div> */}
                                    </div>
                                  </div>
                                  ))}
                                </>
                              ) : (
                                <p>No Incidents to Display . . </p>
                              )}
                            </>
                          </div>
                        </div>
                      </section>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <Login onSuccess={handleLoginSuccess} />
      )}
    </>
  );
}
