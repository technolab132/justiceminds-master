// "use client"
// import React from 'react'
import DefaultMessage from "../../components/DefaultMessage";
import DetailPanel from "../../components/DetailsPanel";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { createClient } from "@supabase/supabase-js";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { axiosRetry } from "../../components/retryAxios";
import LoadingComponent from "../../components/LoadingComponent";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const IndividualCLient = () => {
  const router = useRouter();
  const clientID = router.query.client;
  //   const clientNAME = clientquery?.split("id=")[0];
  //   let clientID = clientquery?.split("id=")[1];
  console.log(clientID);
  const { client } = router.query;
  const queryParams = router.query; // Contains query parameters

  // Extract the parameters you need
  const selectedData = {
    Email: queryParams.Email,
    Name: queryParams.Name,
  };

  console.log('selectedData',selectedData);
  const [selectedName, setSelectedName] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sentEmails, setSentEmails] = useState([]);
  const [receivedEmails, setReceivedEmails] = useState([]);
  const [incident, setIncident] = useState([]);
  const [extractedTexts, setExtractedTexts] = useState({});
  const [extractedUrls, setExtractedUrls] = useState({});
  const [loadingtext, setLoadingText] = useState(false);
  const [currentlyExtractingEmailIndex, setCurrentlyExtractingEmailIndex] =
    useState(-1);
  const [isLoading, setisLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [masterData, setMasterData] = useState([]);
  const [activeNameId, setActiveNameId] = useState(null);
  const [sentEmailCount, setSentEmailCount] = useState(0);
  const [receivedEmailCount, setReceivedEmailCount] = useState(0);
  const [error, setError] = useState(null);
  async function fetchAllData() {
    const tableName = "Clients";
    let offset = 0;
    const pageSize = 1000;

    let allRows = [];

    while (true) {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("Email", clientID)
        .range(offset, offset + pageSize - 1);

      if (error) {
        console.error("Error fetching data:", error);
        break;
      }

      if (data.length === 0) {
        break;
      }

      allRows = allRows.concat(data);
      offset += pageSize;
    }

    return allRows;
  }
 
  // useEffect(() => {
  //   async function fetchData() {
  //     const allData = await fetchAllData();
  //     setMasterData(allData);
  //   }

  //   if (clientID) {
  //     fetchData();
  //   }
  // }, [clientID]);

  useEffect(() => {
    // Trigger handleSelectName when masterData is updated
    handleSelectName(selectedData);
    // if (masterData.length > 0 && clientID) {
    //   const foundName = masterData.find((row) => row?.Email === clientID);
    //   if (foundName) {
    //     handleSelectName(foundName?.Email);
    //   }
    // }
  }, [clientID]);

  const handleExtractText = async (pdfLink, index, type) => {
    try {
      console.log("text extract");
      setCurrentlyExtractingEmailIndex(index);
      setLoadingText(true);
      const response = await axiosRetry({
        method: "POST",
        url: "/api/extract-pdf",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ pdfUrl: pdfLink }),
      });

      if (response.status === 200) {
        const { text } = response.data;
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        // Extract URLs using the regular expression
        const urls = text?.match(urlRegex);
        // setExtractedUrls(urls);

        setExtractedUrls((prevTexts) => ({
          ...prevTexts,
          [`${type}_${index}`]: urls,
        }));
        console.log(urls);
        setExtractedTexts((prevTexts) => ({
          ...prevTexts,
          [`${type}_${index}`]: text,
        }));
      } else {
        console.error("Error extracting text:", response.statusText);
        setExtractedTexts((prevTexts) => ({
          ...prevTexts,
          [`${type}_${index}`]: "Error extracting text",
        }));
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      setExtractedTexts((prevTexts) => ({
        ...prevTexts,
        [`${type}_${index}`]: "Error extracting text",
      }));
    }
    setLoadingText(false);
    setCurrentlyExtractingEmailIndex(-1);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // ... (unchanged)
  };

  // const handleSelectName = async (ID) => {
  //   setExtractedTexts({});
  //   const selectedRow = masterData?.find((row) => row.Email === ID);

  //   if (!selectedRow) {
  //     console.error("Selected row not found");
  //     return;
  //   }

  //   setSelectedName(selectedRow);
  //   setisLoading(true);

  //   const { data: SentEmails, error: semailError } = await supabase
  //     .from("newtabledata")
  //     .select("*")
  //     .eq("TO", selectedRow?.Email);

  //   const { data: ReceivedEmails, error: remailError } = await supabase
  //     .from("newtabledata")
  //     .select("*")
  //     .eq("FROM", selectedRow?.Email);

  //   const { data: IncidentData, error: incidenterror } = await supabase
  //     .from("Complaints")
  //     .select("*")
  //     .eq("complaint_for", selectedRow?.Name);

  //   if (semailError) {
  //     console.error("sentmaail", semailError);
  //   }

  //   if (remailError) {
  //     console.error("receivedmaail", remailError);
  //   }

  //   if (incidenterror) {
  //     console.error("incidenterror", incidenterror);
  //   }

  //   setSentEmails(SentEmails || []);
  //   setReceivedEmails(ReceivedEmails || []);
  //   setIncident(IncidentData || []);
  //   setisLoading(false);
  // };

  //   useEffect(() => {
  //     if (selectedName) {
  //       setActiveNameId(selectedName.id);
  //     } else {
  //       setActiveNameId(null);
  //     }
  //   }, [selectedName]);

  const handleSelectName = async (data) => {
    setExtractedTexts({});
    // setEmails([])
    // setNextPageToken("")
    // const selectedRow = emails.find((row) => row.id === ID);
    // // const selectedRowW = sheetdata3.find((row) => row[0] === name);
    
    // const selectedRow = data;
    // console.log(selectedRow)
    // let name = "Unknown";
    // let email = "Unknown";
    // const headers = selectedRow.payload.headers;
    // const fromHeader = headers.find(header => header.name.toLowerCase() === 'from');
    // if (fromHeader) {
    //   const fromParts = fromHeader.value.split('<');
    //   console.log(fromParts);
    //   name = fromParts[0].trim();
    //   const fromParts1 = fromParts[1].split('>');
    //   if(fromParts.length > 1){
    //     email = fromParts1[0];
    //   }
      
    // }
    // const selectedData = {
    //   'Email': selectedRow.email,
    //   'Name': selectedRow.name,

    // }
    setSelectedName(selectedData);
    setisLoading(true);
    console.log(selectedName);
    // console.log(selectedRow);
    // setSelectedNameWW(selectedRowW);
    // const { data, error } = supabase.from('EmailData').select('*').eq("email", )

    try {
      const Sentresponse = await fetch(' /api/filter-emails?sender='+ selectedData.Email+'&label=SENT&type=SENT');
      const { emails: SentEmails, error} = await Sentresponse.json();

      if (Sentresponse.ok) {
        //console.log('sent emails',emails);
        setSentEmails(SentEmails);
        setisLoading(false);
      } else {
        setError(data.error);
      }

      const Receivedresponse = await fetch(' /api/filter-emails?sender='+ selectedData.Email+'&label=INBOX&type=RECIEVE');
      const { emails: receivedEmails, error: semailError } = await Receivedresponse.json();

      if (Receivedresponse.ok) {
        //setEmails(data.emails);
       // SentEmails = data.emails;
        // setSentEmails(SentEmails);
       // console.log('sent emails',emails);
        //setSentEmails(SentEmails);
        setReceivedEmails(receivedEmails);
        // setIncident(IncidentData);
        // setMessages(Messages)
        setisLoading(false);
      } else {
        setError(data.error);
      }
      

      // Fetch count of sent emails
      const sentCountResponse = await fetch('/api/fetch-email-count?sender='+ selectedData.Email+'&type=SENT');
      const sentData = await sentCountResponse.json();
      
      if (sentCountResponse.ok) {
        //console.log('sent emails',emails);
        setSentEmailCount(sentData.count);
        setisLoading(false);
      } else {
        setError(data.error);
      }
      // Fetch count of received emails
      const receivedCountResponse = await fetch('/api/fetch-email-count?sender='+ selectedData.Email+'&type=RECIEVE');
      const receivedData = await receivedCountResponse.json();
      if (receivedCountResponse.ok) {
        //console.log('sent emails',emails);
        setReceivedEmailCount(receivedData.count);
        setisLoading(false);
      } else {
        setError(data.error);
      }
      // if(SentEmails.length > 0){
      //   setActiveTab('sent');
      // }else{
      //   setActiveTab('received');
      // }

    } catch (err) {
      console.error('Error fetching emails:', err);
      setError(err.message);
    }

    // const { data: SentEmails, error: semailError } = await supabase
    //   .from("newtabledata")
    //   .select("*")
    //   .eq("TO", selectedRow.Email);

    // // Assuming 'Email' is the column name that links data between the tables
    // const { data: ReceivedEmails, error: remailError } = await supabase
    //   .from("newtabledata")
    //   .select("*")
    //   .eq("FROM", selectedRow.Email); // Assuming 'Email' is the column name that links data between the tables
    //   // step 2 to crete tab on dashboard and get messages or data from supabase 
    // const { data: Messages, error: messageError } = await supabase
    //   .from('Chats')
    //   .select('*')
    //   .eq('Chat Session', selectedRow?.Name); // Assuming 'Email' is the column name that links data between the tables
    //   console.log(Messages);
    // const { data: IncidentData, error: incidenterror } = await supabase
    //   .from("Complaints")
    //   .select("*")
    //   .eq("complaint_for", selectedRow.Name);

    // if (semailError) {
    //   console.error("sentmaail", semailError);
    //   return;
    // }
    // if (remailError) {
    //   console.error("receivedmaail", remailError);
    //   return;
    // }
    // if (incidenterror) {
    //   console.error("incidenterror", incidenterror);
    //   return;
    // }
    // if (messageError) {
    //   console.error("messageerror", messageError);
    //   return;
    // }

    // setSentEmails(SentEmails);
    // setReceivedEmails(ReceivedEmails);
    // setIncident(IncidentData);
    // setMessages(Messages)
    setisLoading(false);

    // console.log(sentEmails);
  };

  const handleCloseDetailPanel = () => {
    setSelectedName(null);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <div className="fixed top-0 z-[1000] w-full bg-[#0f0f0f] flex py-3 flex-row justify-between items-center ">
        <div className="flex items-center gap-3 ml-10">
          <img
            className="pt-1"
            src="/smalllogo.png"
            style={{ width: "60px" }}
          />
          <div className="">
            <p className="text-md sm:text-lg ">Justiceminds</p>
            <p className="text-xs sm:text-xs">Data Driven Advocacy</p>
          </div>
          {/* <div className="">
                  <p className="text-lg ">Justiceminds</p>
                  <p className="text-xs">Data Driven Advocacy</p>
                </div> */}
        </div>
        <div className="items mr-10">
          <ul className="flex gap-6">
            <li>
              <a
                className={`hover:underline sm:text-md text-xs`}
                href="mailto:advocacy@justice-minds.com"
              >
                advocacy@justice-minds.com
              </a>
            </li>

            {/* <li>
                  <a className="text-red-500" href="">
                    Logout
                  </a>
                </li> */}
          </ul>
        </div>
      </div>
      <div className="flex h-screen overflow-hidden pt-[60px] lg:pt-[80px]">
        <div className="overflow-y-auto w-full md:w-2/3 md:m-6 rounded-lg bg-[#101010] md:mx-auto">
          {selectedName ? (
            // <DetailPanel
            //   selectedData={selectedName}
            //   sentEmails={sentEmails}
            //   receivedEmails={receivedEmails}
            //   onClose={handleCloseDetailPanel}
            //   loading={isLoading}
            //   extractedTexts={extractedTexts}
            //   setExtractedTexts={setExtractedTexts}
            //   extractedUrls={extractedUrls}
            //   handleExtractText={handleExtractText}
            //   loadingtext={loadingtext}
            //   currentlyExtractingEmailIndex={currentlyExtractingEmailIndex}
            //   incident={incident}
            //   publicview={true}
            // />
            <DetailPanel
              selectedData={selectedName}
              sentEmails={sentEmails}
              receivedEmails={receivedEmails}
              sentEmailCount={sentEmailCount}
              receivedEmailCount={receivedEmailCount}
              onClose={handleCloseDetailPanel}
              // messages={messages}
              loading={isLoading}
              extractedTexts={extractedTexts}
              setExtractedTexts={setExtractedTexts}
              extractedUrls={extractedUrls}
              handleExtractText={handleExtractText}
              loadingtext={loadingtext}
              currentlyExtractingEmailIndex={currentlyExtractingEmailIndex}
              incident={incident}
              publicview={true}
            />
          ) : (
            <LoadingComponent />
          )}
        </div>
      </div>
    </>
  );
};

export default IndividualCLient;
