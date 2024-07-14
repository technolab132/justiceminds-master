import Home from "./dashboard";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Lcsccs = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("application");

  const [isClientExist, setIsClientExist] = useState(false);
  const [isLoading, setLoading] = useState(false); // Initialize loading as false
  const [appdata, setAppData] = useState();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // setExtractedTexts({});
  };

  useEffect(() => {
    setLoading(true);
    // Fetch data from the Links table for the selected name
    async function fetchData() {
      const { data, error } = await supabase.from("Liverpooldata").select("*");

      if (data) {
        setAppData(data);
      }

      if (error) {
        console.error("Error fetching data:", error.message);
      } else {
        // If data exists for the selected name, set hasLink to true
        // setHasLink(data.length > 0);
      }
    }

    fetchData();
    setLoading(false);
  }, []);

  //   useEffect(() => {
  //     const checkClientExistence = async () => {
  //       try {
  //         const { data: clientData, error: clientError } = await supabase
  //           .from("Links")
  //           .select()
  //           .eq("email", indi);

  //         if (clientError) {
  //           throw clientError;
  //         }

  //         if (!clientData || clientData.length === 0) {
  //           setIsClientExist(false);
  //         } else {
  //           setIsClientExist(true);
  //           setClientData(clientData);
  //         }
  //       } catch (error) {
  //         console.error("Error checking client existence:", error.message);
  //       } finally {
  //         setLoading(false); // Set loading to false when done
  //       }
  //     };

  //     if (indi) {
  //       setLoading(true); // Set loading to true when there's a name in the URL
  //       checkClientExistence();
  //     } else {
  //       setLoading(false); // Set loading to false when there's no name in the URL
  //     }
  //   }, [indi]);

  if (isLoading) {
    // Still loading, show loading indicator
    return (
      <div className="p-5">
        <p className="text-white">
          <svg
            className={`${
              isLoading ? "animate-spin" : "hidden"
            } -ml-1 mr-3 h-5 w-5 text-white`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </p>
      </div>
    );
  }

  return (
    <>
      <header className="text-gray-400 bg-[#131313] shadow-xl body-font mb-8 w-100">
        <div className="container mx-auto flex flex-row p-5 md:flex-row items-center justify-between">
          <a className="flex title-font font-medium items-center mb-0 text-white sm:mb-0">
            <img src="/logo 1.svg" style={{ width: "25%" }} alt="" />
            <img src="/jmlogosmall.png" style={{ width: "15%" }} />
          </a>
          <span className="">Applicant</span>
        </div>
      </header>

      <h1 className="container sm:mx-auto sm:text-3xl text-xl font-semibold my-10 px-6">
        Liverpool Council Safeguarding Chair : Scrutinee
      </h1>

      <div
        className="container sm:mx-auto flex flex-row overflow-x-scroll"
        style={{
          borderBottom: "2px solid #424242",
          marginBottom: "30px",
        }}
      >
        <button
          className={`${
            activeTab === "application"
              ? "text-white bg-[#262626]"
              : "text-[#adadad]"
          }`}
          style={{ padding: "15px 30px" }}
          onClick={() => handleTabChange("application")}
        >
          Application
        </button>
        {/* <button style={{padding:"30px", color:"#adadad"}} onClick={() => handleTabChange("sent")}>Received Emails</button> */}
        {/* <button style={{padding:"30px", color:"#adadad"}} onClick={() => handleTabChange("received")}>Sent Emails</button> */}

        <button
          className={`${
            activeTab === "Eligibility"
              ? "text-white bg-[#262626]"
              : "text-[#adadad]"
          }`}
          style={{ padding: "15px 30px" }}
          onClick={() => handleTabChange("Eligibility")}
        >
          Eligibility
        </button>

        <button
          className={`${
            activeTab === "interview"
              ? "text-white bg-[#262626]"
              : "text-[#adadad]"
          } cursor-not-allowed`}
          style={{ padding: "15px 30px" }}
          //   onClick={() => handleTabChange("interview")}
        >
          Interview
        </button>

        <button
          className={`${
            activeTab === "outcomes"
              ? "text-white bg-[#262626]"
              : "text-[#adadad]"
          } cursor-not-allowed`}
          style={{ padding: "15px 30px" }}
          //   onClick={() => handleTabChange("outcomes")}
        >
          Outcomes
        </button>

        {/* {messages.length > 0 && (
            <button style={{ padding: "30px", color: "#adadad" }} onClick={() => handleTabChange("messages")}>Messages</button>
          )} */}
      </div>

      <div className="container mx-auto">
        {activeTab === "application" && (
          <div className="p-5 bg-[#262626]">
            {appdata && (
              <>
                <div className=""
                  dangerouslySetInnerHTML={{
                    __html: appdata[1].adata,
                  }}
                ></div>
              </>
            )}
          </div>
        )}
        {activeTab === "Eligibility" && (
          <div className="p-5 bg-[#262626]">
            {appdata && (
              <>
                <div
                  dangerouslySetInnerHTML={{
                    __html: appdata[1].edata,
                  }}
                ></div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Lcsccs;
