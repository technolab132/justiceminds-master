import DefaultMessage from "../components/DefaultMessage";
import DetailPanel from "../components/DetailsPanel";
import Sidebar from "../components/Sidebar";
// import { createClient } from "@supabase/supabase-js";
import React, { useEffect, useState, useRef, useCallback } from 'react';
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
import debounce from 'lodash.debounce'; // Make sure to install lodash.debounce if you don't have it
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai'; // Optional: Using React Icons for search and clear icons
import { RxReset } from 'react-icons/rx';
import { Skeleton } from "../components/ui/skeleton";
import { SkeletonDetails } from "../components/ui/Skeletons";
const Home = () => {
  const router = useRouter();
  const indi = router.params?.indi;
  const [selectedName, setSelectedName] = useState();
  useEffect(() => {
    const storedData = localStorage.getItem('selectedData');
    console.log(typeof(storedData));
    if (storedData !== null && storedData !== 'null' && storedData !== '') {
      console.log('storedData', storedData);
      setSelectedName(JSON.parse(storedData));
      handleSelectName(JSON.parse(storedData));
    }
  }, []);  
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
  const [totalSentPdfAttachments, setTotalSentPdfAttachments] = useState(0);
  const [receivedEmailCount, setReceivedEmailCount] = useState(0);
  const [totalReceivedPdfAttachments, setTotalReceivedPdfAttachments] = useState(0);
  const [totalSentInnerLinks, setTotalSentInnerLinks] = useState(0);
  const [totalReceivedInnerLinks, setTotalReceivedInnerLinks] = useState(0);
  // this is step1 for creating new tab
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState();
  const [isLoading, setisLoading] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [masterData, setMasterData] = useState([]);
  const [activeNameId, setActiveNameId] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPageTokens, setNextPageTokens] = useState({
    sent: null,
    received: null,
  });
  
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

  // const handleSelectName = async (data) => {
  //   setExtractedTexts({});
  //   // setEmails([])
  //   // setNextPageToken("")
  //   // const selectedRow = emails.find((row) => row.id === ID);
  //   // // const selectedRowW = sheetdata3.find((row) => row[0] === name);
    
  //   const selectedRow = data;
  //   console.log(selectedRow)
  //   // let name = "Unknown";
  //   // let email = "Unknown";
  //   // const headers = selectedRow.payload.headers;
  //   // const fromHeader = headers.find(header => header.name.toLowerCase() === 'from');
  //   // if (fromHeader) {
  //   //   const fromParts = fromHeader.value.split('<');
  //   //   console.log(fromParts);
  //   //   name = fromParts[0].trim();
  //   //   const fromParts1 = fromParts[1].split('>');
  //   //   if(fromParts.length > 1){
  //   //     email = fromParts1[0];
  //   //   }
      
  //   // }
  //   const selectedData = {
  //     'Email': selectedRow.email,
  //     'Name': selectedRow.name,

  //   }
  //   setSelectedName(selectedData);
  //   setisLoading(true);
  //   console.log(selectedName);
  //   // console.log(selectedRow);
  //   // setSelectedNameWW(selectedRowW);
  //   // const { data, error } = supabase.from('EmailData').select('*').eq("email", )

  //   try {
  //     const Sentresponse = await fetch(' /api/filter-emails?sender='+ selectedRow.email+'&label=SENT&type=SENT');
  //     const { emails: SentEmails, error} = await Sentresponse.json();

  //     if (Sentresponse.ok) {
  //       //console.log('sent emails',emails);
  //       setSentEmails(SentEmails);
  //     } else {
  //       setError(data.error);
  //     }

  //     const Receivedresponse = await fetch(' /api/filter-emails?sender='+ selectedRow.email+'&label=INBOX&type=RECIEVE');
  //     const { emails: receivedEmails, error: semailError } = await Receivedresponse.json();

  //     if (Receivedresponse.ok) {
  //       //setEmails(data.emails);
  //      // SentEmails = data.emails;
  //       // setSentEmails(SentEmails);
  //      // console.log('sent emails',emails);
  //       //setSentEmails(SentEmails);
  //       setReceivedEmails(receivedEmails);
  //       // setIncident(IncidentData);
  //       // setMessages(Messages)
  //     } else {
  //       setError(data.error);
  //     }
      

  //     // Fetch count of sent emails
  //     const sentCountResponse = await fetch('/api/fetch-email-count?sender='+ selectedRow.email+'&type=SENT');
  //     const sentData = await sentCountResponse.json();
      
  //     if (sentCountResponse.ok) {
  //       //console.log('sent emails',emails);
  //       setSentEmailCount(sentData.count);
  //     } else {
  //       setError(data.error);
  //     }
  //     // Fetch count of received emails
  //     const receivedCountResponse = await fetch('/api/fetch-email-count?sender='+ selectedRow.email+'&type=RECIEVE');
  //     const receivedData = await receivedCountResponse.json();
  //     if (receivedCountResponse.ok) {
  //       //console.log('sent emails',emails);
  //       setReceivedEmailCount(receivedData.count);
  //     } else {
  //       setError(data.error);
  //     }
  //     if(SentEmails.length > 0){
  //       setActiveTab('sent');
  //     }else{
  //       setActiveTab('received');
  //     }

  //     // const { data: Messages, error: messageError } = await supabase
  //     //   .from('Chats')
  //     //   .select('*')
  //     //   .eq('Chat Session', selectedRow?.Name);

  //     // if (messageError) {
  //     //   console.error("messageerror", messageError);
  //     // } else {
  //     //   setMessages(Messages);
  //     // }

  //   } catch (err) {
  //     console.error('Error fetching emails:', err);
  //     setError(err.message);
  //   } finally {
  //     setisLoading(false);
  //   }

  //   // const { data: SentEmails, error: semailError } = await supabase
  //   //   .from("newtabledata")
  //   //   .select("*")
  //   //   .eq("TO", selectedRow.Email);

  //   // // Assuming 'Email' is the column name that links data between the tables
  //   // const { data: ReceivedEmails, error: remailError } = await supabase
  //   //   .from("newtabledata")
  //   //   .select("*")
  //   //   .eq("FROM", selectedRow.Email); // Assuming 'Email' is the column name that links data between the tables
  //   //   // step 2 to crete tab on dashboard and get messages or data from supabase 
    
  //   // const { data: IncidentData, error: incidenterror } = await supabase
  //   //   .from("Complaints")
  //   //   .select("*")
  //   //   .eq("complaint_for", selectedRow.Name);

  //   // if (semailError) {
  //   //   console.error("sentmaail", semailError);
  //   //   return;
  //   // }
  //   // if (remailError) {
  //   //   console.error("receivedmaail", remailError);
  //   //   return;
  //   // }
  //   // if (incidenterror) {
  //   //   console.error("incidenterror", incidenterror);
  //   //   return;
  //   // }
  //   // if (messageError) {
  //   //   console.error("messageerror", messageError);
  //   //   return;
  //   // }

  //   // setSentEmails(SentEmails);
  //   // setReceivedEmails(ReceivedEmails);
  //   // setIncident(IncidentData);
  //   // setMessages(Messages)
  //   // setisLoading(false);

  //   // console.log(sentEmails);
  // };
  // Initialize state for current page and total pages
  const [currentPage, setCurrentPage] = useState({ sent: 1, received: 1 });
  const [emailsPerPage] = useState(50); // Display 50 emails per page
  
  const handleSelectName = async (data) => {
    const selectedRow = typeof data === 'string' ? JSON.parse(data) : data;
    const selectedData = {
      'Email': selectedRow.Email || selectedRow.email,
      'Name': selectedRow.Name || selectedRow.name,
    };
    setSelectedName(selectedData);
    setisLoading(true);
    console.log(selectedData);
    // Store selectedData in localStorage
    localStorage.setItem('selectedData', JSON.stringify(selectedData));
    try {
      // Fetch the first 1000 emails for both SENT and RECEIVED
      const Sentresponse = await fetch('/api/filter-emails?sender=' + selectedData.Email + '&label=SENT&type=SENT&maxResults=1000');
      const { emails: SentEmails, nextPageToken: sentNextPageToken } = await Sentresponse.json();
  
      if (Sentresponse.ok) {
        setSentEmails(SentEmails);
      } else {
        setError(SentEmails.error);
      }
  
      const Receivedresponse = await fetch('/api/filter-emails?sender=' + selectedData.Email + '&label=INBOX&type=RECIEVE&maxResults=1000');
      const { emails: receivedEmails, nextPageToken: receivedNextPageToken } = await Receivedresponse.json();
  
      if (Receivedresponse.ok) {
        setReceivedEmails(receivedEmails);
      } else {
        setError(receivedEmails.error);
      }
  
      // Fetch count of sent and received emails
      const sentCountResponse = await fetch('/api/fetch-email-count?sender=' + selectedData.Email + '&type=SENT');
      const sentData = await sentCountResponse.json();
  
      if (sentCountResponse.ok) {
        setSentEmailCount(sentData.count);
        setTotalSentPdfAttachments(sentData.totalPdfAttachments);
        setTotalSentInnerLinks(sentData.totalInnerLinks);
      } else {
        setError(sentData.error);
      }
  
      const receivedCountResponse = await fetch('/api/fetch-email-count?sender=' + selectedData.Email + '&type=RECIEVE');
      const receivedData = await receivedCountResponse.json();
  
      if (receivedCountResponse.ok) {
        setReceivedEmailCount(receivedData.count);
        setTotalReceivedPdfAttachments(receivedData.totalPdfAttachments);
        setTotalReceivedInnerLinks(receivedData.totalInnerLinks);
      } else {
        setError(receivedData.error);
      }
  
  
      setNextPageTokens({
        sent: sentNextPageToken,
        received: receivedNextPageToken,
      });
      setCurrentPage({
        sent: 1,
        received: 1,
      });
      console.log('sentEmails',sentEmails);
      if (sentEmails.length === 0) {
        setActiveTab('received');
      } else {
        setActiveTab('sent');
      }
      console.log('active tabs',activeTab);
      //console.log('nextPageTokens',currentPage);
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError(err.message);
    } finally {
      setisLoading(false);
    }
  };
  
  // const handlePageChange = (type, page) => {
  //   const itemsPerPage = 50; // Number of emails per page
  //   const startIndex = (page - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  
  //   if (type === 'SENT') {
  //     const pageEmails = sentEmails.slice(startIndex, endIndex);
  //     setSentEmails(pageEmails);
  //   } else {
  //     const pageEmails = receivedEmails.slice(startIndex, endIndex);
  //     setReceivedEmails(pageEmails);
  //   }
  
  //   // If the page exceeds the available emails, fetch more from the API
  //   if (endIndex >= (type === 'SENT' ? sentEmails.length : receivedEmails.length)) {
  //     fetchMoreEmails(type);
  //   }
  
  //   setCurrentPage((prev) => ({ ...prev, [type.toLowerCase()]: page }));
  // };
  // const handlePageChange = (type, direction) => {
  //   setCurrentPage((prev) => {
  //     const newPage = direction === "next" ? prev[type] + 1 : prev[type] - 1;
  //     return { ...prev, [type]: newPage };
  //   });
  // };
  const paginatedSentEmails = sentEmails.slice(
    (currentPage.sent - 1) * emailsPerPage,
    currentPage.sent * emailsPerPage
  );
  
  const paginatedReceivedEmails = receivedEmails.slice(
    (currentPage.received - 1) * emailsPerPage,
    currentPage.received * emailsPerPage
  );
  
  // const fetchMoreEmails = async (type) => {
  //   const nextPageToken = nextPageTokens[type.toLowerCase()];
  //   if (!nextPageToken) return;
  //   console.log(type);
  //   try {
  //     const response = await fetch(`/api/filter-emails?sender=${selectedName.Email}&type=${type}&pageToken=${nextPageToken}&maxResults=1000`);
  //     const { emails, nextPageToken: newNextPageToken } = await response.json();
  
  //     if (response.ok) {
  //       if (type === 'SENT') {
  //         setSentEmails((prev) => [...prev, ...emails]);
  //         setNextPageTokens((prev) => ({ ...prev, sent: newNextPageToken }));
  //       } else {
  //         setReceivedEmails((prev) => [...prev, ...emails]);
  //         setNextPageTokens((prev) => ({ ...prev, received: newNextPageToken }));
  //       }
  //     } else {
  //       setError(emails.error);
  //     }
  //   } catch (err) {
  //     console.error('Error fetching more emails:', err);
  //     setError(err.message);
  //   }
  // };
  
  

  // Updated handlePageChange
const handlePageChange = async (type, direction) => {
  setCurrentPage((prev) => {
    const newPage = direction === "next" ? prev[type] + 1 : prev[type] - 1;

    // If moving to the next page and need more emails
    if (direction === "next" && newPage * emailsPerPage > (type === 'sent' ? sentEmails.length : receivedEmails.length)) {
      fetchMoreEmails(type.toUpperCase());
    }

    return { ...prev, [type]: newPage };
  });
};

// Adjusted fetchMoreEmails
const fetchMoreEmails = async (type) => {
  const nextPageToken = nextPageTokens[type.toLowerCase()];
  if (!nextPageToken) return;

  try {
    const response = await fetch(`/api/filter-emails?sender=${selectedName.Email}&type=${type}&pageToken=${nextPageToken}`);
    const { emails, nextPageToken: newNextPageToken } = await response.json();

    if (response.ok) {
      if (type === 'SENT') {
        setSentEmails((prev) => [...prev, ...emails]);
        setNextPageTokens((prev) => ({ ...prev, sent: newNextPageToken }));
      } else {
        setReceivedEmails((prev) => [...prev, ...emails]);
        setNextPageTokens((prev) => ({ ...prev, received: newNextPageToken }));
      }
    } else {
      setError(emails.error);
    }
  } catch (err) {
    console.error('Error fetching more emails:', err);
    setError(err.message);
  }
};



  
  // fetch email

  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [pageToken, setPageToken] = useState('');
  const observer = useRef();
  const initialLoad = useRef(true); // Ref to track initial load
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // Fetch search results from localStorage on component mount
  useEffect(() => {
    const storedSearchResults = localStorage.getItem('searchResults');
    if (storedSearchResults) {
      try {
        const parsedResults = JSON.parse(storedSearchResults);
        setSearchResults(parsedResults);
        setSearchActive(true); // Set search as active if there are stored results
        console.log('Search results retrieved from localStorage');
      } catch (error) {
        console.error('Error parsing stored search results:', error);
        // If there's an error parsing, clear the invalid data
        localStorage.removeItem('searchResults');
      }
    }
  }, []);
  const [searchActive, setSearchActive] = useState(false);


  // const fetchEmails = useCallback(async (token = null) => {
  //   if (loading || !hasMore || searchActive) return; // Prevent fetching if search is active
  //   try {
  //     setLoading(true);
  //     const response = await fetch(`/api/fetch-emails?label=INBOX${token ? `&pageToken=${token}` : ''}`);
  //     const data = await response.json();
  //     if (data.error === 'auth_required') {
  //       // Redirect to authentication callback
  //       const { error } = await supabase.auth.signOut();
  //       window.location.href = '/auth/login';
  //       return;
  //     }
  //     if (response.ok) {
  //       setEmails(prevEmails => {
  //         const uniqueEmails = new Map(prevEmails.map(email => [email.email, email]));
  //         data.uniqueClients.forEach(client => {
  //           if (!uniqueEmails.has(client.email)) {
  //             uniqueEmails.set(client.email, client);
  //           }
  //         });
  //         return Array.from(uniqueEmails.values());
  //       });
  //       setPageToken(data.nextPageToken); // Update with the nextPageToken from the response
  //       setHasMore(data.nextPageToken !== null);
  //     } else {
  //       setError(data.error);
  //     }
  //     setIsLoadingMore(false);
  //   } catch (err) {
  //     setLoading(false);
  //     console.error('Error fetching emails:', err);
  //     setError(err.message);
  //     setHasMore(false)
  //     return
      
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [loading, hasMore]);

  const fetchEmails = useCallback(async (token = null) => {
    if (loading || isLoadingMore || !hasMore || searchActive) return; // Prevent fetching if already loading or searching
    try {
      if (!token) setLoading(true); // Set loading true only for the first load
      else setIsLoadingMore(true); // Set isLoadingMore true for subsequent loads
  
      const response = await fetch(`/api/fetch-emails?label=INBOX${token ? `&pageToken=${token}` : ''}`);
      const data = await response.json();
  
      if (data.error === 'auth_required') {
        const { error } = await supabase.auth.signOut();
        window.location.href = '/auth/login';
        return;
      }
  
      if (response.ok) {
        setEmails(prevEmails => {
          const uniqueEmails = new Map(prevEmails.map(email => [email.email, email]));
          data.uniqueClients.forEach(client => {
            if (!uniqueEmails.has(client.email)) {
              uniqueEmails.set(client.email, client);
            }
          });
          return Array.from(uniqueEmails.values());
        });
  
        setPageToken(data.nextPageToken); // Update with the nextPageToken from the response
        setHasMore(data.nextPageToken !== null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError(err.message);
      setHasMore(false);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [loading, isLoadingMore, hasMore, searchActive]);
  
  useEffect(() => {
    if (!searchActive && initialLoad.current) {
      fetchEmails();
      initialLoad.current = false; // Set to false after the first load
    }
  }, [searchActive, fetchEmails]);
  
  const lastEmailRef = useCallback(node => {
    if (loading || isLoadingMore || searchActive) return; // Prevent fetching while searching or loading more
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchEmails(pageToken); // Fetch more emails when the observer intersects
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, isLoadingMore, hasMore, pageToken, searchActive, fetchEmails]);
  

  // useEffect(() => {
  //   if (!searchActive && initialLoad.current) {
  //     fetchEmails();
  //     initialLoad.current = false; // Set to false after the first load
  //   }
  // }, [searchActive,fetchEmails]);

  // const lastEmailRef = useCallback(node => {
  //   if (loading || searchActive) return; // Prevent fetching while searching
  
  //   if (observer.current) observer.current.disconnect();
  
  //   observer.current = new IntersectionObserver(entries => {
  //     if (entries[0].isIntersecting && hasMore) {
  //       fetchEmails(pageToken); // Fetch more emails when the observer intersects
  //     }
  //   });
  
  //   if (node) observer.current.observe(node);
  // }, [loading, hasMore, pageToken,isLoadingMore , searchActive, fetchEmails]);
  

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a name to search.');
      return;
    }
    setLoading(true);
    setError(null);
    setSearchActive(true); // Set search as active
    setHasMore(false); // Prevent infinite scroll while searching
    try {
      const authData = JSON.parse(localStorage.getItem('sb-sbyocimrxpmvuelrqzuw-auth-token'));
      const userEmail = authData.user.email;
      
      const response = await fetch(`/api/fetchby-name?name=${encodeURIComponent(searchTerm)}&userEmail=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      if (data.uniqueClients.length === 0) {
        setError('No data found.');
      } else {
        setSearchResults(data.uniqueClients); 
        // Store the search results in localStorage
        localStorage.setItem('searchResults', JSON.stringify(data.uniqueClients));
        console.log('Search results stored in localStorage');
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError('Error fetching emails.');
    } finally {
      setLoading(false);
    }
  };
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]); // Clear search results
    setSearchActive(false); // Reset search status
    setHasMore(true); // Enable infinite scroll again
    setError(null);
    // Remove searchResults from localStorage
    localStorage.removeItem('searchResults');
    console.log('Search results removed from localStorage');
    // Remove selectedData from localStorage
    localStorage.removeItem('selectedData');
    console.log('Selected data removed from localStorage');
    setSelectedName(null);
  };

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
            <div className="flex h-screen overflow-hidden pt-[60px] lg:pt-[55px] bg-white dark:bg-transparent">
              {/* Sidebar Toggle Button */}
              {/* <button
              className="p-4 text-3xl absolute"
              style={{ right: "6px", top: "4px", zIndex: "1000" }}
              onClick={toggleSidebar}
            >
              =
            </button> */}

              {/* Sidebar */}
              
              <ResizablePanelGroup direction="horizontal" className="">
                <ResizablePanel defaultSize={22} className="overflow-auto">
                  <div className={`w-[320px] ${showSidebar ? "" : "hidden"} h-full`}>
                    {showSidebar && (
                      <>
                        <div style={{ display: 'flex', width: '100%', padding: '8px 5px 2px 5px', margin: '15px 0 15px' }}>
                          <input
                            type="text"
                            placeholder="Search by name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSearch();
                              }
                            }}
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
                            onClick={handleClearSearch}
                            style={{
                              padding: "10px",
                              border: "1px solid #1c1c1c",
                              borderRadius: "5px",
                              background: "#1c1c1c", // Match the background color of the search button
                              color: "#fff", // Match the text color of the search button
                            }}
                            className="dark:bg-[#1c1c1c] bg-black text-white"
                          >
                            <RxReset size={15}></RxReset>
                            
                          </button>
                        </div>
                        {error && <p className="error">{error}</p>}
                        <Sidebar
                          data={searchActive ? searchResults : emails}
                          activeNameId={activeNameId}
                          onSelectName={handleSelectName}
                          loading={loading}
                          isLoadingMore={isLoadingMore} 
                          hasMore={hasMore}
                          lastEmailRef={lastEmailRef}
                        />
                      </>
                    )}
                  </div>
                </ResizablePanel>

                <ResizableHandle withHandle className="ress" />
                <ResizablePanel className="flex-grow overflow-y-auto" defaultSize={80}>
                  {/* Details Panel content */}
                  {isLoading ? (
                    <SkeletonDetails />
                  ) : selectedName ? (
                    <DetailPanel
                      selectedData={selectedName}
                      sentEmails={paginatedSentEmails}
                      receivedEmails={paginatedReceivedEmails}
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
                      nextPageTokens={nextPageTokens}
                      onPageChange={handlePageChange}
                      currentPage={currentPage}
                      emailsPerPage={emailsPerPage}
                      totalPages={{
                        sent: Math.ceil(sentEmailCount / emailsPerPage),
                        received: Math.ceil(receivedEmailCount / emailsPerPage),
                      }}
                      totalPdfAttachments={{
                        sent: totalSentPdfAttachments,
                        received: totalReceivedPdfAttachments,
                      }}
                      totalInnerLinks={{
                        sent: totalSentInnerLinks,
                        received: totalReceivedInnerLinks,
                      }}
                    />
                  ) : (
                    <div className="default-image-container">
                     <img src="/logomain.png" className="default-image" alt="image"/>
                    </div>
                  )}
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
