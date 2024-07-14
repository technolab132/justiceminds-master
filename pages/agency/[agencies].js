"use client";
import Home from "../dashboard";
import { createClient } from "@supabase/supabase-js";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { RiLockFill, RiLockUnlockFill } from "react-icons/ri";
import { setCookie } from "nookies";
import { parse } from "cookie";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import LoadingComponent from "../../components/LoadingComponent";
// import PublicLogin from "@/components/PublicLogin";
import ALogin from "../../components/AgencyLogin";

const Agencies = () => {
  const router = useRouter();
  // const { agenciesquery } = router.query;
  const agenciesquery = router.query.agencies;
  // console.log(agenciesquery.split("id="));
  const [isAccessed, setIsAccessed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const agencies = agenciesquery?.split("id=")[0];
  const agencyID = agenciesquery?.split("id=")[1];
  const [secretCode, setSecretCode] = useState("");
  console.log(agencies);

  const url = agencies?.toLowerCase().replace(/\s+/g, "-");

  const [isClientExist, setIsClientExist] = useState(false);
  const [isLoading, setLoading] = useState(false); // Initialize loading as false
  const [clientData, setClientData] = useState();
  const [activeTab, setActiveTab] = useState("");
  const [updatedClientData, setUpdatedClientData] = useState(null);
  const [showInputForQuestion, setShowInputForQuestion] = useState({});
  const [newAnswer, setNewAnswer] = useState({});

  //Entire agency info with all tabs
  const [agencyInfo, setAgencyInfo] = useState([]);

  //Active tab info
  const [activeTabData, setActiveTabData] = useState([]);

  //to handle tab change
  const handleTabChange = async (tab, tabIndex, tabData) => {
    setActiveTab(tab);

    try {
      setLoading(true);

      const newAgencyData = tabData;

      console.log("selected tab data", newAgencyData);

      if (!newAgencyData) {
        setActiveTabData([]);
      } else {
        setActiveTabData((prev) => {
          let selectedTab = [];
          selectedTab[0] = agencyInfo[0].tabs[tabIndex];

          return selectedTab;
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tab data:", error.message);
    } finally {
    }
  };

  const handleAccessSuccess = () => {
    setIsAccessed(true);
  };

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    setIsAccessed(true);
  };

  useEffect(() => {
    // Parse the cookie after the page is mounted
    const cookies = parse(document.cookie);
    setIsAccessed(cookies.isAccessed === "true");
    setIsAdmin(cookies.isAccessed === "true");
  }, []);

  useEffect(() => {
    const checkAgencyExisitence = async () => {
      try {
        setLoading(true);
        const { data: agencyData, error: agencyError } = await supabase
          .from("Liverpooldata")
          .select()
          .eq("agencies", agencies)
          .eq("id", agencyID);

        if (agencyError) {
          throw agencyError;
        }

        if (!agencyData || agencyData.length === 0) {
          setIsClientExist(false);
        } else {
          setIsClientExist(true);
          setClientData(agencyData);
          setUpdatedClientData(agencyData[0]);
          if (agencyData[0].tabs.length > 0) {
            setAgencyInfo(agencyData);
            setActiveTab(agencyData[0].tabs[0].name);

            setActiveTabData((prev) => {
              if (prev.length == 0) {
                prev.push(agencyData[0].tabs[0]);
              } else prev[0] = agencyData[0].tabs[0];
              return prev;
            });
          }
          console.log(agencyData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking client existence:", error.message);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    if (agencies) {
      setLoading(true); // Set loading to true when there's a name in the URL
      checkAgencyExisitence();
    } else {
      setLoading(false); // Set loading to false when there's no name in the URL
    }
  }, [agencies]);

  const handleQuestionAnswerChange = (
    tabIndex,
    questionIndex,
    answerIndex,
    newAnswer
  ) => {
    const updatedTabs = [...updatedClientData.tabs];
    const updatedQuestions = [...updatedTabs[tabIndex].questions];
    const updatedAnswers = [...updatedQuestions[questionIndex].ans];
    updatedAnswers[answerIndex] = newAnswer;
    updatedQuestions[questionIndex].ans = updatedAnswers;
    updatedTabs[tabIndex].questions = updatedQuestions;
    setUpdatedClientData({ ...updatedClientData, tabs: updatedTabs });
  };

  const handleAddQuestionAnswer = (tabIndex, questionIndex) => {
    setShowInputForQuestion((prevState) => ({
      ...prevState,
      [tabIndex]: {
        ...(prevState[tabIndex] || {}),
        [questionIndex]: true,
      },
    }));
  };

  const handleNewAnswerChange = (tabIndex, questionIndex, value) => {
    setNewAnswer((prevState) => ({
      ...prevState,
      [tabIndex]: {
        ...(prevState[tabIndex] || {}),
        [questionIndex]: value,
      },
    }));
  };

  const handleSendAnswer = async (tabIndex, questionIndex) => {
    try {
      if (newAnswer && secretCode === "9999") {
        setLoading(true);

        const updatedTabs = [...updatedClientData.tabs];
        const updatedQuestions = [...updatedTabs[tabIndex].questions];
        const updatedAnswers = [...updatedQuestions[questionIndex].ans];
        updatedAnswers.push(newAnswer[tabIndex][questionIndex]);
        updatedQuestions[questionIndex].ans = updatedAnswers;
        updatedTabs[tabIndex].questions = updatedQuestions;

        const { data, error } = await supabase.from("Liverpooldata").upsert([
          {
            id: agencyID,
            agencies: updatedClientData.agencies,
            tabs: updatedTabs,
          },
        ]);

        if (error) {
          console.error("Error updating data:", error.message);
        } else {
          console.log("Data updated successfully:", data);
          setClientData({ ...updatedClientData, tabs: updatedTabs });
          setShowInputForQuestion((prevState) => ({
            ...prevState,
            [tabIndex]: {
              ...(prevState[tabIndex] || {}),
              [questionIndex]: false,
            },
          }));
          setNewAnswer((prevState) => ({
            ...prevState,
            [tabIndex]: {
              ...(prevState[tabIndex] || {}),
              [questionIndex]: "",
            },
          }));
        }
        // router.reload();
        setLoading(false);
      } else {
        alert("Invalid Secret Code");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      router.reload();
      setLoading(false);
    }
  };

  const handleRemoveQuestionAnswer = (tabIndex, questionIndex, answerIndex) => {
    const updatedTabs = [...updatedClientData.tabs];
    const updatedQuestions = [...updatedTabs[tabIndex].questions];
    const updatedAnswers = [...updatedQuestions[questionIndex].ans];
    updatedAnswers.splice(answerIndex, 1);
    updatedQuestions[questionIndex].ans = updatedAnswers;
    updatedTabs[tabIndex].questions = updatedQuestions;
    setUpdatedClientData({ ...updatedClientData, tabs: updatedTabs });
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.from("Liverpooldata").upsert([
        {
          id: agencyID,
          agencies: updatedClientData.agencies,
          tabs: updatedClientData.tabs,
        },
      ]);

      if (error) {
        console.error("Error updating data:", error.message);
      } else {
        console.log("Data updated successfully:", data);
        setClientData(updatedClientData);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // if (isLoading) {
  //   // Still loading, show loading indicator
  //   return (
  //     <div className="p-5">
  //       <p className="text-white">
  //         <svg
  //           className={`${
  //             isLoading ? "animate-spin" : "hidden"
  //           } -ml-1 mr-3 h-5 w-5 text-white`}
  //           fill="none"
  //           viewBox="0 0 24 24"
  //         >
  //           <circle
  //             className="opacity-25"
  //             cx="12"
  //             cy="12"
  //             r="10"
  //             stroke="currentColor"
  //             strokeWidth="4"
  //           ></circle>
  //           <path
  //             className="opacity-75"
  //             fill="currentColor"
  //             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  //           ></path>
  //         </svg>
  //       </p>
  //     </div>
  //   );
  // }

  if (!isClientExist) {
    // Client not found, show "Not Found" message
    return <LoadingComponent />;
  }

  console.log("agency data is", clientData);

  return (
    <>
      <Head>
        <title>Justiceminds - Home - Data Driven Advocacy</title>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content={`${clientData[0]?.agencies} | Justiceminds - Data Driven Advocacy `}
        />
        <meta
          property="og:description"
          content="Welcome to Justiceminds, where data meets advocacy. An Initiative by Mr. Ben Mak"
        />
        <meta
          property="og:image"
          content="https://justice-minds.com/ogimage.png"
        />
        <meta
          property="og:url"
          content={`https://justice-minds.com/agency/${agencies.replace(
            /\s+/g,
            "%20"
          )}`}
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="justice-minds.com" />
        <meta
          property="twitter:url"
          content={`https://justice-minds.com/agency/${agencies.replace(
            /\s+/g,
            "%20"
          )}`}
        />
        <meta
          name="twitter:title"
          content={`Justiceminds - Home - Data Driven Advocacy `}
        />
        <meta
          name="twitter:description"
          content="Welcome to Justiceminds, where data meets advocacy. An Initiative by Mr. Ben Mak"
        />
        <meta
          name="twitter:image"
          content="https://opengraph.b-cdn.net/production/documents/92230eda-013c-45d2-b7c8-99ac20d3fd2b.png?token=R-syw39ZaAMyWZJc-ofVWimJkopIZY3rH-rHdpuAt-E&height=853&width=1200&expires=33240875962"
        />
      </Head>
      {!isLoading ? (
        <div className="overflow-y-scroll h-screen pb-4">
          <header className="text-gray-400 bg-[#131313] shadow-xl body-font mb-4 w-100 px-3 sm:px-14 py-2">
            <div className="container mx-auto flex flex-row p-2 md:flex-row items-center justify-between">
              <a className="flex title-font font-medium items-center mb-0 text-white sm:mb-0">
                {/* <img src="/logo11.png" style={{ width: "20%" }} alt="" /> */}

                <div className="flex items-center gap-3">
                  <img
                    className="pt-1"
                    src="/smalllogo.png"
                    style={{ width: "60px" }}
                  />
                  <div className="">
                    <p className="text-lg ">Justiceminds</p>
                    <p className="text-xs">Data Driven Advocacy</p>
                  </div>
                  {/* <div className="">
                  <p className="text-lg ">Justiceminds</p>
                  <p className="text-xs">Data Driven Advocacy</p>
                </div> */}
                </div>
              </a>
              <a href="mailto:authority@legaldueprocess.com" className="">
                Authority
              </a>
            </div>
          </header>
          <div className="p-3 sm:p-14 relative">
            <h6 className="container p-0 capitalize sm:mx-auto sm:text-3xl text-xl font-semibold mb-4">
              {clientData[0]?.agencies}
            </h6>

            <div
              className="container sticky py-3 z-[500] top-0 sm:mx-auto flex gap-1 flex-row overflow-x-auto p-0"
              style={{
                // borderBottom: "2px solid #424242",
                // marginBottom: "10px",
                background: "#000",
              }}
            >
              {/* {console.log(clientData[0].tabs)} */}
              {clientData[0]?.tabs?.map((tab, i) => (
                <button
                  key={tab.name}
                  className={`rounded-md w-[200px] sm:w-auto text-left border-1 border border-gray-700  text-[10px]  sm:text-lg sm:px-6 sm:py-3 px-2 py-1 hover:bg-[#1c1c1c] flex items-center gap-2 ${
                    activeTab === tab.name
                      ? "text-white bg-[#262626]"
                      : "text-[#adadad]"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                  // onClick={() => handleTabChange(tab.name)}
                  onClick={() => handleTabChange(tab.name, i, tab)}
                >
                  {tab.name}
                  {tab.lock && <RiLockFill className="" />}
                </button>
              ))}

              {/* <button style={{padding:"30px", color:"#adadad"}} onClick={() => handleTabChange("sent")}>Received Emails</button> */}
              {/* <button style={{padding:"30px", color:"#adadad"}} onClick={() => handleTabChange("received")}>Sent Emails</button> */}

              {/* {messages.length > 0 && (
            <button style={{ padding: "30px", color: "#adadad" }} onClick={() => handleTabChange("messages")}>Messages</button>
          )} */}
            </div>
            <hr className="container border-gray-500 mx-auto mb-6" />

            {/* {clientData[0]?.tabs?.map((tab, index) => ( */}
            {activeTabData?.map((tab, index) => (
              <>
                {tab.lock === false || !tab.lock ? (
                  <>
                    <div className="container mx-auto p-0">
                      {/* ... existing code for unlocked tab ... */}
                      <div
                        key={tab.name}
                        className={`rounded-md overflow-x-scroll ${
                          activeTab === tab.name ? "" : "hidden"
                        }`}
                      >
                        <div className="container mx-auto p-0">
                          {/* {clientData[0]?.tabs?.map((tab) => ( */}
                          {activeTabData?.map((tab) => (
                            <div
                              key={tab.name}
                              className={`sm:p-3 p-3 mb-3 bg-[#262626] rounded-md overflow-x-scroll ${
                                activeTab === tab.name ? "" : "hidden"
                              }`}
                            >
                              <div
                                id="agency-content"
                                dangerouslySetInnerHTML={{
                                  __html: tab.content,
                                }}
                              ></div>
                            </div>
                          ))}
                          {/* <br /> */}
                          <div className="flex flex-col sm:flex-row items-start h-[600px] sm:h-auto overflow-auto w-full sm:gap-2 gap-1">
                            <div className={`${
      activeTabData.some((tab) => tab.images?.length > 0 || tab.documents?.length > 0) ? "w-full sm:w-[65%]" : "w-full"
    } flex flex-col gap-2`}
>
                              <div className="flex flex-row gap-0 bg-[#262626] rounded-md">
                                {clientData[0]?.tabs?.map((tab) => (
                                  <>
                                    {/* {!tab?.accordions ||
                                    tab?.accordions?.length == 0 ? ( */}
                                    {!activeTabData?.accordions ||
                                    activeTabData?.accordions?.length == 0 ? (
                                      <></>
                                    ) : (
                                      <div
                                        key={tab.accordions}
                                        className={`p-2 sm:p-2 bg-[#262626] rounded-md grid grid-cols-1 w-full ${
                                          activeTab === tab.name ? "" : "hidden"
                                        }`}
                                      >
                                        <Accordion
                                          type="single"
                                          collapsible
                                          className="w-full"
                                        >
                                          {tab?.accordions?.map(
                                            (acc, index) => (
                                              <>
                                                {/* {acc.title}
                          {acc.content} */}

                                                {!acc.fullWidth && (
                                                  <AccordionItem
                                                    className="text-md border-0 mb-2 "
                                                    key={index}
                                                    value={index + 1}
                                                  >
                                                    <AccordionTrigger className="bg-[#131313] sm:p-2 p-2 rounded-lg text-[10px] h-[50px]  sm:text-sm">
                                                      {acc.title}
                                                    </AccordionTrigger>
                                                    <AccordionContent
                                                      id="accordians"
                                                      className="bg-[#1e1e1e] rounded-lg p-2 mt-1 text-xs sm:text-sm"
                                                    >
                                                      <div
                                                        dangerouslySetInnerHTML={{
                                                          __html: acc.content,
                                                        }}
                                                      ></div>
                                                    </AccordionContent>
                                                  </AccordionItem>
                                                )}
                                              </>
                                            )
                                          )}
                                        </Accordion>
                                      </div>
                                    )}
                                  </>
                                ))}
                                {/* {clientData[0]?.tabs?.map((tab) => ( */}
                                {activeTabData.map((tab) => (
                                  <>
                                    {!tab?.evidences ||
                                    tab?.evidences?.length == 0 ? (
                                      <></>
                                    ) : (
                                      <div
                                        key={tab.evidences}
                                        className={`p-2 sm:p-2 bg-[#262626] rounded-md grid grid-cols-1 w-full ${
                                          activeTab === tab.name ? "" : "hidden"
                                        }`}
                                      >
                                        <Accordion
                                          type="single"
                                          collapsible
                                          className="w-full"
                                        >
                                          {tab?.evidences?.map((acc, index) => (
                                            <>
                                              {/* {acc.title}
                          {acc.content} */}
                                              <AccordionItem
                                                className="text-md border-0 mb-2"
                                                key={index}
                                                value={index + 1}
                                              >
                                                <AccordionTrigger className="bg-[#131313] sm:p-2 p-2 rounded-lg text-[10px] h-[50px]  sm:text-sm">
                                                  {acc.title}
                                                </AccordionTrigger>
                                                <AccordionContent
                                                  id="accordians"
                                                  className="bg-[#1e1e1e] rounded-lg p-2 mt-1 text-xs sm:text-sm"
                                                >
                                                  <div
                                                    dangerouslySetInnerHTML={{
                                                      __html: acc.content,
                                                    }}
                                                  ></div>
                                                </AccordionContent>
                                              </AccordionItem>
                                            </>
                                          ))}
                                        </Accordion>
                                      </div>
                                    )}
                                  </>
                                ))}
                              </div>

                              {/* {clientData[0]?.tabs?.map((tab) => ( */}
                              {activeTabData?.map((tab) => (
                                <>
                                  {!tab?.accordions ||
                                  tab?.accordions?.length == 0 ? (
                                    <></>
                                  ) : (
                                    <div
                                      key={tab.accordions}
                                      className={`p-2 sm:p-2 bg-[#262626] rounded-md grid grid-cols-1 w-full ${
                                        activeTab === tab.name ? "" : "hidden"
                                      }`}
                                    >
                                      <Accordion
                                        type="single"
                                        collapsible
                                        className="w-full"
                                      >
                                        {tab?.accordions?.map((acc, index) => (
                                          <>
                                            {/* {acc.title}
                          {acc.content} */}

                                            {acc.fullWidth && (
                                              <AccordionItem
                                                className="text-md border-0 mb-2 "
                                                key={index}
                                                value={index + 1}
                                              >
                                                <AccordionTrigger className="bg-[#131313] sm:p-2 p-2 rounded-lg text-[10px] h-[50px]  sm:text-sm">
                                                  {acc.title}
                                                </AccordionTrigger>
                                                <AccordionContent
                                                  id="accordians"
                                                  className="bg-[#1e1e1e] rounded-lg p-2 mt-1 text-xs sm:text-sm"
                                                >
                                                  <div
                                                    dangerouslySetInnerHTML={{
                                                      __html: acc.content,
                                                    }}
                                                  ></div>
                                                </AccordionContent>
                                              </AccordionItem>
                                            )}
                                          </>
                                        ))}
                                      </Accordion>
                                    </div>
                                  )}
                                </>
                              ))}

                              {/* {clientData[0]?.tabs?.map((tab, tabIndex) => ( */}
                              {activeTabData?.map((tab, tabIndex) => (
                                <>
                                  {!tab?.questions ||
                                  tab?.questions?.length === 0 ? (
                                    <></>
                                  ) : (
                                    <div
                                      key={tab.que}
                                      className={`p-3 bg-[#262626] rounded-md grid gap-2 grid-cols-1 w-full ${
                                        activeTab === tab.name ? "" : "hidden"
                                      }`}
                                    >
                                      <Accordion
                                        type="single"
                                        collapsible
                                        className="w-full"
                                      >
                                        {tab?.questions?.map(
                                          (question, questionIndex) => (
                                            <>
                                              {/* {acc.title}
                          {acc.content} */}
                                              <AccordionItem
                                                className="text-md border-0 mb-2 w-full"
                                                key={questionIndex}
                                                value={questionIndex + 1}
                                              >
                                                {/* <div className="flex w-full"> */}
                                                <AccordionTrigger
                                                  onClick={() =>
                                                    handleAddQuestionAnswer(
                                                      tabIndex,
                                                      questionIndex
                                                    )
                                                  }
                                                  className="bg-[#131313] w-full sm:p-2 p-2 rounded-lg text-xs  sm:text-sm"
                                                >
                                                  {question.que}
                                                </AccordionTrigger>

                                                {/* </div> */}

                                                <AccordionContent
                                                  id="accordians"
                                                  className="bg-[#1e1e1e] rounded-lg p-2 mt-1 text-xs sm:text-sm"
                                                >
                                                  {question.ans.map(
                                                    (answer, answerIndex) => (
                                                      <div className="flex flex-col">
                                                        <p
                                                          className="bg-black w-min px-4 py-2 mt-2 rounded-md text-xs sm:text-sm"
                                                          key={answerIndex}
                                                        >
                                                          {answer}
                                                        </p>
                                                      </div>
                                                    )
                                                  )}
                                                  {showInputForQuestion[
                                                    tabIndex
                                                  ]?.[questionIndex] && (
                                                    <div className="flex sm:flex-row flex-col items-start sm:items-center gap-2 mt-2">
                                                      <input
                                                        value={
                                                          newAnswer[tabIndex]?.[
                                                            questionIndex
                                                          ] || ""
                                                        }
                                                        onChange={(e) =>
                                                          handleNewAnswerChange(
                                                            tabIndex,
                                                            questionIndex,
                                                            e.target.value
                                                          )
                                                        }
                                                        placeholder="Enter new answer"
                                                        type="text"
                                                        className="bg-[#1c1c1c] w-full border-2 border-[#262626] px-4 py-2 text-white rounded-md text-xs sm:text-sm"
                                                      />
                                                      <input
                                                        value={secretCode}
                                                        onChange={(e) =>
                                                          setSecretCode(
                                                            e.target.value
                                                          )
                                                        }
                                                        placeholder="Enter Security Pin"
                                                        type="text"
                                                        className="bg-[#1c1c1c] w-full border-2 border-[#262626] px-4 py-2 text-white rounded-md text-xs sm:text-sm"
                                                      />
                                                      {newAnswer != "" &&
                                                      secretCode ? (
                                                        <button
                                                          className="px-2 py-1 bg-green-500 text-white rounded-md text-xs sm:text-sm"
                                                          onClick={() =>
                                                            handleSendAnswer(
                                                              tabIndex,
                                                              questionIndex
                                                            )
                                                          }
                                                        >
                                                          Send
                                                        </button>
                                                      ) : (
                                                        <button
                                                          className="px-2 py-1 cursor-not-allowed bg-gray-700 text-gray-500 rounded-md"
                                                          disabled
                                                        >
                                                          Send
                                                        </button>
                                                      )}
                                                    </div>
                                                  )}
                                                </AccordionContent>
                                              </AccordionItem>
                                            </>
                                          )
                                        )}
                                      </Accordion>
                                    </div>
                                  )}
                                </>
                              ))}
                            </div>
                            <div className={`${
      activeTabData.some((tab) => tab.images?.length > 0 || tab.documents?.length > 0) ? "w-full sm:w-[35%]" : "w-full hidden"
    } flex flex-col gap-2`}>
                              {/* {clientData[0]?.tabs?.map((tab) => ( */}
                              {activeTabData?.map((tab) => (
                                <>
                                  {!tab?.images || tab?.images?.length == 0 ? (
                                    <></>
                                  ) : (
                                    <div
                                      key={tab.name}
                                      className={`p-2 sm:p-3 bg-[#262626] rounded-md gap-1 grid grid-cols-1 w-full ${
                                        activeTab === tab.name ? "" : "hidden"
                                      }`}
                                    >
                                      {tab?.images?.map((imageUrl, index) => (
                                        <a
                                          target="_blank"
                                          href={imageUrl}
                                          className="hover:opacity-50"
                                        >
                                          <img
                                            key={index}
                                            src={imageUrl}
                                            alt={`Uploaded Image ${index + 1}`}
                                            className="object-cover h-auto w-full rounded-lg"
                                          />
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </>
                              ))}
                              {/* <br /> */}
                              {/* {clientData[0]?.tabs?.map((tab) => ( */}
                              {activeTabData?.map((tab) => (
                                <div
                                  key={tab.name}
                                  className={`p-5 bg-[#262626] rounded-md grid gap-2 grid-cols-1 w-full ${
                                    activeTab === tab.name ? "" : "hidden"
                                  }`}
                                >
                                  {!tab?.documents ||
                                  tab?.documents?.length === 0 ? null : (
                                    <div>
                                      {tab?.documents?.some((docUrl) =>
                                        docUrl?.includes(".mp3")
                                      ) ? (
                                        <div className="pb-5">
                                          <h4>Conversations</h4>
                                          {tab?.documents?.map(
                                            (docUrl, index) => (
                                              <div
                                                className="relative mt-3"
                                                key={index}
                                              >
                                                {docUrl?.includes(".mp3") ? (
                                                  <audio
                                                    className="h-[40px]"
                                                    controls
                                                  >
                                                    <source
                                                      src={docUrl}
                                                      type="audio/mpeg"
                                                    />
                                                    Your browser does not
                                                    support the audio element.
                                                  </audio>
                                                ) : null}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : null}

                                      {tab?.documents?.some(
                                        (docUrl) => !docUrl?.includes(".mp3")
                                      ) ? (
                                        <>
                                          <h4>Documents</h4>
                                          {tab?.documents
                                            ?.filter(
                                              (docUrl) =>
                                                !docUrl?.includes(".mp3")
                                            )
                                            .map((docUrl, index) => (
                                              <div
                                                className="relative mt-6"
                                                key={index}
                                              >
                                                <a
                                                  target="_blank"
                                                  href={docUrl}
                                                  className="hover:opacity-70 absolute -top-7 right-0"
                                                >
                                                  View in new tab
                                                </a>
                                                <iframe
                                                  className="h-[500px] sm:h-[275px] md:h-[700px]"
                                                  title={`Uploaded Document ${
                                                    index + 1
                                                  }`}
                                                  src={docUrl}
                                                  width="100%"
                                                  // height="400px"
                                                ></iframe>
                                              </div>
                                            ))}
                                        </>
                                      ) : null}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* <br /> */}

                          {/* {console.log(clientData)} */}
                          {/* {clientData[0].tabs?.map((tab) => (
              <>
                {!tab?.accordions || tab?.accordions?.length == 0 ? (
                  <></>
                ) : (
                  <div
                    key={tab.accordions}
                    className={`p-3 bg-[#262626] rounded-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 w-full ${
                      activeTab === tab.name ? "" : "hidden"
                    }`}
                  >
                    <Accordion type="single" collapsible className="w-full">
                      {tab?.accordions?.map((acc, index) => (
                        <>
                          <AccordionItem
                            className="text-md border-0 mb-2"
                            key={index}
                            value={index + 1}
                          >
                            <AccordionTrigger className="bg-[#131313] p-3 rounded-lg">
                              {acc.title}
                            </AccordionTrigger>
                            <AccordionContent className="bg-[#1e1e1e] rounded-lg p-3 mt-1">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: acc.content,
                                }}
                              ></div>
                            </AccordionContent>
                          </AccordionItem>
                        </>
                      ))}
                    </Accordion>
                  </div>
                )}
              </>
            ))} */}
                          <br />
                          {/* <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md fixed bottom-4 right-4"
        onClick={handleSaveChanges}
      >
        Save Changes
      </button> */}
                          {/* {clientData[0].tabs?.map((tab) => (
              <>
                {!tab?.images || tab?.images?.length == 0 ? (
                  <></>
                ) : (
                  <div
                    key={tab.name}
                    className={`p-5 bg-[#262626] rounded-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 w-full ${
                      activeTab === tab.name ? "" : "hidden"
                    }`}
                  >
                    {tab?.images?.map((imageUrl, index) => (
                      <a
                        target="_blank"
                        href={imageUrl}
                        className="hover:opacity-50"
                      >
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`Uploaded Image ${index + 1}`}
                          className="object-cover h-[450px] w-full p-1 rounded-lg"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </>
            ))} */}
                          <br />
                          {/* {clientData[0].tabs?.map((tab) => (
              <>
                {!tab?.documents || tab?.documents?.length == 0 ? (
                  <></>
                ) : (
                  <div
                    key={tab.name}
                    className={`p-5 bg-[#262626] rounded-md grid gap-2 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 w-full ${
                      activeTab === tab.name ? "" : "hidden"
                    }`}
                  >
                    {tab?.documents?.map((docUrl, index) => (
                      <div className="relative mt-6">
                        <a
                          target="_blank"
                          href={docUrl}
                          className="hover:opacity-70 absolute -top-7 right-0"
                        >
                          View in new tab
                        </a>
                        <iframe
                          title={`Uploaded Document ${index + 1}`}
                          src={docUrl}
                          width="100%"
                          height="600px"
                        ></iframe>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ))} */}
                        </div>
                      </div>
                      {/* ... rest of the code for unlocked tab ... */}
                    </div>
                  </>
                ) : (
                  //

                  // <p>hello</p>
                  <div
                    key={tab.name}
                    className={`rounded-md grid grid-cols-1 w-full ${
                      activeTab === tab.name ? "" : "hidden"
                    }`}
                  >
                    {!isAccessed && (
                      <ALogin
                        onSuccess={handleAccessSuccess}
                        onAdmin={handleAdminSuccess}
                      />
                    )}
                    {isAccessed && (
                      <div className=" p-0">
                        {/* ... existing code for unlocked tab ... */}
                        <div
                          key={tab.name}
                          className={` rounded-md overflow-x-scroll ${
                            activeTab === tab.name ? "" : "hidden"
                          }`}
                        >
                          <div className=" p-0">
                            {activeTabData?.map((tab) => (
                              <div
                                key={tab.name}
                                className={`sm:p-3 p-3 mb-3 bg-[#262626] rounded-md overflow-x-scroll ${
                                  activeTab === tab.name ? "" : "hidden"
                                }`}
                              >
                                <div
                                  id="agency-content"
                                  dangerouslySetInnerHTML={{
                                    __html: tab.content,
                                  }}
                                ></div>
                              </div>
                            ))}
                            {/* <br /> */}
                            <div className="flex flex-col sm:flex-row items-start h-[600px] sm:h-auto overflow-auto w-full sm:gap-2 gap-1">
                              <div className="w-full sm:w-[65%] flex flex-col gap-2">
                                <div className="flex flex-row gap-0 bg-[#262626] rounded-md">
                                  {clientData[0]?.tabs?.map((tab) => (
                                    <>
                                      {!tab?.accordions ||
                                      tab?.accordions?.length == 0 ? (
                                        <></>
                                      ) : (
                                        <div
                                          key={tab.accordions}
                                          className={`p-2 sm:p-2 bg-[#262626] rounded-md grid grid-cols-1 w-full ${
                                            activeTab === tab.name
                                              ? ""
                                              : "hidden"
                                          }`}
                                        >
                                          <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                          >
                                            {tab?.accordions?.map(
                                              (acc, index) => (
                                                <>
                                                  {/* {acc.title}
                          {acc.content} */}
                                                  <AccordionItem
                                                    className="text-md border-0 mb-2 "
                                                    key={index}
                                                    value={index + 1}
                                                  >
                                                    <AccordionTrigger className="bg-[#131313] sm:p-2 p-2 rounded-lg text-[10px] h-[50px]  sm:text-sm">
                                                      {acc.title}
                                                    </AccordionTrigger>
                                                    <AccordionContent
                                                      id="accordians"
                                                      className="bg-[#1e1e1e] rounded-lg p-2 mt-1 text-xs sm:text-sm"
                                                    >
                                                      <div
                                                        dangerouslySetInnerHTML={{
                                                          __html: acc.content,
                                                        }}
                                                      ></div>
                                                    </AccordionContent>
                                                  </AccordionItem>
                                                </>
                                              )
                                            )}
                                          </Accordion>
                                        </div>
                                      )}
                                    </>
                                  ))}
                                  {clientData[0]?.tabs?.map((tab) => (
                                    <>
                                      {!tab?.evidences ||
                                      tab?.evidences?.length == 0 ? (
                                        <></>
                                      ) : (
                                        <div
                                          key={tab.evidences}
                                          className={`p-2 sm:p-2 bg-[#262626] rounded-md grid grid-cols-1 w-full ${
                                            activeTab === tab.name
                                              ? ""
                                              : "hidden"
                                          }`}
                                        >
                                          <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                          >
                                            {tab?.evidences?.map(
                                              (acc, index) => (
                                                <>
                                                  {/* {acc.title}
                          {acc.content} */}
                                                  <AccordionItem
                                                    className="text-md border-0 mb-2"
                                                    key={index}
                                                    value={index + 1}
                                                  >
                                                    <AccordionTrigger className="bg-[#131313] sm:p-2 p-2 rounded-lg text-[10px] h-[50px]  sm:text-sm">
                                                      {acc.title}
                                                    </AccordionTrigger>
                                                    <AccordionContent
                                                      id="accordians"
                                                      className="bg-[#1e1e1e] rounded-lg p-2 mt-1 text-xs sm:text-sm"
                                                    >
                                                      <div
                                                        dangerouslySetInnerHTML={{
                                                          __html: acc.content,
                                                        }}
                                                      ></div>
                                                    </AccordionContent>
                                                  </AccordionItem>
                                                </>
                                              )
                                            )}
                                          </Accordion>
                                        </div>
                                      )}
                                    </>
                                  ))}
                                </div>
                                {clientData[0]?.tabs?.map((tab, tabIndex) => (
                                  <>
                                    {!tab?.questions ||
                                    tab?.questions?.length === 0 ? (
                                      <></>
                                    ) : (
                                      <div
                                        key={tab.que}
                                        className={`p-3 bg-[#262626] rounded-md grid gap-2 grid-cols-1 w-full ${
                                          activeTab === tab.name ? "" : "hidden"
                                        }`}
                                      >
                                        <Accordion
                                          type="single"
                                          collapsible
                                          className="w-full"
                                        >
                                          {tab?.questions?.map(
                                            (question, questionIndex) => (
                                              <>
                                                {/* {acc.title}
                          {acc.content} */}
                                                <AccordionItem
                                                  className="text-md border-0 mb-2 w-full"
                                                  key={questionIndex}
                                                  value={questionIndex + 1}
                                                >
                                                  {/* <div className="flex w-full"> */}
                                                  <AccordionTrigger
                                                    onClick={() =>
                                                      handleAddQuestionAnswer(
                                                        tabIndex,
                                                        questionIndex
                                                      )
                                                    }
                                                    className="bg-[#131313] w-full sm:p-2 p-2 rounded-lg text-xs  sm:text-sm"
                                                  >
                                                    {question.que}
                                                  </AccordionTrigger>

                                                  {/* </div> */}

                                                  <AccordionContent
                                                    id="accordians"
                                                    className="bg-[#1e1e1e] rounded-lg p-2 mt-1 text-xs sm:text-sm"
                                                  >
                                                    {question.ans.map(
                                                      (answer, answerIndex) => (
                                                        <div className="flex flex-col">
                                                          <p
                                                            className="bg-black w-min px-4 py-2 mt-2 rounded-md text-xs sm:text-sm"
                                                            key={answerIndex}
                                                          >
                                                            {answer}
                                                          </p>
                                                        </div>
                                                      )
                                                    )}
                                                    {showInputForQuestion[
                                                      tabIndex
                                                    ]?.[questionIndex] && (
                                                      <div className="flex sm:flex-row flex-col items-start sm:items-center gap-2 mt-2">
                                                        <input
                                                          value={
                                                            newAnswer[
                                                              tabIndex
                                                            ]?.[
                                                              questionIndex
                                                            ] || ""
                                                          }
                                                          onChange={(e) =>
                                                            handleNewAnswerChange(
                                                              tabIndex,
                                                              questionIndex,
                                                              e.target.value
                                                            )
                                                          }
                                                          placeholder="Enter new answer"
                                                          type="text"
                                                          className="bg-[#1c1c1c] w-full border-2 border-[#262626] px-4 py-2 text-white rounded-md text-xs sm:text-sm"
                                                        />
                                                        <input
                                                          value={secretCode}
                                                          onChange={(e) =>
                                                            setSecretCode(
                                                              e.target.value
                                                            )
                                                          }
                                                          placeholder="Enter Security Pin"
                                                          type="text"
                                                          className="bg-[#1c1c1c] w-full border-2 border-[#262626] px-4 py-2 text-white rounded-md text-xs sm:text-sm"
                                                        />
                                                        {newAnswer != "" &&
                                                        secretCode ? (
                                                          <button
                                                            className="px-2 py-1 bg-green-500 text-white rounded-md text-xs sm:text-sm"
                                                            onClick={() =>
                                                              handleSendAnswer(
                                                                tabIndex,
                                                                questionIndex
                                                              )
                                                            }
                                                          >
                                                            Send
                                                          </button>
                                                        ) : (
                                                          <button
                                                            className="px-2 py-1 cursor-not-allowed bg-gray-700 text-gray-500 rounded-md"
                                                            disabled
                                                          >
                                                            Send
                                                          </button>
                                                        )}
                                                      </div>
                                                    )}
                                                  </AccordionContent>
                                                </AccordionItem>
                                              </>
                                            )
                                          )}
                                        </Accordion>
                                      </div>
                                    )}
                                  </>
                                ))}
                              </div>
                              <div className="w-full sm:w-[35%] bg-[#262626] rounded-md">
                                {clientData[0]?.tabs?.map((tab) => (
                                  <>
                                    {!tab?.images ||
                                    tab?.images?.length == 0 ? (
                                      <></>
                                    ) : (
                                      <div
                                        key={tab.name}
                                        className={`p-2 sm:p-3 bg-[#262626] rounded-md gap-1 grid grid-cols-1 w-full ${
                                          activeTab === tab.name ? "" : "hidden"
                                        }`}
                                      >
                                        {tab?.images?.map((imageUrl, index) => (
                                          <a
                                            target="_blank"
                                            href={imageUrl}
                                            className="hover:opacity-50"
                                          >
                                            <img
                                              key={index}
                                              src={imageUrl}
                                              alt={`Uploaded Image ${
                                                index + 1
                                              }`}
                                              className="object-cover h-auto w-full rounded-lg"
                                            />
                                          </a>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                ))}
                                {/* <br /> */}
                                {clientData[0]?.tabs?.map((tab) => (
                                  <div
                                    key={tab.name}
                                    className={`p-5 bg-[#262626] rounded-md grid gap-2 grid-cols-1 w-full ${
                                      activeTab === tab.name ? "" : "hidden"
                                    }`}
                                  >
                                    {!tab?.documents ||
                                    tab?.documents?.length === 0 ? null : (
                                      <div>
                                        {tab?.documents?.some((docUrl) =>
                                          docUrl?.includes(".mp3")
                                        ) ? (
                                          <div className="pb-5">
                                            <h4>Conversations</h4>
                                            {tab?.documents?.map(
                                              (docUrl, index) => (
                                                <div
                                                  className="relative mt-3"
                                                  key={index}
                                                >
                                                  {docUrl?.includes(".mp3") ? (
                                                    <audio controls>
                                                      <source
                                                        src={docUrl}
                                                        type="audio/mpeg"
                                                      />
                                                      Your browser does not
                                                      support the audio element.
                                                    </audio>
                                                  ) : null}
                                                </div>
                                              )
                                            )}
                                          </div>
                                        ) : null}

                                        {tab?.documents?.some(
                                          (docUrl) => !docUrl?.includes(".mp3")
                                        ) ? (
                                          <>
                                            <h4>Documents</h4>
                                            {tab?.documents
                                              ?.filter(
                                                (docUrl) =>
                                                  !docUrl?.includes(".mp3")
                                              )
                                              .map((docUrl, index) => (
                                                <div
                                                  className="relative mt-6"
                                                  key={index}
                                                >
                                                  <a
                                                    target="_blank"
                                                    href={docUrl}
                                                    className="hover:opacity-70 absolute -top-7 right-0"
                                                  >
                                                    View in new tab
                                                  </a>
                                                  <iframe
                                                    className="h-[500px] sm:h-[275px] md:h-[700px]"
                                                    title={`Uploaded Document ${
                                                      index + 1
                                                    }`}
                                                    src={docUrl}
                                                    width="100%"
                                                    height=""
                                                  ></iframe>
                                                </div>
                                              ))}
                                          </>
                                        ) : null}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* <br /> */}

                            {/* {console.log(clientData)} */}
                            {/* {clientData[0].tabs?.map((tab) => (
              <>
                {!tab?.accordions || tab?.accordions?.length == 0 ? (
                  <></>
                ) : (
                  <div
                    key={tab.accordions}
                    className={`p-3 bg-[#262626] rounded-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 w-full ${
                      activeTab === tab.name ? "" : "hidden"
                    }`}
                  >
                    <Accordion type="single" collapsible className="w-full">
                      {tab?.accordions?.map((acc, index) => (
                        <>
                          <AccordionItem
                            className="text-md border-0 mb-2"
                            key={index}
                            value={index + 1}
                          >
                            <AccordionTrigger className="bg-[#131313] p-3 rounded-lg">
                              {acc.title}
                            </AccordionTrigger>
                            <AccordionContent className="bg-[#1e1e1e] rounded-lg p-3 mt-1">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: acc.content,
                                }}
                              ></div>
                            </AccordionContent>
                          </AccordionItem>
                        </>
                      ))}
                    </Accordion>
                  </div>
                )}
              </>
            ))} */}
                            <br />
                            {/* <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md fixed bottom-4 right-4"
        onClick={handleSaveChanges}
      >
        Save Changes
      </button> */}
                            {/* {clientData[0].tabs?.map((tab) => (
              <>
                {!tab?.images || tab?.images?.length == 0 ? (
                  <></>
                ) : (
                  <div
                    key={tab.name}
                    className={`p-5 bg-[#262626] rounded-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 w-full ${
                      activeTab === tab.name ? "" : "hidden"
                    }`}
                  >
                    {tab?.images?.map((imageUrl, index) => (
                      <a
                        target="_blank"
                        href={imageUrl}
                        className="hover:opacity-50"
                      >
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`Uploaded Image ${index + 1}`}
                          className="object-cover h-[450px] w-full p-1 rounded-lg"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </>
            ))} */}
                            <br />
                            {/* {clientData[0].tabs?.map((tab) => (
              <>
                {!tab?.documents || tab?.documents?.length == 0 ? (
                  <></>
                ) : (
                  <div
                    key={tab.name}
                    className={`p-5 bg-[#262626] rounded-md grid gap-2 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 w-full ${
                      activeTab === tab.name ? "" : "hidden"
                    }`}
                  >
                    {tab?.documents?.map((docUrl, index) => (
                      <div className="relative mt-6">
                        <a
                          target="_blank"
                          href={docUrl}
                          className="hover:opacity-70 absolute -top-7 right-0"
                        >
                          View in new tab
                        </a>
                        <iframe
                          title={`Uploaded Document ${index + 1}`}
                          src={docUrl}
                          width="100%"
                          height="600px"
                        ></iframe>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ))} */}
                          </div>
                        </div>
                        {/* ... rest of the code for unlocked tab ... */}
                      </div>
                    )}
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

export default Agencies;
