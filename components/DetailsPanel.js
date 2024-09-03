import React, { useEffect, useState, useRef } from "react";
import DefaultMessage from "./DefaultMessage";
import LoadingComponent from "./LoadingComponent";
import PDFViewer from "./PDFViewer";
import { axiosRetry } from "./retryAxios"; // Import the axiosRetry function
import copy from "clipboard-copy";
// import { createClient } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import Link from "next/link";
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';
import crypto from 'crypto';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import { Badge } from "../components/ui/badge"

import { Copy } from "lucide-react";
import { Button } from "../components/ui/button"
import ShadowDomWrapper from '../components/ShadowDomWrapper';
import { RxCross2, RxChevronLeft,RxChevronRight   } from "react-icons/rx";
import { SkeletonDetails } from "./ui/Skeletons";
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);
// const axios = require("axios")
const DetailPanel = ({
  // emaillist,
  // pageToken,
  // loadmore,
  selectedData,
  sentEmailCount,
  receivedEmailCount,
  sentEmails,
  receivedEmails,
  onClose,
  messages,
  loading,
  extractedTexts,
  setExtractedTexts,
  extractedUrls,
  handleExtractText,
  loadingtext,
  currentlyExtractingEmailIndex,
  incident,
  publicview,
  activeTabs,
  nextPageTokens,
  onPageChange,
  currentPage,
  totalPages,
  emailsPerPage
}) => {
 // console.log('activeTabs',typeof(activeTabs));
  const [activeTab, setActiveTab] = useState('sent');
  const handleNextPage = (type) => {
    if (currentPage[type] * emailsPerPage < (type === 'sent' ? sentEmailCount : receivedEmailCount)) {
      onPageChange(type, 'next');
    }
  };
  
  const handlePreviousPage = (type) => {
    if (currentPage[type] > 1) {
      onPageChange(type, 'previous');
    }
  };
  
  
  const [showFullMessages, setShowFullMessages] = useState({}); // State to track if the full message should be shown
  const editor = useRef(null);
  // const [loadingtext, setLoadingText] = useState(false); // State to track if
  // const [googleDriveFileId, setGoogleDriveFileId] = useState('');
  // const [extractedText, setExtractedText] = useState('');

  const [combinedPdfLinks, setCombinedPdfLinks] = useState([]);
  const [complaintLink, setComplaintLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [pdfLink, setPdfLink] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [embedLink, setEmbedLink] = useState("");
  const [embedLink2, setEmbedLink2] = useState("");

  const [masterembedlink, setMasterembedLink] = useState("");

  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const [hasLink, setHasLink] = useState(false);
  const [toggleEmbed, setToggleEmbed] = useState(false);

  useEffect(() => {
    if (editor.current) {
      // Scroll to the end of the editor content
      editor.current.selection?.scrollIntoView();
    }
  }, []);

  const handleComplaintChangeDebounced = debounce((content) => {
    setEmbedLink(content);
  }, 500);
  console.log('selected data',selectedData);
  useEffect(() => {
    setisLoading(true);
    // Fetch data from the Links table for the selected name
    

    if (selectedData["Email"]) {
      fetchData();
      setisLoading(false);
    }
    setComplaintLink(
      `https://incidents.justice-minds.com/${selectedData?.Name?.replace(
        " ",
        "%20"
      )}`
    );
    setisLoading(false);
  }, [selectedData["Email"]]);
  
  const fetchData = async() => {
    const { data, error } = await supabase
      .from("Links")
      .select("*")
      .eq("email", selectedData["Email"]);

    if (data) {
      console.log('embed link',data);
      setMasterembedLink(data);
    }

    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      // If data exists for the selected name, set hasLink to true
      setHasLink(data.length > 0);
    }
  }
  // Function to open the PDF viewer
  // const openPdfViewer = (link) => {
  //   setisLoading(true);
  //   setPdfLink(link);
  //   setShowPdfViewer(true);
  //   setTimeout(() => {
  //     setisLoading(false);
  //   }, 3000);
  //   // setisLoading(false)
  // };

  // Function to close the PDF viewer
  const closePdfViewer = () => {
    setPdfLink("");
    setShowPdfViewer(false);
    setisLoading(false);
  };

  // useEffect(() => {
  //   const sentEmailLinks = sentEmails?.map((email) => {
  //     const match = email.PDFLINK?.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  //     if (match) {
  //       return `https://drive.google.com/uc?id=${match[1]}`;
  //     }
  //     return null;
  //   });

  //   const receivedEmailLinks = receivedEmails?.map((email) => {
  //     const match = email.PDFLINK?.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  //     if (match) {
  //       return `https://drive.google.com/uc?id=${match[1]}`;
  //     }
  //     return null;
  //   });

  //   const combinedLinks = [
  //     ...(sentEmailLinks || []),
  //     ...(receivedEmailLinks || []),
  //   ].filter(Boolean);

  //   setComplaintLink(
  //     `https://incidents.justice-minds.com/${selectedData?.Name.replace(
  //       " ",
  //       "%20"
  //     )}`
  //   );
  //   setCombinedPdfLinks(combinedLinks);
  // }, [sentEmails, receivedEmails]);

  console.log(combinedPdfLinks);

  // const handleExtractText = async () => {
  //   try {
  //     // let combinedText = '';

  //     // for (const pdfLink of combinedPdfLinks) {
  //     //   const googleDriveUrl = `https://drive.google.com/uc?id=${pdfLink}`;

  //     //   const response = await axios.post('/api/extract-pdf', { pdfUrl: googleDriveUrl });

  //     //   combinedText += response.data.text + '\n';
  //     // }

  //     // setExtractedText(combinedText);

  //     // Construct the direct download link for the Google Drive file
  //     const googleDriveUrl = `https://drive.google.com/uc?id=${googleDriveFileId}`;

  //     // // Send the Google Drive URL to the API for text extraction
  //     const response = await axios.post('/api/extract-pdf', { pdfUrl: googleDriveUrl });
  //     setExtractedText(response.data.text);
  //     // console.log(combinedPdfLinks);
  //   } catch (error) {
  //     console.error('Error extracting text:', error);
  //   }
  // };
  // const handleExtractText = async (pdfLink) => {
  //   try {
  //     const response = await fetch('/api/extract-pdf', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ pdfUrl: pdfLink }),
  //     });

  //     if (response.ok) {
  //       const { text } = await response.json();
  //       setExtractedText(text);
  //     } else {
  //       console.error('Error extracting text:', response.statusText);
  //       setExtractedText('Error extracting text');
  //     }
  //   } catch (error) {
  //     console.error('Error extracting text:', error);
  //     setExtractedText('Error extracting text');
  //   }
  // };

  const handleEmbedLinkAdd = async () => {
    try {
      setisLoading(true);
      setEmbedLink("");
      const { data, error } = await supabase.from("Links").insert([
        {
          link: embedLink,
          name: selectedData["Name"],
          email: selectedData["Email"],
        },
      ]);

      if (error) {
        console.error("Error inserting data:", error.message);
        setisLoading(false);
      } else {
        console.log("Data inserted successfully:", data);
        setEmbedLink("");
        fetchData();
        setisLoading(false);
        
      }
    } catch (error) {
      console.error("Error:", error);
      setisLoading(false);
    }
    setisLoading(false);
  };

  const handleEmbedLinkAdd2 = async () => {
    try {
      setisLoading(true);
      //setEmbedLink2("");
      console.log('embedLink2',embedLink2);
      const { data, error } = await supabase.from("Links").insert([
        {
          link: `<iframe src="${embedLink2}"width="100%" height="790px" frameBorder="0" style="border: 0;"></iframe><br>`,
          name: selectedData["Name"],
          email: selectedData["Email"],
        },
      ]);

      if (error) {
        console.error("Error inserting data:", error.message);
        setisLoading(false);
      } else {
        console.log("Data inserted successfully:", data);
        setEmbedLink("");
        fetchData();
        setisLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setisLoading(false);
    }
    setisLoading(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setExtractedTexts({});
  };

  const handleClose = () => {
    onClose(); // Call the onClose function from props to reset selectedData to null
  };
  const handleCopy = () => {
    copy(complaintLink); // Call the onClose function from props to reset selectedData to null
    setIsCopied(true);

    // Reset the copied state after a few seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  const handleCopyEmb = () => {
    copy(`https://justice-minds.com/${selectedData["Email"]}`);

    setIsCopied(true);

    // Reset the copied state after a few seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleToggleMessage = (email) => {
    setShowFullMessages((prevShowFullMessages) => {
      return { ...prevShowFullMessages, [email]: !prevShowFullMessages[email] };
    });
  };

  const deleteEmbed = async (id) => {
    try {
      // Delete the embed link with the given ID from the "Links" table
      const { error } = await supabase.from("Links").delete().eq("id", id);

      if (error) {
        console.error("Error deleting embed link:", error.message);
      } else {
        // Remove the deleted embed link from the state
        setMasterembedLink((prevLinks) =>
          prevLinks.filter((link) => link.id !== id)
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
 

  // Function to fetch attachment data
  const fetchAttachment = async (emailId, attachmentId) => {
    const response = await fetch(`/api/fetch-attachments?emailId=${emailId}&attachmentId=${attachmentId}&`);
    const data = await response.json();
    console.log('fetch attachment data', data);
    return data;
  };
  const fetchAttachmentForShare = async (emailId, attachmentId,accessToken, refreshToken) => {
    const response = await fetch(`/api/fetch-attachments?emailId=${emailId}&attachmentId=${attachmentId}&token=${accessToken}&refreshToken=${refreshToken}`);
    const data = await response.json();
    console.log('fetch attachment data', data);
    return data;
  };


  // Function to convert base64 to Uint8Array
  const base64ToUint8Array = (base64) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Function to open the PDF viewer
  const openPdfViewer = (pdfData) => {
    try {
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      console.log('pdf-url',url);
      setisLoading(true);
      setPdfLink(url);
      setShowPdfViewer(true);
      setTimeout(() => {
        setisLoading(false);
      }, 3000);
      // setisLoading(false)
    } catch (error) {
      console.error('Error creating PDF blob or URL:', error);
      // Handle error appropriately
    }
  };
  const extractUrlsFromText = (text) => {
    if (typeof text === 'string') {
      const urlPattern = /(https?:\/\/[^\s]+)/g;
      return text.match(urlPattern) || [];
    }
    return [];
  };


  const [receivedBodyFormat, setReceivedBodyFormat] = useState({});
  const [sentBodyFormat, setSentBodyFormat] = useState({});
  
  // Function to handle format toggle for received emails
  const handleToggleReceivedFormat = (emailId, format) => {
    setReceivedBodyFormat(prevState => ({
      ...prevState,
      [emailId]: format
    }));
  };
  
  // Function to handle format toggle for sent emails
  const handleToggleSentFormat = (emailId, format) => {
    setSentBodyFormat(prevState => ({
      ...prevState,
      [emailId]: format
    }));
  };
  
  // Set default formats when received or sent emails change
  useEffect(() => {
    const initialReceivedFormats = receivedEmails.reduce((acc, email) => {
      acc[email.id] = 'text/plain'; // Default format
      return acc;
    }, {});
  
    setReceivedBodyFormat(prevState => ({ ...prevState, ...initialReceivedFormats }));
  }, [receivedEmails]);
  
  useEffect(() => {
    const initialSentFormats = sentEmails.reduce((acc, email) => {
      acc[email.id] = 'text/plain'; // Default format
      return acc;
    }, {});
  
    setSentBodyFormat(prevState => ({ ...prevState, ...initialSentFormats }));
  }, [sentEmails]);
  

  // for html body
  const decodeBase64UrlSafe = (str) => {
    try {
      // Handle any potential issues with padding
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(base64);
      return decodeURIComponent(escape(decoded));
    } catch (e) {
      console.error("Error decoding Base64 string", e);
      return '';
    }
  };

  // Function to find and decode the text and HTML parts
  const getBodyData = (payload) => {
    let textBody = 'No Message';
    let htmlBody = 'No Message';
    let inlineImages = {};
  
    if (!payload.parts && payload.mimeType === 'text/html') {
      htmlBody = decodeBase64UrlSafe(payload.body.data);
    } else if (payload.parts) {
      payload.parts.forEach(part => {
        if (part.mimeType === 'multipart/alternative' && part.parts) {
          part.parts.forEach(subPart => {
            if (subPart.mimeType === 'text/plain') {
              textBody = decodeBase64UrlSafe(subPart.body.data);
            } else if (subPart.mimeType === 'text/html') {
              htmlBody = decodeBase64UrlSafe(subPart.body.data);
            }
          });
        } else if (part.mimeType === 'text/plain') {
          textBody = decodeBase64UrlSafe(part.body.data);
        } else if (part.mimeType === 'text/html') {
          htmlBody = decodeBase64UrlSafe(part.body.data);
        } 
        else if (part.mimeType.startsWith('image/')) {
          const cid = part.headers.find(h => h.name.toLowerCase() === 'content-id')?.value.replace(/[<>]/g, '');
          if (cid) {
            // Assume attachmentId is a string and not a promise
            const attachmentId = part.body.attachmentId;
            if (attachmentId) {
              // Store attachmentId directly if it's a string or resolved value
              inlineImages[cid] = attachmentId; 
            }
            // You can optionally log attachmentId here for debugging
            console.log('attachmentId', attachmentId);
          }
          //inlineImages[part.headers.find(h => h.name === 'Content-ID').value] = `data:${part.mimeType};base64,${part.body.data}`;
        }
      });
    }
    htmlBody = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${htmlBody}</body></html>`;
  
    return { textBody, htmlBody, inlineImages };
  };
  
  const [recievedHtmlBodies, setRecievedHtmlBodies] = useState({});
  const [sentHtmlBodies, setSentHtmlBodies] = useState({});
  
  // Fetch and replace inline images
  useEffect(() => {
    const fetchEmailData = async () => {
      const receivedPromises = receivedEmails.map(async (email) => {
        const { htmlBody, inlineImages } = getBodyData(email.payload);
        if (Object.keys(inlineImages).length > 0) {
          const modifiedHtmlBody = await replaceInlineImages(email.id, htmlBody, inlineImages);
          return { id: email.id, body: modifiedHtmlBody };
        } else {
          return { id: email.id, body: htmlBody };
        }
      });
  
      const sentPromises = sentEmails.map(async (email) => {
        const { htmlBody, inlineImages } = getBodyData(email.payload);
        if (Object.keys(inlineImages).length > 0) {
          const modifiedHtmlBody = await replaceInlineImages(email.id, htmlBody, inlineImages);
          return { id: email.id, body: modifiedHtmlBody };
        } else {
          return { id: email.id, body: htmlBody };
        }
      });
  
      // Wait for all promises to resolve
      const receivedResults = await Promise.all(receivedPromises);
      const sentResults = await Promise.all(sentPromises);
  
      // Update state after all promises are resolved
      setRecievedHtmlBodies(receivedResults.reduce((acc, { id, body }) => {
        acc[id] = body;
        return acc;
      }, {}));
  
      setSentHtmlBodies(sentResults.reduce((acc, { id, body }) => {
        acc[id] = body;
        return acc;
      }, {}));
    };
  
    fetchEmailData();
  }, [receivedEmails, sentEmails]);
  
  // Function to fetch and replace inline images with base64 data
  const replaceInlineImages = async (emailId, html, inlineImages) => {
    if (!html) return '';

    const inlineImagePromises = Object.entries(inlineImages).map(async ([cid, attachmentId]) => {
      try {
        console.log(`Fetching attachment for CID: ${cid} with ID: ${attachmentId}`);
        if(selectedData.accessToken){
          const attachmentData = await fetchAttachmentForShare(emailId, attachmentId,selectedData.accessToken,selectedData.refreshToken);
          const base64Data = attachmentData.data.replace(/-/g, '+').replace(/_/g, '/');
          inlineImages[cid] = `data:image/png;base64,${base64Data}`;
          console.log(`Successfully fetched and replaced image for CID: ${cid}`);
        }else{
          const attachmentData = await fetchAttachment(emailId, attachmentId);
          const base64Data = attachmentData.data.replace(/-/g, '+').replace(/_/g, '/');
          inlineImages[cid] = `data:image/png;base64,${base64Data}`;
          console.log(`Successfully fetched and replaced image for CID: ${cid}`);
        }
      } catch (error) {
        console.error(`Error fetching image with CID: ${cid}`, error);
      }
    });

    await Promise.all(inlineImagePromises);

    return html.replace(/<img[^>]+src="cid:([^">]+)"/g, (match, cid) => {
      const imageData = inlineImages[cid];
      if (imageData) {
        return `<img src="${imageData}"`;
      } else {
        console.warn(`No image data found for CID: ${cid}`);
        return match;
      }
    });
  };

  const [isOpenAccordion, setIsOpenAccordion] = useState(null);

  const toggleAccordion = (emailId) => {
    setIsOpenAccordion(isOpenAccordion === emailId ? null : emailId);
  };


  

  // Encryption setup
  const algorithm = 'aes-256-cbc';
  const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET; // Store your 32-byte secret key in environment variables
  const iv = crypto.randomBytes(16);

  function encryptData(data) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    let encrypted = cipher.update(JSON.stringify(data));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  
  const [shareableLink, setShareableLink] = useState();
  const handleShareClick = async () => {
    try {
      // Example emailId, adjust according to your data
      const data = await localStorage.getItem('sb-sbyocimrxpmvuelrqzuw-auth-token');
      const userData = JSON.parse(data);
      console.log('data',userData);
      const emailId = userData.user.email;
      
      // Generate a shareable link
      const link = await generateShareableLink(emailId);
      setShareableLink(link);
      // Copy link to clipboard
      console.log(link)
      console.log('shareableLink',shareableLink);
      // navigator.clipboard.writeText(shareableLink);
      // alert('Shareable link copied to clipboard!');
      // window.open(shareableLink,'_blank');
    } catch (error) {
      console.error('Error generating shareable link:', error);
    }
  };

  const generateShareableLink = async (emailId) => {
    // Call your API to create a token and get the shareable link
    const response = await fetch('/api/createShareableLink', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedData),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error);

    return result.shareableLink;
  };

  // const handleUploadPDF = async () => {
  //   try {
  //     // Open file dialog to select PDF
  //     const file = await selectPDFFile(); // Implement file selection logic
  
  //     if (file) {
  //       // Upload PDF to Supabase
  //       console.log('supabase.storage',supabase.storage);
  //       const { data, error } = await supabase.storage
  //         .from('pdfs') // Replace 'pdfs' with your Supabase storage bucket name
  //         .upload(`public/${file.name}`, file);
  //       console.log('error',error);
  //       if (error) throw error;
  
  //       // Retrieve public URL of the uploaded file
  //       const { publicURL, error: urlError } = supabase
  //         .storage
  //         .from('pdfs')
  //         .getPublicUrl(`public/${file.name}`);
  //       console.log('publicURL',publicURL);
  //       if (urlError) throw urlError;
  //       const { pdfData, pdfError } = await supabase.from("Links").insert([
  //         {
  //           link: `<iframe src=${publicURL} width="100%" height="790px" frameBorder="0" style="border: 0;"></iframe><br>`,
  //           name: selectedData["Name"],
  //           email: selectedData["Email"],
  //         },
  //       ]);
  //       console.log('pdfData',pdfData);
  //       // Call handleEmbedLinkAdd2 with the retrieved PDF link
  //      // handleEmbedLinkAdd2(publicURL);
  //     }
  //   } catch (error) {
  //     console.error('Error uploading PDF:', error.message);
  //   }
  // };
  
  // Utility to select PDF file
  const getPdfUrl = async (file) => {
    console.log('file',file.name);
    const { data, error } = await supabase.storage.from('pdfs').getPublicUrl(`public/${file.name}`);
    console.log('publicURL',data);
    if (error) throw error;
    return data.publicUrl
  }
  const handleUploadPDF = async () => {
    try {
      // Open file dialog to select PDF
      const file = await selectPDFFile(); // Implement file selection logic
      setisLoading(true);
      if (file) {
        // Upload PDF to Supabase
        console.log('supabase.storage',supabase.storage);
        const { data, error } = await supabase.storage
          .from('pdfs') // Replace 'pdfs' with your Supabase storage bucket name
          .upload(`public/${file.name}`, file);
        console.log('error',error);
        if (error) throw error;
        const url = await getPdfUrl(file);
        // Retrieve public URL of the uploaded file
        console.log('url',url);
        const { pdfData, pdfError } = await supabase.from("Links").insert([
          {
            link: `<iframe src=${url} width="100%" height="790px" frameBorder="0" style="border: 0;"></iframe><br>`,
            fileName: file.name,
            name: selectedData["Name"],
            email: selectedData["Email"],
          },
        ]);
        console.log('pdfData',pdfData);
        fetchData();
        // Call handleEmbedLinkAdd2 with the retrieved PDF link
       // handleEmbedLinkAdd2(publicURL);
      }
      setisLoading(false);
      
    } catch (error) {
      setisLoading(false);
      console.error('Error uploading PDF:', error.message);
    }
  };
  const selectPDFFile = () => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/pdf';
      input.onchange = (e) => resolve(e.target.files[0]);
      input.click();
    });
  };
  const deleteEmbedForPdf = async (id, fileName) => {
    try {
      // Delete the embed link with the given ID from the "Links" table
      setisLoading(true);
      const { error: deleteError } = await supabase.from("Links").delete().eq("id", id);
  
      if (deleteError) {
        console.error("Error deleting embed link:", deleteError.message);
        return;
      }
  
      // If link deletion is successful, delete the corresponding file from Supabase storage
      const { error: storageError } = await supabase.storage.from('pdfs').remove([`public/${fileName}`]);
      //console.log('error',error);
      if (storageError) {
        console.error("Error deleting file from storage:", storageError.message);
      } else {
        // Remove the deleted embed link from the state
        setMasterembedLink((prevLinks) => prevLinks.filter((link) => link.id !== id));
        fetchData();
      }
      setisLoading(false);
    } catch (error) {
      setisLoading(false);
      console.error("Error:", error.message);
    }
  };
  
  return (
    <div style={{ lineHeight: "2rem", overflowY: "scroll", height: "90vh" }}>
      {showPdfViewer && (
        <PDFViewer
          pdfLink={pdfLink}
          onClose={closePdfViewer}
          loading={isLoading}
        />
      )}
      <div
        style={{
          padding: "30px",
          // borderBottom: "2px solid #424242",
          fontSize: "17px",
        }}
      >
        {publicview === false && (
          <button
            style={{
              position: "absolute",
              right: "60px",
              top: "90px",
              zIndex: "1000",
            }}
            onClick={handleClose}
          >
            <RxCross2 />
          </button>
        )}

        {publicview === false && (
          <>
            {/* <button className="dark:text-white text-[#1d1d1d] px-8 py-2 cursor-pointer dark:bg-[#1d1d1d] bg-[#e9e9e9]  rounded-md" variant="outline" onClick={handleShareClick}>
              Share
            </button>
            <br />
            <br /> */}
           <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="dark:text-white text-[#1d1d1d] px-8 py-2 cursor-pointer dark:bg-[#1d1d1d] bg-[#e9e9e9]  rounded-md" variant="outline" onClick={handleShareClick}>
                  Share
                </button>
                
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Share link</AlertDialogTitle>
                  <AlertDialogDescription>
                    Anyone who has this link will be able to view this.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <label htmlFor="link" className="sr-only">
                      Link
                    </label>
                    <input
                      id="link"
                      class="text-black dark:text-black"
                      value={shareableLink}
                      readOnly
                    />
                  </div>
                  <button
                    type="button"
                    size="sm"
                    className="px-3"
                    onClick={() => navigator.clipboard.writeText(shareableLink)}
                  >
                    <span className="sr-only">Copy</span>
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    <button type="button" variant="secondary">
                      Close
                    </button>
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <br />
            <br />
            {/* Consent Form Dialog */}
            
            {/* <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="dark:text-white text-[#1d1d1d] px-8 py-2 cursor-pointer dark:bg-[#1d1d1d] bg-[#e9e9e9]  rounded-md" variant="outline">Share</button>
              </AlertDialogTrigger>
              
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Share</AlertDialogTitle>
                  <AlertDialogDescription>
                    By agreeing, you consent that your data will be encrypted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction
                    onClick={handleShareClick}
                  >
                    Agree and Share
                  </AlertDialogAction>
                  <AlertDialogCancel>
                    <button type="button" variant="secondary">
                      Cancel
                    </button>
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
                
            </AlertDialog> */}
        </>
        )}

        <p className="text-black dark:text-white">
          <span className="dark:text-[#d5d5d5] text-[#828282]">Name</span> :{" "}
          {selectedData["Name"]}
        </p>
        <p className="text-black dark:text-white">
          <span className="dark:text-[#d5d5d5] text-[#828282]">Company</span> :{" "}
          {selectedData["Name"]}
        </p>
        <p className="text-black dark:text-white">
          <span className="dark:text-[#d5d5d5] text-[#828282]">Email</span> :{" "}
          {selectedData["Email"]}
        </p>
        <p className="text-black dark:text-white">
          <span className="dark:text-[#d5d5d5] text-[#828282]">Phone</span> :{" "}
          {/* {selectedData["Phone"]} */} ---
        </p>
        <div>
          {loading ? (
            <span>Loading . . .</span>
          ) : (
            <>
              <p className="text-black dark:text-white">
                <span className="dark:text-[#d5d5d5] text-[#828282]">Email Sent</span> :
                <span> {sentEmailCount}</span>
              </p>

              <p className="text-black dark:text-white">
                <span className="dark:text-[#d5d5d5] text-[#828282]">Email Received</span> :
                <span> {receivedEmailCount}</span>
              </p>
              <p className="text-black dark:text-white">
                <span className="dark:text-[#d5d5d5] text-[#828282]">Total Email</span> :
                <span> {sentEmailCount + receivedEmailCount}</span>
              </p>
              {sentEmails.length > 0 && (
                <>
                  <p className="text-black dark:text-white">
                    <span className="dark:text-[#d5d5d5] text-[#828282]">Date of First Email Sent</span>:
                    {loading ? (
                      <span> Fetching . . . </span>
                    ) : (
                      <span className="">
                        {new Date(
                          sentEmails[sentEmails.length - 1]?.payload.headers.find(header => header.name === 'Date')?.value
                        ).toLocaleString()}
                      </span>
                    )}
                  </p>
                  <p className="text-black dark:text-white">
                    <span className="dark:text-[#d5d5d5] text-[#828282]">Date of Last Email Sent</span>:
                    {loading ? (
                      <span> Fetching . . . </span>
                    ) : (
                      <span>
                        {new Date(
                          sentEmails[0]?.payload.headers.find(header => header.name === 'Date')?.value
                        ).toLocaleString()}
                      </span>
                    )}
                  </p>
                </>
              )}

              {/* Additional UI components */}
              {publicview === true ? (
                <></>
              ) : (
                <>
                  <div className="flex items-center pt-10">
                    <button
                      className="dark:text-white text-black px-8 py-2 cursor-pointer dark:bg-[#1d1d1d] bg-[#e9e9e9] rounded-md"
                      onClick={handleCopy}
                    >
                      Copy Incident Link
                    </button>
                    <span className="text-green-600 px-2">
                      {isCopied && <p>✅ Link copied to clipboard!</p>}
                    </span>
                  </div>
                  <a href={complaintLink} className="text-gray-600">
                    {complaintLink}
                  </a>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <div>
            <div
              className="rounded-md flex gap-1 flex-wrap pb-2  top-0"
              style={{
                borderBottom: "2px solid #1c1c1c",
                marginBottom: "30px",
              }}
            >
              {sentEmails.length > 0 && (
                <button
                  className={`rounded-md px-2 py-1 border-1 border dark:border-[#393939] border-[#c8c8c8] ${
                    activeTab === "sent"
                      ? "dark:text-white dark:bg-[#262626] text-black bg-[#ededed]"
                      : "dark:text-[#adadad] text-gray-500"
                  }`}
                  onClick={() => handleTabChange("sent")}
                >
                  Sent Emails
                </button>
              )}
              {receivedEmails.length > 0 && (
                <button
                  className={`rounded-md px-2 py-1 border-1 border dark:border-[#393939] border-[#c8c8c8] ${
                    activeTab === "received"
                    ? "dark:text-white dark:bg-[#262626] text-black bg-[#ededed]"
                    : "dark:text-[#adadad] text-gray-500"
                  }`}
                  onClick={() => handleTabChange("received")}
                >
                  Received Emails
                </button>
              )}
              {(sentEmails.length > 0 || receivedEmails.length > 0) && (
                <button
                  className={`rounded-md px-2 py-1 border-1 border dark:border-[#393939] border-[#c8c8c8] ${
                    activeTab === "pdflinks"
                    ? "dark:text-white dark:bg-[#262626] text-black bg-[#ededed]"
                    : "dark:text-[#adadad] text-gray-500"
                  }`}
                  onClick={() => handleTabChange("pdflinks")}
                >
                  Attachments
                </button>
              )}
              {(sentEmails.length > 0 || receivedEmails.length > 0) && (
                <button
                  className={`rounded-md px-2 py-1 border-1 border dark:border-[#393939] border-[#c8c8c8] ${
                    activeTab === "innerlinks"
                    ? "dark:text-white dark:bg-[#262626] text-black bg-[#ededed]"
                    : "dark:text-[#adadad] text-gray-500"
                  }`}
                  onClick={() => handleTabChange("innerlinks")}
                >
                  All Inner Links
                </button>
              )}
              {incident.length > 0 && (
                <button
                  className={`rounded-md px-2 py-1 border-1 border dark:border-[#393939] border-[#c8c8c8] ${
                    activeTab === "incidents"
                    ? "dark:text-white dark:bg-[#262626] text-black bg-[#ededed]"
                    : "dark:text-[#adadad] text-gray-500"
                  }`}
                  onClick={() => handleTabChange("incidents")}
                >
                  Incidents
                </button>
              )}
              {masterembedlink.length >= 0 && (
                <button
                  className={`rounded-md px-2 py-1 border-1 border dark:border-[#393939] border-[#c8c8c8] ${
                    activeTab === "embed"
                    ? "dark:text-white dark:bg-[#262626] text-black bg-[#ededed]"
                    : "dark:text-[#adadad] text-gray-500"
                  }`}
                  onClick={() => handleTabChange("embed")}
                >
                  Embed Links
                </button>
              )}
              {messages?.length > 0 && (
                <button
                  className={`rounded-md px-2 py-1 border-1 border dark:border-[#393939] border-[#c8c8c8] ${
                    activeTab === "messages"
                    ? "dark:text-white dark:bg-[#262626] text-black bg-[#ededed]"
                    : "dark:text-[#adadad] text-gray-500"
                  }`}
                  onClick={() => handleTabChange("messages")}
                >
                  WhatsApp
                </button>
              )}
            </div>

            <div style={{ padding: "0px 30px 30px 30px" }}>
              {activeTab === "sent" && (
                <>
                  <ul className="">
                    
                    {sentEmails.map((email, index) => {
                      const headers = email.payload.headers;
                      const fromHeader = headers.find(header => header.name === 'From');
                      const toHeader = headers.find(header => header.name === 'To');
                      const subjectHeader = headers.find(header => header.name === 'Subject');
                      const dateHeader = headers.find(header => header.name === 'Date');
                      const bodyPart = email.payload?.parts?.find(part => part.mimeType === 'text/plain' || part.mimeType === 'text/html');
                      //const bodyData = bodyPart ? atob(bodyPart.body.data.replace(/-/g, '+').replace(/_/g, '/')) : 'No Message';
                      const pdfPart = email.payload?.parts?.find(part => part.mimeType === 'application/pdf');
                      const pdfAttachmentId = pdfPart ? pdfPart.body.attachmentId : null;
                      const emailId = email.id;// headers.find(header => header.name === 'Message-ID')?.value;
                      console.log('emailid',emailId);
                      console.log('pdfData',email.pdfData);
                      // Get the body data from the email payload
                      // Get the body data from the email payload
                      const { textBody } = getBodyData(email.payload);
                      console.log('sentHtmlBodies',sentHtmlBodies);
                      const bodyData = sentBodyFormat[emailId] === 'text/html' ? sentHtmlBodies[emailId] || 'Loading...' : textBody;

                      const handleViewPdf = async () => {
                        if (pdfAttachmentId) {
                          try {
                            if(selectedData.accessToken){
                              const attachmentData = await fetchAttachmentForShare(emailId, pdfAttachmentId,selectedData.accessToken,selectedData.refreshToken);
                              const pdfData = base64ToUint8Array(attachmentData.data.replace(/-/g, '+').replace(/_/g, '/'));
                              openPdfViewer(pdfData);
                              
                            }else{
                              const attachmentData = await fetchAttachment(emailId, pdfAttachmentId);
                              const pdfData = base64ToUint8Array(attachmentData.data.replace(/-/g, '+').replace(/_/g, '/'));
                              openPdfViewer(pdfData);
                            }
                            
                          } catch (error) {
                            console.error('Error fetching or decoding PDF:', error);
                            // Handle error appropriately, e.g., show error message to user
                          }
                        }
                      };
                      const urlsInBody = extractUrlsFromText(bodyData);
                      console.log('urls',urlsInBody);
                      return (
                        <Accordion key={index} type={"single"} collapsible className="w-full">
                          <AccordionItem className="text-md border-0 mb-2" value={index + 1}>
                            <div className="flex justify-between gap-2">
                              <table className="">
                                <tbody>
                                  <tr className="text-sm">
                                    <td className="w-[15%] min-w-2xl dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                                      {new Date(dateHeader.value).toLocaleString()}
                                    </td>
                                    <td className="w-[65%] dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                                      <div className="flex justify-between items-center">
                                        <span>{subjectHeader.value}</span>
                                        {pdfAttachmentId && (
                                          <Badge variant="secondary">Attachments</Badge>
                                        )}
                                      </div>
                                    </td>
                                    
                                  </tr>
                                </tbody>
                              </table>
                              <AccordionTrigger className="dark:bg-[#1c1c1c] bg-[#eeeeee] text-gray-500 p-3 rounded-lg w-full"></AccordionTrigger>
                            </div>
                            <AccordionContent className="p-1 mt-2 dark:bg-[#121212] rounded-lg">
                              <li className="rounded-md dark:bg-[#111111] bg-white text-gray-500" style={{ padding: "20px", marginBottom: "20px" }} key={index}>
                                <strong className="dark:text-[#d5d5d5] text-[#828282] py-1.5">From: </strong> {fromHeader.value} <br />
                                <strong className="dark:text-[#d5d5d5] text-[#828282]">To: </strong> {toHeader.value} <br /><br />
                                
                                {pdfAttachmentId && (
                                  <>
                                    <strong className="dark:text-[#d5d5d5] text-[#828282] py-1.5">PDF: </strong>
                                    <button onClick={handleViewPdf}> View PDF</button>
                                    <br /><br />
                                  </>
                                )}
                                
                                {`--------------------------------`}
                                <br />
                                <strong className="dark:text-[#d5d5d5] text-[#828282] py-1.5">Message: </strong>
                                <div className="flex gap-2 mb-2 mt-2">
                                  <button
                                    onClick={() => handleToggleSentFormat(email.id, 'text/plain')}
                                    className={`p-2 rounded ${sentBodyFormat[email.id] === 'text/plain' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                  >
                                  Show Text
                                  </button>
                                  <button
                                    onClick={() => handleToggleSentFormat(email.id, 'text/html')}
                                    className={`p-2 rounded ${sentBodyFormat[email.id] === 'text/html' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                  >
                                    Show HTML
                                  </button>
                                </div>
                                <br />
                                <strong className="dark:text-[#d5d5d5] text-[#828282] mt-2 mb-2 py-1.5">Date: </strong>  {new Date(dateHeader.value).toLocaleString()} <br />
                                <br />
                                <div className="dark:bg-black bg-white" style={{ padding: 20, marginTop: 5, borderRadius: "10px" }}>
                                  
                                  {sentBodyFormat[emailId] === 'text/plain' ? (
                                    <p className="text-black dark:text-white" style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                                      {bodyData}
                                    </p>
                                  ) : (              
                                    <ShadowDomWrapper htmlContent={bodyData} />
                                  )}
                                </div>
                                
                                {extractedTexts[`sent_${index}`] && (
                                  <div className="dark:bg-black bg-white" style={{ padding: 20, marginTop: 10, borderRadius: "10px" }}>
                                    {extractedUrls[`sent_${index}`] ? (
                                      <>
                                        <p className="text-green-500 text-xl">Links Found in the Mail . . .</p>
                                        {`------------------`}
                                        {extractedUrls[`sent_${index}`]?.map((url) => (
                                          <p key={url} style={{ whiteSpace: "pre-wrap", color: "#fff" }}>
                                            <a target="_blank" className="underline" href={url}>{url}</a><br />
                                          </p>
                                        ))}
                                        {`------------------`}
                                      </>
                                    ) : (
                                      <>
                                        <p className="text-xl text-yellow-500">No Inner Links Found . . .</p>
                                        {`------------------`}
                                      </>
                                    )}
                                    <p className="text-black dark:text-white" style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", marginTop: "-60px", marginBottom: "50px" }}>
                                      {extractedTexts[`sent_${index}`]}
                                    </p>
                                  </div>
                                )}
                                {currentlyExtractingEmailIndex === index && loadingtext && <p>Loading . .</p>}
                                <br />
                              </li>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      );
                    })}
                    {/* <div className="pagination-controls flex justify-between items-center mt-4">
                      <button
                        onClick={() => handlePreviousPage("sent")}
                        disabled={currentPage["sent"] === 1}
                        className={`p-2 rounded ${currentPage["sent"] === 1 ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                      >
                        Previous
                      </button>
                      <span className="text-gray-700">
                        Page {currentPage["sent"]} of {sentEmailCount}
                      </span>
                      <button
                        onClick={() => handleNextPage("sent")}
                        disabled={!nextPageTokens["sent"]}
                        className={`p-2 rounded ${!nextPageTokens["sent"] ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                      >
                        Next
                      </button>
                    </div> */}
                     {activeTab === "sent" && sentEmailCount > emailsPerPage && (
                      <div className="pagination-controls flex justify-between items-center mt-4">
                        <button
                          onClick={() => handlePreviousPage("sent")}
                          disabled={currentPage["sent"] === 1}
                          className={`p-2 rounded ${currentPage["sent"] === 1 ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                        >
                          <RxChevronLeft />
                        </button>
                        <span className="text-gray-700">
                          Page {currentPage["sent"]} of {Math.ceil(sentEmailCount / emailsPerPage)}
                        </span>
                        <button
                          onClick={() => handleNextPage("sent")}
                          disabled={currentPage["sent"] * emailsPerPage >= sentEmailCount && !nextPageTokens["sent"]}
                          className={`p-2 rounded ${currentPage["sent"] * emailsPerPage >= sentEmailCount && !nextPageTokens["sent"] ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                        >
                          <RxChevronRight />
                        </button>
                      </div>
                     )}
                  </ul>
                  
                </>
              )}
              {activeTab === "received" && (
                <ul className="">
                  {receivedEmails.map((email, index) => {
                    const headers = email.payload.headers;
                    const fromHeader = headers.find(header => header.name === 'From');
                    const toHeader = headers.find(header => header.name === 'To');
                    const subjectHeader = headers.find(header => header.name === 'Subject');
                    const dateHeader = headers.find(header => header.name === 'Date');
                    const bodyPart = email.payload?.parts?.find(part => part.mimeType === 'text/plain' || part.mimeType === 'text/html');
                    //const bodyData = bodyPart ? atob(bodyPart.body.data.replace(/-/g, '+').replace(/_/g, '/')) : 'No Message';
                    const pdfPart = email.payload?.parts?.find(part => part.mimeType === 'application/pdf');
                    const pdfAttachmentId = pdfPart ? pdfPart.body.attachmentId : null;
                    const emailId = email.id;//headers.find(header => header.name === 'Message-ID').value;

                    
                    

                    // Get the body data from the email payload
                    const { textBody } = getBodyData(email.payload);
                    const bodyData = receivedBodyFormat[emailId] === 'text/html' ? recievedHtmlBodies[emailId] || 'Loading...' : textBody;
                    console.log('emailid',emailId);
                    const handleViewPdf = async () => {
                      if (pdfAttachmentId) {
                        try {
                          if(selectedData.accessToken){
                            const attachmentData = await fetchAttachmentForShare(emailId, pdfAttachmentId,selectedData.accessToken,selectedData.refreshToken);
                            const pdfData = base64ToUint8Array(attachmentData.data.replace(/-/g, '+').replace(/_/g, '/'));
                            openPdfViewer(pdfData);
                            
                          }else{
                            const attachmentData = await fetchAttachment(emailId, pdfAttachmentId);
                            const pdfData = base64ToUint8Array(attachmentData.data.replace(/-/g, '+').replace(/_/g, '/'));
                            openPdfViewer(pdfData);
                          }
                        } catch (error) {
                          console.error('Error fetching or decoding PDF:', error);
                          // Handle error appropriately, e.g., show error message to user
                        }
                      }
                    };
                    const urlsInBody = extractUrlsFromText(bodyData);
                    console.log('urls',urlsInBody);
                    const shortenUrl = (url) => {
                      try {
                        const urlObj = new URL(url);
                        return urlObj.hostname;
                      } catch (error) {
                        console.error('Invalid URL:', url, error);
                        return url; // Fallback to original URL if invalid
                      }
                    };
                    
                    
                    return (
                      <Accordion key={index} type={"single"} collapsible className="w-full">
                        <AccordionItem className="text-md border-0 mb-2" value={index + 1}>
                          <div className="flex justify-between gap-2">
                            <table className="">
                              <tbody>
                                <tr className="text-sm">
                                  <td className="w-[15%] min-w-2xl dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                                    {new Date(dateHeader.value).toLocaleString()}
                                  </td>
                                  <td className="w-[65%] dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                                    <div className="flex justify-between items-center">
                                      <span>{subjectHeader.value}</span>
                                      {pdfAttachmentId && (
                                        <Badge variant="secondary">Attachments</Badge>
                                      )}
                                    </div>
                                  </td>
                                  
                                </tr>
                              </tbody>
                            </table>
                            <AccordionTrigger className="dark:bg-[#1c1c1c] bg-[#eeeeee] text-gray-500 p-3 rounded-lg w-full"></AccordionTrigger>
                          </div>
                          <AccordionContent className="p-1 mt-2 dark:bg-[#121212] rounded-lg">
                            <li className="rounded-md dark:bg-[#111111] bg-white text-gray-500" style={{ padding: "20px", marginBottom: "20px" }} key={index}>
                              <strong className="dark:text-[#d5d5d5] text-[#828282] py-1.5">From: </strong> {fromHeader?.value} <br />
                              <strong className="dark:text-[#d5d5d5] text-[#828282]">To: </strong> {toHeader?.value} <br /><br />
                              {pdfAttachmentId && (
                                <>
                                  <strong className="dark:text-[#d5d5d5] text-[#828282] py-1.5">PDF: </strong>
                                  <button onClick={handleViewPdf}> View PDF</button>
                                  <br /><br />
                                </>
                              )}
                              
                              {`--------------------------------`}
                              <br />
                              <strong className="dark:text-[#d5d5d5] text-[#828282] py-1.5">Message: </strong>
                              <div className="flex gap-2 mb-2">
                                <button
                                  onClick={() => handleToggleReceivedFormat(email.id, 'text/plain')}
                                  className={`p-2 rounded ${receivedBodyFormat[email.id] === 'text/plain' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                >
                                  Show Text
                                </button>
                                <button
                                  onClick={() => handleToggleReceivedFormat(email.id, 'text/html')}
                                  className={`p-2 rounded ${receivedBodyFormat[email.id] === 'text/html' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                >
                                  Show HTML
                                </button>
                              </div>
                              <br />
                              <strong className="dark:text-[#d5d5d5] text-[#828282] mt-2 mb-2 py-1.5">Date: </strong>  {new Date(dateHeader.value).toLocaleString()} <br />
                              <br />
                              <div className="dark:bg-black bg-white" style={{ padding: 20, marginTop: 10, borderRadius: "10px" }}>
                                {/* {urlsInBody && urlsInBody.length > 0 && (
                                  <>
                                    <p className="text-green-500 text-xl">Links Found in the Mail . . .</p>
                                    {`------------------`}
                                    {urlsInBody.map((url, urlIndex) => (
                                      <p key={urlIndex} style={{ whiteSpace: "pre-wrap", color: "#fff" }}>
                                        <a target="_blank" className="underline" href={url}>
                                          {shortenUrl(url)}
                                        </a><br />
                                      </p>
                                    ))}
                                    {`------------------`}
                                  </>
                                )} */}
                                {receivedBodyFormat[emailId] === 'text/plain' ? (
                                  <p className="text-black dark:text-white" style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                                    {bodyData}
                                  </p>
                                ) : (
                                  <ShadowDomWrapper htmlContent={bodyData} />
                                )}
                              </div>
                              <br />
                            </li>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    );
                  })}
                  {activeTab === "received" && receivedEmailCount > emailsPerPage && (
                    <div className="pagination-controls flex justify-between items-center mt-4">
                      <button
                        onClick={() => handlePreviousPage("received")}
                        disabled={currentPage["received"] === 1}
                        className={` ${currentPage["received"] === 1 ? 'dark:bg-[#262626] bg-[#eeeeee] text-gray-700  p-3 rounded-lg cursor-not-allowed' : 'dark:bg-[#262626] bg-[#eeeeee] text-gray-500 p-3 rounded-lg '}`}
                      >
                        <RxChevronLeft />
                      </button>
                      <span className="text-gray-600">
                        Page {currentPage["received"]} of {Math.ceil(receivedEmailCount / emailsPerPage)}
                      </span>
                      <button
                        onClick={() => handleNextPage("received")}
                        disabled={currentPage["received"] * emailsPerPage >= receivedEmailCount && !nextPageTokens["received"]}
                        className={`p-2 rounded ${currentPage["received"] * emailsPerPage >= receivedEmailCount && !nextPageTokens["received"] ? 'dark:bg-[#262626] bg-[#eeeeee] text-gray-700  p-3 rounded-lg cursor-not-allowed' : 'dark:bg-[#262626] bg-[#eeeeee] text-gray-500 p-3 rounded-lg '}`}
                      >
                        <RxChevronRight />
                      </button>
                    </div>
                  )}

                </ul>
              )}
              {activeTab === "pdflinks" && (
                <ul className="">
                  <>
                    {sentEmails.filter(email => email.payload?.parts?.some(part => part.mimeType === 'application/pdf')).length > 0 && (
                      <>
                        <p className="p-2 text-green-500">Sent</p>
                        {sentEmails.filter(email => email.payload?.parts?.some(part => part.mimeType === 'application/pdf')).map((email, index) => {
                          const headers = email.payload.headers;
                          const dateHeader = headers.find(header => header.name === 'Date');
                          const subjectHeader = headers.find(header => header.name === 'Subject');
                          const pdfPart = email.payload?.parts?.find(part => part.mimeType === 'application/pdf');
                          const pdfAttachmentId = pdfPart ? pdfPart.body.attachmentId : null;
                          const emailId = email.id;
                          if (pdfAttachmentId) {
                            return (
                              <Accordion key={index} type={"single"} collapsible className="w-full">
                                <AccordionItem className="text-md border-0 mb-2" value={index + 1}>
                                  <div className="flex justify-between gap-2">
                                    <table className="">
                                      <tbody>
                                        <tr className="text-sm">
                                          <td className="w-[15%] min-w-2xl dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                                            {new Date(dateHeader.value).toLocaleString()}
                                          </td>
                                          <td className="w-[65%] dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                                            {subjectHeader.value}
                                          </td>
                                          
                                        </tr>
                                      </tbody>
                                    </table>
                                    <AccordionTrigger className="dark:bg-[#1c1c1c] bg-[#eeeeee] text-gray-500 p-3 rounded-lg w-full"></AccordionTrigger>
                                  </div>
                                  <AccordionContent className="p-1 mt-2 dark:bg-[#121212] rounded-lg">
                                    <li className="rounded-md dark:bg-[#111111] bg-white text-gray-500" style={{ padding: "20px", marginBottom: "20px" }} key={index}>
                                      <div className="dark:bg-black bg-white" style={{ padding: 20, marginTop: 10, borderRadius: "10px" }}>
                                        {email.payload.parts.filter(part => part.mimeType === 'application/pdf').map((pdfPart, pdfIndex) => {
                                          const pdfAttachmentId = pdfPart.body.attachmentId;
                                          const handleViewPdf = async () => {
                                            if (pdfAttachmentId) {
                                              try {
                                                if(selectedData.accessToken){
                                                  const attachmentData = await fetchAttachmentForShare(emailId, pdfAttachmentId,selectedData.accessToken,selectedData.refreshToken);
                                                  const pdfData = base64ToUint8Array(attachmentData.data.replace(/-/g, '+').replace(/_/g, '/'));
                                                  openPdfViewer(pdfData);
                                                  
                                                }else{
                                                  const attachmentData = await fetchAttachment(emailId, pdfAttachmentId);
                                                  const pdfData = base64ToUint8Array(attachmentData.data.replace(/-/g, '+').replace(/_/g, '/'));
                                                  openPdfViewer(pdfData);
                                                }
                                                
                                              } catch (error) {
                                                console.error('Error fetching or decoding PDF:', error);
                                                // Handle error appropriately, e.g., show error message to user
                                              }
                                            }
                                          };

                                          return (
                                            <div key={`${emailId}-${pdfIndex}`} style={{ marginBottom: '10px' }}>
                                              <button onClick={handleViewPdf} className="underline">{pdfPart.filename}</button>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </li>
                                    <br />
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            );
                          }
                          return null;
                        })}
                      </>
                    )}
                    {receivedEmails.filter(email => email.payload?.parts?.some(part => part.mimeType === 'application/pdf')).length > 0 && (
                      <>
                        <p className="p-3 text-green-500">Received</p>
                        {receivedEmails.filter(email => email.payload?.parts?.some(part => part.mimeType === 'application/pdf')).map((email, index) => {
                          const headers = email.payload.headers;
                          const dateHeader = headers.find(header => header.name === 'Date');
                          const subjectHeader = headers.find(header => header.name === 'Subject');
                          const pdfPart = email.payload?.parts?.find(part => part.mimeType === 'application/pdf');
                          const pdfAttachmentId = pdfPart ? pdfPart.body.attachmentId : null;
                          const emailId = email.id;


                          if (pdfAttachmentId) {
                            return (
                              <Accordion key={index} type={"single"} collapsible className="w-full">
                                <AccordionItem className="text-md border-0 mb-2" value={index + 1}>
                                  <div className="flex justify-between gap-2">
                                    <table className="">
                                      <tbody>
                                        <tr className="text-sm">
                                          <td className="w-[15%] min-w-2xl dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                                            {new Date(dateHeader.value).toLocaleString()}
                                          </td>
                                          <td className="w-[65%] dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                                            {subjectHeader.value}
                                          </td>
                                          
                                        </tr>
                                      </tbody>
                                    </table>
                                    <AccordionTrigger className="dark:bg-[#1c1c1c] bg-[#eeeeee] text-gray-500 p-3 rounded-lg w-full"></AccordionTrigger>
                                  </div>
                                  <AccordionContent className="p-1 mt-2 dark:bg-[#121212] rounded-lg">
                                    <li className="rounded-md dark:bg-[#111111] bg-white text-gray-500" style={{ padding: "20px", marginBottom: "20px" }} key={index}>
                                      <div className="dark:bg-black bg-white" style={{ padding: 20, marginTop: 10, borderRadius: "10px" }}>
                                        {email.payload.parts.filter(part => part.mimeType === 'application/pdf').map((pdfPart, pdfIndex) => {
                                          const pdfAttachmentId = pdfPart.body.attachmentId;
                                          const handleViewPdf = async () => {
                                            if (pdfAttachmentId) {
                                              try {
                                                if(selectedData.accessToken){
                                                  const attachmentData = await fetchAttachmentForShare(emailId, pdfAttachmentId,selectedData.accessToken,selectedData.refreshToken);
                                                  const pdfData = base64ToUint8Array(attachmentData.data.replace(/-/g, '+').replace(/_/g, '/'));
                                                  openPdfViewer(pdfData);
                                                  
                                                }else{
                                                  const attachmentData = await fetchAttachment(emailId, pdfAttachmentId);
                                                  const pdfData = base64ToUint8Array(attachmentData.data.replace(/-/g, '+').replace(/_/g, '/'));
                                                  openPdfViewer(pdfData);
                                                }
                                              } catch (error) {
                                                console.error('Error fetching or decoding PDF:', error);
                                              }
                                            }
                                          };

                                          return (
                                            <div key={`${emailId}-${pdfIndex}`} style={{ marginBottom: '10px' }}>
                                              <button onClick={handleViewPdf} className="underline">{pdfPart.filename}</button>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </li>
                                    <br />
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            );
                          }
                          return null;
                        })}
                      </>
                    )}
                  </>
                </ul>
              )}


              {activeTab === "innerlinks" && (
                <ul className="">
                  <>
                    {sentEmails.some(email => extractUrlsFromText(getBodyData(email.payload).textBody).length > 0) && (
                      <>
                        <p className="p-2 text-green-500">Sent</p>
                        {sentEmails.filter(email => extractUrlsFromText(getBodyData(email.payload).textBody).length > 0).map((email, index) => {
                          const headers = email.payload.headers;
                          const dateHeader = headers.find(header => header.name === 'Date');
                          const subjectHeader = headers.find(header => header.name === 'Subject');
                          const emailId = email.id;
                          const { textBody } = getBodyData(email.payload);
                          const bodyData = sentBodyFormat[emailId] === 'text/html' ? recievedHtmlBodies[emailId] || 'Loading...' : textBody;
                          const innerLinks = extractUrlsFromText(bodyData);
                          console.log(extractUrlsFromText(getBodyData(email.payload).textBody).length > 0);
                          const shortenUrl = (url) => {
                            try {
                              const urlObj = new URL(url);
                              return urlObj.hostname;
                            } catch (error) {
                              console.error('Invalid URL:', url, error);
                              return url; // Fallback to original URL if invalid
                            }
                          };

                          return (
                            <Accordion key={index} type={"single"} collapsible className="w-full">
                              <AccordionItem className="text-md border-0 mb-2" value={index + 1}>
                                <div className="flex justify-between gap-2">
                                  <table className="">
                                    <tbody>
                                      <tr className="text-sm">
                                        <td className="w-[15%] min-w-2xl dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                                          {new Date(dateHeader.value).toLocaleString()}
                                        </td>
                                        <td className="w-[65%] dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                                          {subjectHeader.value}
                                        </td>
                                        
                                      </tr>
                                    </tbody>
                                  </table>
                                  <AccordionTrigger className="dark:bg-[#1c1c1c] bg-[#eeeeee] text-gray-500 p-3 rounded-lg w-full"></AccordionTrigger>
                                </div>
                                <AccordionContent className="p-1 mt-2 dark:bg-[#121212] rounded-lg">
                                  <li className="rounded-md dark:bg-[#111111] bg-white text-gray-500" style={{ padding: "20px", marginBottom: "20px" }} key={index}>
                                    
                                    
                                    <div className="dark:bg-black bg-white" style={{ padding: 20, marginTop: 10, borderRadius: "10px" }}>
                                      {innerLinks.map((link, linkIndex) => (
                                        <li key={`${emailId}-${linkIndex}`}>
                                          <a href={link} target="_blank" rel="noopener noreferrer" className="underline">{shortenUrl(link)}</a>
                                        </li>
                                      ))}
                                      
                                    </div>
                                    
                                    <br />
                                  </li>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          );
                        })}
                      </>
                    )}
                    {receivedEmails.some(email => extractUrlsFromText(getBodyData(email.payload).textBody).length > 0) && (
                      <>
                        <p className="p-3 text-green-500">Received</p>
                        {receivedEmails.filter(email => extractUrlsFromText(getBodyData(email.payload).textBody).length > 0).map((email, index) => {
                          const headers = email.payload.headers;
                          const dateHeader = headers.find(header => header.name === 'Date');
                          const subjectHeader = headers.find(header => header.name === 'Subject');
                          const emailId = email.id;
                          const { textBody } = getBodyData(email.payload);
                          const bodyData = receivedBodyFormat[emailId] === 'text/html' ? recievedHtmlBodies[emailId] || 'Loading...' : textBody;
                          const innerLinks = extractUrlsFromText(bodyData);
                          const shortenUrl = (url) => {
                            try {
                              const urlObj = new URL(url);
                              return urlObj.hostname;
                            } catch (error) {
                              console.error('Invalid URL:', url, error);
                              return url; // Fallback to original URL if invalid
                            }
                          };

                          return (
                            <Accordion key={index} type={"single"} collapsible className="w-full">
                              <AccordionItem className="text-md border-0 mb-2" value={index + 1}>
                                <div className="flex justify-between gap-2">
                                  <table className="">
                                    <tbody>
                                      <tr className="text-sm">
                                        <td className="w-[15%] min-w-2xl dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                                          {new Date(dateHeader.value).toLocaleString()}
                                        </td>
                                        <td className="w-[65%] dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                                          {subjectHeader.value}
                                        </td>
                                        
                                      </tr>
                                    </tbody>
                                  </table>
                                  <AccordionTrigger className="dark:bg-[#1c1c1c] bg-[#eeeeee] text-gray-500 p-3 rounded-lg w-full"></AccordionTrigger>
                                </div>
                                <AccordionContent className="p-1 mt-2 dark:bg-[#121212] rounded-lg">
                                  <li className="rounded-md dark:bg-[#111111] bg-white text-gray-500" style={{ padding: "20px", marginBottom: "20px" }} key={index}>
                                    
                                    
                                    <div className="dark:bg-black bg-white" style={{ padding: 20, marginTop: 10, borderRadius: "10px" }}>
                                      {innerLinks.map((link, linkIndex) => (
                                        <li key={`${emailId}-${linkIndex}`}>
                                          <a href={link} target="_blank" rel="noopener noreferrer" className="underline">{shortenUrl(link)}</a>
                                        </li>
                                      ))}
                                      
                                    </div>
                                    
                                    <br />
                                  </li>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          );
                        })}
                      </>
                    )}
                    <br />
                  </>
                </ul>
              )}

              {activeTab === "messages" && (
                <div className="">
                  {messages?.map((message, index) => (
                    <div className="">
                      {message.Type === "Outgoing" && (
                        <div className=" w-full flex justify-end mb-3">
                          <strong className="flex gap-1 flex-col">
                            <span className="text-xs text-gray-300">
                              Ben Mak :{" "}
                              {new Date(message["Sent Date"]).toLocaleString()}
                            </span>
                            <span
                              className=""
                              style={{
                                borderRadius: "15px 2px 15px 15px",
                                padding: "10px",
                                marginBottom: "0px",
                                background: "#015C4B",
                                color: "#fff",
                              }}
                            >
                              {message.Text}
                            </span>
                          </strong>
                        </div>
                      )}
                      {message.Type === "Incoming" && (
                        <div className=" w-full flex justify-start mb-3">
                          <strong className="flex gap-1 flex-col">
                            <span className="text-xs text-gray-300">
                              {selectedData.Name} :{" "}
                              {new Date(
                                message["Message Date"]
                              ).toLocaleString()}
                            </span>
                            <span
                              className=""
                              style={{
                                borderRadius: "2px 15px 15px 15px",
                                padding: "10px",
                                marginBottom: "0px",
                                background: "#1F2C33",
                                color: "#fff",
                              }}
                            >
                              {message.Text}
                            </span>
                          </strong>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
              {activeTab === "incidents" && (
                <>
                  {incident.map((inci) => (
                    <div className="dark:bg-[#111111] bg-white p-8 mb-5 rounded-md">
                      <p className="dark:text-gray-400 text-black">
                        <strong className="font-semibold dark:text-white">
                          Name :{" "}
                        </strong>{" "}
                        {inci.complainer_name}
                      </p>
                      <p className="dark:text-gray-400 text-black">
                        <strong className="font-semibold dark:text-white text-black">
                          Date :
                        </strong>{" "}
                        {new Date(inci.created_at).toLocaleString()}
                      </p>
                      <p className="dark:text-gray-200 text-black">
                        <strong className="dark:text-white text-black font-semibold">
                          Incident :
                        </strong>{" "}
                        <br />
                        <div
                          dangerouslySetInnerHTML={{
                            __html: inci.complaint_text,
                          }}
                        ></div>
                      </p>
                    </div>
                  ))}
                </>
              )}
              {activeTab === "embed" && (
                <>
                  {publicview === false && (
                    <>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <button
                            className={`px-8 py-2 rounded-md ${
                              !toggleEmbed ? "dark:bg-[#1d1d1d] bg-[#ebebeb] text-black" : "dark:bg-black text-black bg-white"
                            } text-gray-200`}
                            onClick={() => setToggleEmbed(false)}
                          >
                            Embed Link
                          </button>
                          <button
                            className={`px-8 py-2 rounded-md ${
                              toggleEmbed ? "dark:bg-[#1d1d1d] bg-[#ebebeb] text-black" : "dark:bg-black text-black bg-white"
                            } text-gray-200`}
                            onClick={() => setToggleEmbed(true)}
                          >
                            Embed Content
                          </button>
                        </div>
                        <div className="flex">
                          <button
                            className="px-8 py-2 rounded-md dark:bg-[#1d1d1d] bg-[#3498db] text-white ml-4"
                            onClick={handleUploadPDF}
                          >
                            Add PDF
                          </button>
                          <button
                            className={`px-8 py-2 rounded-md dark:bg-[#1d1d1d] ${
                              masterembedlink?.length <= 0 ? "bg-gray-300 text-white cursor-not-allowed" : "bg-[#f1c40f] text-white"
                            } ml-4`}
                            onClick={() => {
                              if (masterembedlink?.length > 0) {
                                window.location.href = `/${selectedData["Email"]}`;
                              }
                            }}
                            disabled={masterembedlink?.length <= 0}
                          >
                            Share
                          </button>
                        </div>
                        {/* <button
                          className={`px-8 py-2 rounded-md dark:bg-[#1d1d1d] ${
                            masterembedlink?.length <= 0 ? "bg-gray-300 text-white cursor-not-allowed" : "bg-[#f1c40f] text-white"
                          } ml-4`}
                          onClick={() => {
                            if (masterembedlink?.length > 0) {
                              window.location.href = `/${selectedData["Email"]}`;
                            }
                          }}
                          disabled={masterembedlink?.length <= 0}
                        >
                          Share
                        </button> */}
                      </div>
                      <div className="embedlinks py-5">
                          {toggleEmbed ? (
                            <>
                              <h2 className="text-lg font-bold text-white pb-5">
                                Embed Content
                              </h2>
                              <JoditEditor
                                ref={editor}
                                value={embedLink}
                                config={{
                                  autofocus: false,
                                  readonly: false,
                                  theme: "dark",
                                  statusbar: false,
                                }}
                                onBlur={handleComplaintChangeDebounced}
                              />
                              <input
                                className="cursor-not-allowed text-black rounded-md my-2 p-2 mr-4"
                                disabled
                                type="text"
                                name="name"
                                value={selectedData["Name"]}
                              />
                              {embedLink === "" ? (
                                <button className="px-8 py-2 rounded-md dark:bg-[#1d1d1d] bg-[#3498db] text-white ml-4 cursor-not-allowed">
                                  Add Link
                                </button>
                              ) : (
                                <button
                                  className="px-8 py-2 rounded-md dark:bg-[#1d1d1d] bg-[#3498db] text-white ml-4"
                                  onClick={handleEmbedLinkAdd}
                                >
                                  Add Link
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <h2 className="text-lg font-bold dark:text-white text-black pb-5">
                                Embed Link
                              </h2>
                              <input
                                className="text-white rounded-md bg-[#1d1d1d] my-2 p-2 mr-4"
                                type="text"
                                name="link"
                                value={embedLink2}
                                placeholder="Enter the Embed Link"
                                required
                                onChange={(e) => setEmbedLink2(e.target.value)}
                              />
                              <input
                                className="cursor-not-allowed text-black rounded-md my-2 p-2 mr-4"
                                disabled
                                type="text"
                                name="name"
                                value={selectedData["Name"]}
                              />
                              {embedLink2 === "" ? (
                                <button className="px-8 py-2 rounded-md dark:bg-[#1d1d1d] bg-[#3498db] text-white ml-4 cursor-not-allowed">
                                  Add Link
                                </button>
                              ) : (
                                <button
                                  className="px-8 py-2 rounded-md dark:bg-[#1d1d1d] bg-[#3498db] text-white ml-4"
                                  onClick={handleEmbedLinkAdd2}
                                >
                                  Add Link
                                </button>
                              )}
                            </>
                          )}
                      </div>
                      <p>
                        Total Embed Links :{" "}
                        <strong className="text-white">
                          {masterembedlink?.length}
                        </strong>
                      </p>
                    </>
                  )}

                  {/* {isLoading ? (
                    <p>Loading . . </p>
                  ) : (
                    <>
                      
                    </>
                  )} */}

                  {/* <div className="flex items-center">
                    <button
                      className=" px-8 py-2 rounded-md cursor-pointer dark:bg-[#1d1d1d] text-black bg-[#d6d6d6] mb-5"
                      onClick={handleCopyEmb}
                    >
                      Copy Individual Link
                    </button>
                    <p className="text-green-600 px-2">
                      {isCopied && <p>✅ Link copied to clipboard!</p>}
                    </p>
                  </div>
                  <a
                    className="align-text-center text-black dark:text-white  py-2 mb-5"
                    href={`/${selectedData["Email"]}`}
                  >
                    Go to Individual Page
                  </a> */}
                  <br />
                  <br />
                  {isLoading ? (
                    <SkeletonDetails />
                  ) : masterembedlink?.length > 0 && (
                    <>
                      {" "}
                      {masterembedlink.map((emb) => (
                        <div className="dark:bg-[#111111] bg-[#e7e7e7] p-8 mb-5 rounded-md">
                          <p className="text-gray-400">
                            <div className="font-semibold dark:text-white text-black flex justify-between mb-5">
                              <p>
                                Date :{" "}
                                {new Date(emb.created_at).toLocaleString()}
                                {"  "}
                              </p>
                              {publicview === false && (
                                <button
                                  className="py-0.5 px-4 bg-red-500 text-white"
                                  onClick={() =>{
                                    if (emb.fileName) { // Ensure fileName exists
                                      deleteEmbedForPdf(emb.id, emb.fileName); // Pass both id and fileName
                                    } else {
                                      deleteEmbed(emb.id)
                                    }
                                  } }
                                >
                                  Delete This
                                </button>
                              )}
                            </div>{" "}
                            <div
                              dangerouslySetInnerHTML={{
                                __html: `${emb.link}`,
                              }}
                            ></div>
                          </p>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailPanel;

