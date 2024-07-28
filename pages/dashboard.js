import DefaultMessage from "../components/DefaultMessage";
import DetailPanel from "../components/DetailsPanel";
import Sidebar from "../components/Sidebar";
// import { createClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
// import Login from "../components/Login"; // Update the path
import { setCookie } from "nookies";
import { parse } from "cookie";
import { axiosRetry } from "../components/retryAxios";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../components/Navbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable"
import EmailList from '../components/Emails';
import axios from "axios";
import withAuth from "../utils/withAuth";
import LoginPage from "./auth/login";

import { supabase } from '../utils/supabaseClient';
const Home = () => {
  const router = useRouter();
  const indi = router.params?.indi;
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
  const [sentEmailCount, setSentEmailCount] = useState(0);
  const [receivedEmailCount, setReceivedEmailCount] = useState(0);
  // this is step1 for creating new tab
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState();
  const [isLoading, setisLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [masterData, setMasterData] = useState([]);
  const [activeNameId, setActiveNameId] = useState(null);


  // const [emails, setEmails] = useState([]);
  // const [nextPageToken, setNextPageToken] = useState(null);

  // const fetchEmails = async (pageToken = null) => {
  //   try {
  //     const response = await axios.get(`/api/emails?email=${selectedName.Email}&pageToken=${pageToken || ''}`);
  //     const { emails: newEmails, nextPageToken: newNextPageToken } = response.data;

  //     setEmails(prevEmails => [...prevEmails, ...newEmails]);
  //     setNextPageToken(newNextPageToken);
  //   } catch (error) {
  //     console.error('Error fetching emails:', error);
  //   }
  // };

  // const handleLoadMore = () => {
  //   fetchEmails(nextPageToken);
  // };

  // useEffect(() => {
  //   fetchEmails();
  // }, [selectedName]);
  



  // useEffect(() => {
  //   const fetchEmails = async () => {
  //     const response = await fetch(`/api/emails?email=${selectedName.Email}`);

  //     if (response.status === 302) {
  //       const redirectUrl = response.headers.get('Location');
  //       window.location.href = redirectUrl;
  //       return;
  //     }

  //     if (!response.ok) {
  //       console.error('Failed to fetch emails');
  //       return;
  //     }

  //     const emails = await response.json();
  //     setEmails(emails);
  //   };

  //   console.log(selectedName);

  //   if(selectedName) {
  //     fetchEmails();
  //   }

  // }, [selectedName]);



  // useEffect(() => {
  //   // Parse the cookie after the page is mounted
  //   const cookies = parse(document.cookie);
  //   setIsLoggedIn(cookies.isLoggedIn === "true");
  // }, []); // Empty dependency array ensures this effect runs only once after mount

  // async function fetchAllData() {
  //   const tableName = "Clients";
  //   let offset = 0;
  //   const pageSize = 1000; // You can adjust this based on your needs.

  //   let allRows = [];

  //   while (true) {
  //     const { data, error } = await supabase
  //       .from(tableName)
  //       .select("*")
  //       .range(offset, offset + pageSize - 1);

  //     if (error) {
  //       console.error("Error fetching data:", error);
  //       break;
  //     }
  //     console.log(data);
  //     if (data.length === 0) {
  //       // No more data to fetch
  //       break;
  //     }

  //     allRows = allRows.concat(data);
  //     offset += pageSize;
  //   }

  //   return allRows;
  // }

  // useEffect(() => {
  //   // Fetch initial data from Supabase
  //   async function fetchData() {
  //     const allData = await fetchAllData();
  //     setMasterData(allData);
  //   }

  //   fetchData();
  // }, []);

  const handleExtractText = async (pdfLink, index, type) => {
    try {
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

  // const handleLogout = () => {
  //   // Set the "isLoggedIn" cookie to expire immediately
  //   setCookie(null, "isLoggedIn", "true", { maxAge: -1 });
  //   setIsLoggedIn(false);
  // };

  const handleSelectName = async (data) => {
    setExtractedTexts({});
    // setEmails([])
    // setNextPageToken("")
    // const selectedRow = emails.find((row) => row.id === ID);
    // // const selectedRowW = sheetdata3.find((row) => row[0] === name);
    
    const selectedRow = data;
    console.log(selectedRow)
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
    const selectedData = {
      'Email': selectedRow.email,
      'Name': selectedRow.name,

    }
    setSelectedName(selectedData);
    setisLoading(true);
    console.log(selectedName);
    // console.log(selectedRow);
    // setSelectedNameWW(selectedRowW);
    // const { data, error } = supabase.from('EmailData').select('*').eq("email", )

    try {
      const Sentresponse = await fetch(' /api/filter-emails?sender='+ selectedRow.email+'&label=SENT&type=SENT');
      const { emails: SentEmails, error} = await Sentresponse.json();

      if (Sentresponse.ok) {
        //console.log('sent emails',emails);
        setSentEmails(SentEmails);
        setisLoading(false);
      } else {
        setError(data.error);
      }

      const Receivedresponse = await fetch(' /api/filter-emails?sender='+ selectedRow.email+'&label=INBOX&type=RECIEVE');
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
      const sentCountResponse = await fetch('/api/fetch-email-count?sender='+ selectedRow.email+'&type=SENT');
      const sentData = await sentCountResponse.json();
      
      if (sentCountResponse.ok) {
        //console.log('sent emails',emails);
        setSentEmailCount(sentData.count);
        setisLoading(false);
      } else {
        setError(data.error);
      }
      // Fetch count of received emails
      const receivedCountResponse = await fetch('/api/fetch-email-count?sender='+ selectedRow.email+'&type=RECIEVE');
      const receivedData = await receivedCountResponse.json();
      if (receivedCountResponse.ok) {
        //console.log('sent emails',emails);
        setReceivedEmailCount(receivedData.count);
        setisLoading(false);
      } else {
        setError(data.error);
      }
      if(SentEmails.length > 0){
        setActiveTab('sent');
      }else{
        setActiveTab('received');
      }

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
    const { data: Messages, error: messageError } = await supabase
      .from('Chats')
      .select('*')
      .eq('Chat Session', selectedRow?.Name); // Assuming 'Email' is the column name that links data between the tables
      console.log(Messages);
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
    if (messageError) {
      console.error("messageerror", messageError);
      return;
    }

    // setSentEmails(SentEmails);
    // setReceivedEmails(ReceivedEmails);
    // setIncident(IncidentData);
    setMessages(Messages)
    setisLoading(false);

    // console.log(sentEmails);
  };

  // fetch email
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);




 
  // end
  useEffect(() => {
    const getEmails = async () => {
      try {
        const response = await fetch('/api/fetch-emails?label=INBOX');
        const data = await response.json();

        if (response.ok) {
          setEmails(data.uniqueClients);
        } else {
          setError(data.error);
        }
      } catch (err) {
        console.error('Error fetching emails:', err);
        setError(err.message);
      }
    };

    getEmails();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/fetchby-name?name=${searchTerm}`);
      const data = await response.json();
      setEmails(data.uniqueClients);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };



  // // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchEmailCounts = async () => {
  //     try {
  //       // Fetch count of sent emails
  //       const sentResponse = await fetch('/api/fetch-email-count?sender='+selectedData['Email']+'&type=SENT');
  //       const sentData = await sentResponse.json();
  //       setSentEmailCount(sentData.count);

  //       // Fetch count of received emails
  //       const receivedResponse = await fetch('/api/fetch-email-count?sender='+selectedData['Email']+'&type=RECIEVE');
  //       const receivedData = await receivedResponse.json();
  //       setReceivedEmailCount(receivedData.count);
  //     } catch (error) {
  //       console.error('Error fetching email counts:', error);
  //     } finally {
  //       setisLoading(false);
  //     }
  //   };

  //   fetchEmailCounts();
  // }, []);

  useEffect(() => {
    if (selectedName) {
      setActiveNameId(selectedName);
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


  
    return (
      <>
        <Head>
          <title>Justiceminds - Home - Data Driven Advocacy</title>

          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta
            property="og:title"
            content={`Justiceminds - Home - Data Driven Advocacy `}
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
            content="https://justice-minds.com"
          />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:domain"
            content="justice-minds.com"
          />
          <meta
            property="twitter:url"
            content="https://justice-minds.com/"
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
        {/* <div>
        <h1>Supabase Data Fetching Example</h1>
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.Name}</li>
          ))}
        </ul>
      </div> */}
        {/* {isLoggedIn ? ( */}
          <>
            <Navbar />
            <div className="flex h-screen overflow-hidden pt-[60px] lg:pt-[80px] bg-white dark:bg-transparent">
              {/* Sidebar Toggle Button */}
              {/* <button
              className="p-4 text-3xl absolute"
              style={{ right: "6px", top: "4px", zIndex: "1000" }}
              onClick={toggleSidebar}
            >
              =
            </button> */}

              {/* Sidebar */}
              <ResizablePanelGroup
        direction="horizontal"
        className=""
      >
  <ResizablePanel defaultSize={20}>
  <div
                className={`w-[320px]
                ${
                  showSidebar ? "" : "hidden"
                }`}
              >
                {showSidebar && (
                  <>
                  {/* <div>
        <h1>Emails</h1>
        <ul>
          {emails.map(email => (
            <li key={email.id}>
              <div>Subject: {email.subject}</div>
            </li>
          ))}
        </ul>
        {nextPageToken && (
          <button onClick={handleLoadMore}>Load More</button>
        )}
      </div> */}
                <div>
                <div style={{ display: 'flex', width: '100%',paddingLeft: '8px',paddingRight: '8px', marginTop: '15px', marginBottom:'10px',marginLeft:'1px' }}>
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      padding: "10px",
                      flex: 1,
                      marginRight: "5px",
                      border: "1px solid #1c1c1c",
                      borderRadius: "5px",
                    }}
                    className="bg-white dark:bg-black text-black dark:text-gray-600"
                  />
                  <button
                    onClick={handleSearch}
                    style={{
                      padding: "10px",
                      border: "1px solid #1c1c1c",
                      borderRadius: "5px",
                      background: "#1c1c1c",
                      color: "#fff",
                    }}
                    className="dark:bg-[#1c1c1c] bg-black text-white"
                  >
                    Search
                  </button>
                </div>
                  {loading ? (
                    <p>Loading . . .</p>
                  ) : (
                    <Sidebar
                      data={emails}
                      activeNameId={activeNameId}
                      onSelectName={handleSelectName}
                    />
                  )}
                </div>
                  {/* <Sidebar
                    data={emails}
                    activeNameId={activeNameId}
                    onSelectName={handleSelectName}
                  /> */}
                  </>
                )}
              </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="ress" />
        <ResizablePanel className="flex-grow overflow-y-auto" defaultSize={80}>
        {/* <div className=""> */}
                
                {selectedName ? (
                  <DetailPanel
                  // emaillist={emails}
                  // pageToken={nextPageToken}
                  // loadmore={handleLoadMore}
                    selectedData={selectedName}
                    sentEmails={sentEmails}
                    receivedEmails={receivedEmails}
                    sentEmailCount={sentEmailCount}
                    receivedEmailCount={receivedEmailCount}
                    onClose={handleCloseDetailPanel}
                    messages={messages}
                    loading={isLoading}
                    extractedTexts={extractedTexts}
                    setExtractedTexts={setExtractedTexts}
                    extractedUrls={extractedUrls}
                    handleExtractText={handleExtractText}
                    loadingtext={loadingtext}
                    currentlyExtractingEmailIndex={currentlyExtractingEmailIndex}
                    incident={incident}
                    publicview={false}
                    activeTabs={activeTab}
                  />
                  // <DetailPanel
                  // // emaillist={emails}
                  // // pageToken={nextPageToken}
                  // // loadmore={handleLoadMore}
                  //   selectedData={selectedName}
                  //   sentEmails={sentEmails}
                  //   receivedEmails={receivedEmails}
                  //   onClose={handleCloseDetailPanel}
                  //   messages={messages}
                  //   loading={isLoading}
                  //   extractedTexts={extractedTexts}
                  //   setExtractedTexts={setExtractedTexts}
                  //   extractedUrls={extractedUrls}
                  //   handleExtractText={handleExtractText}
                  //   loadingtext={loadingtext}
                  //   currentlyExtractingEmailIndex={currentlyExtractingEmailIndex}
                  //   incident={incident}
                  //   publicview={false}
                  // />
                ) : (
                  <>
                    {/* <DefaultMessage onlogout={handleLogout} /> */}
                  </>
                )}
              {/* </div> */}
        </ResizablePanel>
      </ResizablePanelGroup>
              

              {/* Dashboard */}
              
            </div>
          </>
        {/* // ) : (
        //   <LoginPage onSuccess={handleLoginSuccess} />
        // )} */}
      </>
    );
}
export default withAuth(Home); 
