import React, { useEffect, useState, useRef } from "react";
import copy from "clipboard-copy";
import { createClient } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import Login from "../../components/Login";
import { setCookie } from "nookies";
import { parse } from "cookie";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import AgencyDataAdd from "../../components/AgencyDataAdd";
import { TiDeleteOutline } from "react-icons/ti";
import LoadingComponent from "../../components/LoadingComponent";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
// const axios = require("axios")
const Index = () => {
  const [application, setApplication] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [agencyname, setAgencyname] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClientExist, setIsClientExist] = useState(false);
  const [isLoading, setLoading] = useState(false); // Initialize loading as false
  const [clientData, setClientData] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState("");
  const [csvInput, setCsvInput] = useState("");
  const [searchTerm, setSearchTerm] = useState('');

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Set the "isLoggedIn" cookie to expire immediately
    setCookie(null, "isLoggedIn", "true", { maxAge: -1 });
    setIsLoggedIn(false);
  };

  useEffect(() => {
    // Parse the cookie after the page is mounted
    const cookies = parse(document.cookie);
    setIsLoggedIn(cookies.isLoggedIn === "true");
  }, []);

  // useEffect(() => {
  //   const checkAgencyExisitence = async () => {
  //     try {
  //       const { data: agencyData, error: agencyError } = await supabase
  //         .from("Liverpooldata")
  //         .select("*");

  //       if (agencyError) {
  //         throw agencyError;
  //       }

  //       if (!agencyData || agencyData.length === 0) {
  //         setIsClientExist(false);
  //       } else {
  //         setIsClientExist(true);
  //         setClientData(agencyData);
  //         // console.log(agencyData);
  //       }
  //     } catch (error) {
  //       console.error("Error checking client existence:", error.message);
  //     } finally {
  //       setLoading(false); // Set loading to false when done
  //     }
  //   };

  //   checkAgencyExisitence();
  // }, []);

  const [agencyNames, setAgencyNames] = useState([]);

  const filteredAgencyNames = agencyNames.filter((agency) =>
  agency.agencies.toLowerCase().includes(searchTerm.toLowerCase())
);

  // useEffect(() => {
  //   const fetchAgencies = async () => {
  //     try {
  //       setLoading(true);
  //       const { data: agencyData, error: agencyError } = await supabase
  //         .from("Liverpooldata")
  //         .select("*")
  //         .range(0, pageSize - 1); // Fetch initial agencies

  //       if (agencyError) {
  //         throw agencyError;
  //       }

  //       if (!agencyData || agencyData.length === 0) {
  //         setIsClientExist(false);
  //         setClientData([]); // Reset clientData to an empty array
  //       } else {
  //         setIsClientExist(true);
  //         setClientData(agencyData); // Set clientData to the fetched agencies
  //       }
  //     } catch (error) {
  //       console.error("Error fetching agencies:", error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAgencies();
  // }, []); // Fetch initial agencies on component mount

  useEffect(() => {
    const fetchAgencyNames = async () => {
      try {
        setLoading(true);
        const { data: agencyData, error: agencyError } = await supabase
          .from("Liverpooldata")
          .select("id, agencies") // Select only the 'agencies' column
          .order("posId", {ascending:true})
          // .range(0, pageSize - 1); // Fetch initial agency names
          

          console.log(agencyData);
        if (agencyError) {
          throw agencyError;
        }

        if (!agencyData || agencyData.length === 0) {
          setAgencyNames([]); // Reset agencyNames to an empty array
        } else {
          setAgencyNames(agencyData); // Set agencyNames to an array of agency names
        }
      } catch (error) {
        console.error("Error fetching agency names:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencyNames();
  }, []);

  const handleDeleteAgency = async (id) => {
    // Show a confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this agency?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      // Delete the agency from Supabase
      const { data, error } = await supabase
        .from("Liverpooldata")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Remove the deleted agency from the local state
      setClientData((prevData) =>
        prevData.filter((client) => client.id !== id)
      );
    } catch (error) {
      console.error("Error deleting agency:", error.message);
    }
  };

  const addAgenciesFromCSV = async () => {
    try {
      if (csvInput) {
        setLoading(true);
        // Split the comma-separated values into an array
        const namesArray = csvInput.split(",").map((name) => name.trim());

        // Insert each entry individually
        const insertPromises = namesArray.map(async (name) => {
          return await supabase
            .from("Liverpooldata")
            .upsert([{ agencies: name, tabs: [] }]);
        });

        // Wait for all insert operations to complete
        const results = await Promise.all(insertPromises);

        // Check for errors in any of the insert operations
        const hasError = results.some((result) => result.error);

        if (hasError) {
          console.error("Error inserting entries");
        } else {
          // Reload the data if all entries are inserted successfully
          const { data: updatedData, error: fetchError } = await supabase
            .from("Liverpooldata")
            .select("*");

          if (fetchError) {
            console.error("Error fetching updated data:", fetchError.message);
          } else {
            setClientData(updatedData);
            setLoading(false);
          }
        }
      }

      // Clear CSV input
      setCsvInput("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <Navbar />
          <ResizablePanelGroup
            direction="horizontal"
            className="dark rounded-lg flex h-screen pt-[60px] lg:pt-[80px]"
          >
            <ResizablePanel defaultSize={20}>
              <div className="overflow-y-auto">
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    // borderRight: "2px solid #424242",
                    padding: "10px",
                    height: "88vh",
                    // overflowX: "clip",
                    background: "black",
                    minWidth: "260px",
                    maxWidth: "660px",
                  }}
                >
                  {isLoading ? (
                    <LoadingComponent />
                  ) : (
                    <>
                      <input
                        type="text"
                        value={csvInput}
                        onChange={(e) => setCsvInput(e.target.value)}
                        placeholder="Bulk Add with names . . "
                        className="bg-[#1d1d1d] border-2 border-[#262626] w-full px-4 py-2 text-white rounded-md"
                      />
                      {csvInput ? (
                        <>
                          <button
                            onClick={addAgenciesFromCSV}
                            className="w-full px-4 py-3 bg-[#1d1d1d] text-white my-3 rounded-md"
                          >
                            Bulk Add
                          </button>
                        </>
                      ) : (
                        <button
                          disabled
                          className="w-full px-4 cursor-not-allowed py-3 bg-[#1d1d1d] text-gray-500 my-3 rounded-md"
                        >
                          Bulk Add
                        </button>
                      )}
                      <a
                        className="w-full px-4 py-3 bg-[#1d1d1d] text-white mb-2"
                        style={{ borderRadius: "5px" }}
                        href=""
                      >
                        Add new +{" "}
                      </a>
                      <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search agencies..."
          className="bg-[#1d1d1d] border-2 border-[#262626] w-full px-4 py-2 text-white rounded-md mb-4"
        />
                      {filteredAgencyNames?.map((name, index) => (
                        <>
                          {/* {console.log(client.agencies)}
                    {console.log(selectedAgency.agencies)} */}
                    {console.log(agencyNames)}
                          {agencyNames?.length === 0 ? (
                            <p className="text-white p-2">No Agencies</p>
                          ) : (
                            <div className=" w-full">
                              <button
                                className={`flex justify-between items-center bg-[#111111]
                  
                  `}
                                style={{
                                  width: "100%",
                                  marginBottom: "10px",
                                  textAlign: "left",
                                  borderRadius: "5px",
                                }}
                                key={index}
                                onClick={() => setSelectedAgency(name)}
                              >
                                <span
                                  style={{ wordBreak: "break-word" }}
                                  className="py-3 px-3 text-left w-[70%]"
                                  key={index}
                                >
                                  {name.agencies} 
                                </span>
                                <span className="flex pr-5 gap-3 text-red-700">
                                  <TiDeleteOutline
                                    onClick={() =>
                                      handleDeleteAgency(name.id)
                                    }
                                    size={18}
                                  />
                                </span>
                              </button>
                            </div>
                          )}
                          
                        </>
                      ))}

                    </>
                  )}
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="ress text-gray-500 bg-[#2c2c2c]" />
            <ResizablePanel className="" defaultSize={80}>
              <div className="overflow-y-auto h-[90vh] ">
                {/* <MasterChatPage id={masterchatid} /> */}
                {/* {console.log(selectedAgency)}
              {!selectedAgency ? (
                <p>hello</p>
              ) : (
              
              )} */}
              {console.log(selectedAgency)}
                <AgencyDataAdd agencyMaster={selectedAgency} />
              </div>
              {/* <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup> */}
            </ResizablePanel>
          </ResizablePanelGroup>

          {/* <div className="container mx-auto w-1/2 p-6 text-center">
            <a href="/" className="flex justify-center title-font font-medium items-center pb-6 text-white sm:mb-0">
            <img src="/logo 1.svg" style={{ width: "45%" }} alt="" />
            <img src="/jmlogosmall.png" style={{ width: "35%" }} />
          </a>
          {clientData?.map((client) => (
            <>
            <div className="flex flex-col justify-center w-1/2 mx-auto">
                <Link href={`/agency/${client?.agencies}`} className="px-3 py-3 bg-[#1d1d1d]">{client?.agencies}</Link><br />
            </div>
            </>
          ))}
        </div> */}
        </>
      ) : (
        <Login onSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default Index;
