import React, { useEffect, useState, useRef } from "react";
import DefaultMessage from "./DefaultMessage";
import LoadingComponent from "./LoadingComponent";
import PDFViewer from "./PDFViewer";
import { axiosRetry } from "./retryAxios"; // Import the axiosRetry function
import copy from "clipboard-copy";
import { createClient } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

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
}) => {
  const [activeTab, setActiveTab] = useState("sent");
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

  useEffect(() => {
    setisLoading(true);
    // Fetch data from the Links table for the selected name
    async function fetchData() {
      const { data, error } = await supabase
        .from("Links")
        .select("*")
        .eq("email", selectedData["Email"]);

      if (data) {
        setMasterembedLink(data);
      }

      if (error) {
        console.error("Error fetching data:", error.message);
      } else {
        // If data exists for the selected name, set hasLink to true
        setHasLink(data.length > 0);
      }
    }

    if (selectedData["Email"]) {
      fetchData();
      setisLoading(false);
    }
    setisLoading(false);
  }, [selectedData["Email"]]);

  // Function to open the PDF viewer
  const openPdfViewer = (link) => {
    setisLoading(true);
    setPdfLink(link);
    setShowPdfViewer(true);
    setTimeout(() => {
      setisLoading(false);
    }, 3000);
    // setisLoading(false)
  };

  // Function to close the PDF viewer
  const closePdfViewer = () => {
    setPdfLink("");
    setShowPdfViewer(false);
    setisLoading(false);
  };

  useEffect(() => {
    const sentEmailLinks = sentEmails?.map((email) => {
      const match = email.PDFLINK?.match(/\/d\/([a-zA-Z0-9_-]+)\//);
      if (match) {
        return `https://drive.google.com/uc?id=${match[1]}`;
      }
      return null;
    });

    const receivedEmailLinks = receivedEmails?.map((email) => {
      const match = email.PDFLINK?.match(/\/d\/([a-zA-Z0-9_-]+)\//);
      if (match) {
        return `https://drive.google.com/uc?id=${match[1]}`;
      }
      return null;
    });

    const combinedLinks = [
      ...(sentEmailLinks || []),
      ...(receivedEmailLinks || []),
    ].filter(Boolean);

    setComplaintLink(
      `https://incidents.justice-minds.com/${selectedData?.Name.replace(
        " ",
        "%20"
      )}`
    );
    setCombinedPdfLinks(combinedLinks);
  }, [sentEmails, receivedEmails]);

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
      setEmbedLink2("");
      const { data, error } = await supabase.from("Links").insert([
        {
          link: `<iframe src=${embedLink2} width="100%" height="790px" frameBorder="0" style="border: 0;"></iframe><br>`,
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
  // const getEmailContent = (email) => {
  //   const showFullMessage = showFullMessages[email];

  //   if (email.length > 100) {
  //     return (
  //       <p>
  //         {showFullMessage ? email + " " : email.substring(0, 100) + "..."}
  //         <button
  //           style={{ color: "#fff" }}
  //           onClick={() => handleToggleMessage(email)}
  //         >
  //           {showFullMessage ? "Show Less" : "Show More"}
  //         </button>
  //       </p>
  //     );
  //   }

  //   return <p>{email}</p>;
  // };

  return (
    <div style={{ lineHeight: "2rem", overflowY: "scroll", height: "90vh" }}>
      {showPdfViewer && (
        <PDFViewer
          pdfLink={pdfLink}
          onClose={closePdfViewer}
          loading={isLoading}
        />
      )}
      {/* <iframe src="https://drive.google.com/file/d/1IoRUz6hDGGbGJsMlLRCTZ9Oh4BEjzz8I/preview" width="100%" height="1000px"/>
      {console.log(pdfLink)} */}
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
              top: "120px",
              zIndex: "1000",
            }}
            onClick={handleClose}
          >
            [x]
          </button>
        )}

        {publicview === false && (
          <>
            <Link
              target="_blank"
              onClick={() =>
                copy(`https://justice-minds.com/share/${selectedData["Email"]}`)
              }
              href={`/share/${selectedData["Email"]}`}
              className="dark:text-white text-[#1d1d1d] px-8 py-2 cursor-pointer dark:bg-[#1d1d1d] bg-[#e9e9e9]  rounded-md"
            >
              Share Page
            </Link>
            <br />
            <br />
          </>
        )}
        {/* <p>
          {emaillist.map((email) => (
            <>
              <p>
                {email?.from?.includes(selectedData.Email) ? (
                  <>Sent : {email.subject}</>
                ) : (
                  <>Received : {email.subject}</>
                )}
              </p>
            </>
          ))}

          {pageToken && <button onClick={loadmore}>Load More</button>}
        </p> */}

        <p className="text-black dark:text-white">
          <span className="dark:text-[#d5d5d5] text-[#828282]">Name</span> :{" "}
          {selectedData["Name"]}
        </p>
        <p className="text-black dark:text-white">
          <span className="dark:text-[#d5d5d5] text-[#828282]">Company</span> :{" "}
          {selectedData["CompanyName"]}
        </p>
        <p className="text-black dark:text-white">
          <span className="dark:text-[#d5d5d5] text-[#828282]">Email</span> :{" "}
          {selectedData["Email"]}
        </p>
        <p className="text-black dark:text-white">
          <span className="dark:text-[#d5d5d5] text-[#828282]">Phone</span> :{" "}
          {selectedData["Phone"]}
        </p>

        {sentEmails ? (
          <>
            <p className="text-black dark:text-white">
              <span className="dark:text-[#d5d5d5] text-[#828282]">Email Sent</span> :
              {loading ? (
                <span> Fetching . . . </span>
              ) : (
                <span> {sentEmails?.length}</span>
              )}
            </p>

            <p className="text-black dark:text-white">
              <span className="dark:text-[#d5d5d5] text-[#828282]">Email Received</span> :
              {loading ? (
                <span> Fetching . . . </span>
              ) : (
                <span> {receivedEmails?.length}</span>
              )}
            </p>
            <p className="text-black dark:text-white">
              <span className="dark:text-[#d5d5d5] text-[#828282]">Total Email</span> :
              {loading ? (
                <span> Fetching . . . </span>
              ) : (
                <span> {sentEmails?.length + receivedEmails?.length}</span>
              )}
            </p>
            <p className="text-black dark:text-white">
              <span className="dark:text-[#d5d5d5] text-[#828282]">Date of First Email Sent</span>{" "}
              :
              {loading ? (
                <span> Fetching . . . </span>
              ) : (
                <span className="">
                  {" "}
                  {new Date(sentEmails[0]?.SENT).toLocaleString()}
                </span>
              )}
            </p>
            <p className="text-black dark:text-white">
              <span className="dark:text-[#d5d5d5] text-[#828282]">Date of Last Email Sent</span>{" "}
              :
              {loading ? (
                <span> Fetching . . . </span>
              ) : (
                <span>
                  {" "}
                  {new Date(
                    sentEmails[sentEmails.length - 1]?.SENT
                  ).toLocaleString()}
                </span>
              )}
            </p>
            {/* <br /> */}
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

            {/* <br />
            <br /> */}
          </>
        ) : (
          <>
            <span>Loading data . . </span>
          </>
        )}
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
              {/* <button style={{padding:"30px", color:"#adadad"}} onClick={() => handleTabChange("sent")}>Received Emails</button> */}
              {/* <button style={{padding:"30px", color:"#adadad"}} onClick={() => handleTabChange("received")}>Sent Emails</button> */}
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
                  All Pdf Links
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
              {/* {console.log(masterembedlink)} */}
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
                <ul className="">
                  {sentEmails.map((email, index) => (
                    <Accordion
                      key={index}
                      type={"single"}
                      collapsible
                      className="w-full"
                    >
                      <AccordionItem
                        className="text-md border-0 mb-2"
                        value={index + 1}
                      >
                        <div className="flex justify-between gap-2">
                          {/* <div className="flex gap-3"> */}

                          <table className="">
                            {/* <th>data</th> */}
                            <tr className="text-sm">
                              <td className="w-[25%] dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                                {new Date(email["SENT"]).toLocaleString()}
                              </td>
                              <td className="w-[65%] dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                                {email["SUBJECT"]}
                              </td>
                              <td className="w-[10%] dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                                
                                <button
                                  onClick={() =>
                                    openPdfViewer(
                                      `https://drive.google.com/file/d/${
                                        email.PDFLINK?.match(
                                          /\/d\/([a-zA-Z0-9_-]+)\//
                                        )[1]
                                      }/preview`
                                    )
                                  }
                                >
                                  View PDF
                                </button>
                              </td>
                            </tr>
                          </table>

                          {/* </div> */}
                          <AccordionTrigger className="dark:bg-[#1c1c1c] bg-[#eeeeee] text-black p-3 rounded-lg w-full"></AccordionTrigger>
                        </div>
                        <AccordionContent className="p-1 mt-2 dark:bg-[#121212] rounded-lg">
                        <li
                          className="rounded-md dark:bg-[#111111] bg-white text-black"
                          style={{
                            padding: "20px",
                            marginBottom: "20px",
                            // background: "#111111",
                            // color: "#adadad",
                          }}
                          key={index}
                        >
                          <strong className="dark:text-[#d5d5d5] text-[#828282]">From : </strong>{" "}
                          {email["FROM"]} <br />
                          <strong className="dark:text-[#d5d5d5] text-[#828282]">To : </strong>{" "}
                          {email["TO"]} <br /> <br />
                          {/* <hr style={{ margin: "30px 0px 30px 0px" }} /> */}
                          {/* <strong style={{ color: "#d5d5d5" }}>Subject : </strong>{" "} */}
                          {/* {email["SUBJECT"]} <br /> */}
                          {/* <strong style={{ color: "#d5d5d5" }}>Sent : </strong>{" "}
                          {new Date(email["SENT"]).toLocaleString()} <br />
                          <strong style={{ color: "#d5d5d5" }}>
                            Received :{" "}
                          </strong>{" "}
                          {new Date(email["RECEIVED"]).toLocaleString()} <br /> */}
                          <strong className="dark:text-[#d5d5d5] text-[#828282]">PDF : </strong>{" "}
                          <button
                            onClick={() =>
                              openPdfViewer(
                                `https://drive.google.com/file/d/${
                                  email.PDFLINK?.match(/\/d\/([a-zA-Z0-9_-]+)\//)[1]
                                }/preview`
                              )
                            }
                          >
                            View PDF
                          </button>{" "}
                          <br />
                          {/* <a href={email["PDFLINK"]}>View PDF in new Tab</a> <br /> */}
                          {/* <strong style={{ color: "#d5d5d5" }}>Complaint : </strong>
                          <a >
                            View Complaint
                          </a>{" "} */}
                          <br />
                          {`--------------------------------`}
                          <br />
                          <strong className="dark:text-[#d5d5d5] text-[#828282]">Message : </strong>
                          {""}
                          {email["PDFLINK"] === null ? (
                            <p>No Message</p>
                          ) : (
                            <button
                              onClick={() =>
                                handleExtractText(
                                  `https://drive.google.com/uc?id=${
                                    email.PDFLINK?.match(
                                      /\/d\/([a-zA-Z0-9_-]+)\//
                                    )[1]
                                  }`,
                                  index,
                                  "sent"
                                )
                              }
                            >
                              Show Full Message
                            </button>
                          )}
                          {extractedTexts[`sent_${index}`] && (
                            <div className="dark:bg-black bg-white"
                              style={{
                                // background: "#000",
                                padding: 20,
                                marginTop: 10,
                                borderRadius:"10px"
                              }}
                            >
                              {extractedUrls[`sent_${index}`] ? (
                                <>
                                  <p className="text-green-500 text-xl">
                                    Links Found in the Mail . . .
                                  </p>
                                  {`------------------`}
                                  {extractedUrls[`sent_${index}`]?.map((url) => (
                                    <p
                                      style={{
                                        whiteSpace: "pre-wrap",
                                        color: "#fff",
                                      }}
                                    >
                                      <a
                                        target="_blank"
                                        className="underline"
                                        href={url}
                                      >
                                        {url}
                                      </a>
                                      <br />
                                    </p>
                                  ))}
                                  {`------------------`}
                                </>
                              ) : (
                                <>
                                  <p className="text-xl text-yellow-500">
                                    No Inner Links Found . . .
                                  </p>
                                  {`------------------`}
                                </>
                              )}
                              <p className="text-black dark:text-white"
                                style={{
                                  whiteSpace: "pre-wrap",
                                  wordWrap: "break-word",
                                  // color: "#fff",
                                  marginTop: "-60px",
                                  marginBottom: "50px",
                                }}
                              >
                                {extractedTexts[`sent_${index}`]}
                              </p>
                            </div>
                          )}
                          {currentlyExtractingEmailIndex === index &&
                            loadingtext && <p>Loading . .</p>}
                          <br />
                          {/* <hr style={{ margin: "30px 0px 30px 0px" }} />
                    <strong style={{ color: "#fff" }}>Message : </strong>
                    <div>
                      {getEmailContent(email["MESSAGE"])}
                    </div> */}
                        </li>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    //     <li
                    //       className="rounded-md"
                    //       style={{
                    //         padding: "20px",
                    //         marginBottom: "20px",
                    //         background: "#111111",
                    //         color: "#adadad",
                    //       }}
                    //       key={index}
                    //     >
                    //       <strong style={{ color: "#d5d5d5" }}>From : </strong>{" "}
                    //       {email["FROM"]} <br />
                    //       <strong style={{ color: "#d5d5d5" }}>To : </strong>{" "}
                    //       {email["TO"]} <br />
                    //       <hr style={{ margin: "30px 0px 30px 0px" }} />
                    //       <strong style={{ color: "#d5d5d5" }}>Subject : </strong>{" "}
                    //       {email["SUBJECT"]} <br />
                    //       <strong style={{ color: "#d5d5d5" }}>Sent : </strong>{" "}
                    //       {new Date(email["SENT"]).toLocaleString()} <br />
                    //       <strong style={{ color: "#d5d5d5" }}>
                    //         Received :{" "}
                    //       </strong>{" "}
                    //       {new Date(email["RECEIVED"]).toLocaleString()} <br />
                    //       <strong style={{ color: "#d5d5d5" }}>PDF : </strong>{" "}
                    //       <button
                    //         onClick={() =>
                    //           openPdfViewer(
                    //             `https://drive.google.com/file/d/${
                    //               email.PDFLINK?.match(/\/d\/([a-zA-Z0-9_-]+)\//)[1]
                    //             }/preview`
                    //           )
                    //         }
                    //       >
                    //         View PDF
                    //       </button>{" "}
                    //       <br />
                    //       {/* <a href={email["PDFLINK"]}>View PDF in new Tab</a> <br /> */}
                    //       <strong style={{ color: "#d5d5d5" }}>Complaint : </strong>
                    //       <a >
                    //         View Complaint
                    //       </a>{" "}
                    //       <br />
                    //       {`--------------------------------`}
                    //       <br />
                    //       <strong style={{ color: "#d5d5d5" }}>Message : </strong>
                    //       {""}
                    //       {email["PDFLINK"] === null ? (
                    //         <p>No Message</p>
                    //       ) : (
                    //         <button
                    //           onClick={() =>
                    //             handleExtractText(
                    //               `https://drive.google.com/uc?id=${
                    //                 email.PDFLINK?.match(
                    //                   /\/d\/([a-zA-Z0-9_-]+)\//
                    //                 )[1]
                    //               }`,
                    //               index,
                    //               "sent"
                    //             )
                    //           }
                    //         >
                    //           Show Full Message
                    //         </button>
                    //       )}
                    //       {extractedTexts[`sent_${index}`] && (
                    //         <div
                    //           style={{
                    //             background: "#000",
                    //             padding: 20,
                    //             marginTop: 10,
                    //             borderRadius:"10px"
                    //           }}
                    //         >
                    //           {extractedUrls[`sent_${index}`] ? (
                    //             <>
                    //               <p className="text-green-500 text-xl">
                    //                 Links Found in the Mail . . .
                    //               </p>
                    //               {`------------------`}
                    //               {extractedUrls[`sent_${index}`]?.map((url) => (
                    //                 <p
                    //                   style={{
                    //                     whiteSpace: "pre-wrap",
                    //                     color: "#fff",
                    //                   }}
                    //                 >
                    //                   <a
                    //                     target="_blank"
                    //                     className="underline"
                    //                     href={url}
                    //                   >
                    //                     {url}
                    //                   </a>
                    //                   <br />
                    //                 </p>
                    //               ))}
                    //               {`------------------`}
                    //             </>
                    //           ) : (
                    //             <>
                    //               <p className="text-xl text-yellow-500">
                    //                 No Inner Links Found . . .
                    //               </p>
                    //               {`------------------`}
                    //             </>
                    //           )}
                    //           <p
                    //             style={{
                    //               whiteSpace: "pre-wrap",
                    //               wordWrap: "break-word",
                    //               color: "#fff",
                    //               marginTop: "-60px",
                    //               marginBottom: "50px",
                    //             }}
                    //           >
                    //             {extractedTexts[`sent_${index}`]}
                    //           </p>
                    //         </div>
                    //       )}
                    //       {currentlyExtractingEmailIndex === index &&
                    //         loadingtext && <p>Loading . .</p>}
                    //       <br />
                    //       {/* <hr style={{ margin: "30px 0px 30px 0px" }} />
                    // <strong style={{ color: "#fff" }}>Message : </strong>
                    // <div>
                    //   {getEmailContent(email["MESSAGE"])}
                    // </div> */}
                    //     </li>
                  ))}
                </ul>

                // <p>
                //   {emaillist.map((email) => (
                //     <>
                //       <p>
                //         {email?.from?.includes(selectedData.Email) && (
                //           <>Sent : {email.subject}</>
                //         )}
                //       </p>
                //     </>
                //   ))}

                //   {pageToken && <button onClick={loadmore}>Load More</button>}
                // </p>
              )}
              {activeTab === "received" && (
                <ul className="">
                  {receivedEmails.map((email, index) => (
                    <Accordion
                    key={index}
                    type={"single"}
                    collapsible
                    className="w-full"
                  >
                    <AccordionItem
                      className="text-md border-0 mb-2"
                      value={index + 1}
                    >
                      <div className="flex justify-between gap-2">
                        {/* <div className="flex gap-3"> */}

                        <table className="">
                          {/* <th>data</th> */}
                          <tr className="text-sm">
                            <td className="w-[25%] dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                              {new Date(email["SENT"]).toLocaleString()}
                            </td>
                            <td className="w-[65%] dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                              {email["SUBJECT"]}
                            </td>
                            <td className="w-[10%] dark:text-gray-400 text-gray-900 dark:border-[#393939] border-[#ababab]">
                              <strong style={{ color: "#d5d5d5" }}>
                                
                              </strong>
                              <button
                                onClick={() =>
                                  openPdfViewer(
                                    `https://drive.google.com/file/d/${
                                      email.PDFLINK?.match(
                                        /\/d\/([a-zA-Z0-9_-]+)\//
                                      )[1]
                                    }/preview`
                                  )
                                }
                              >
                                View PDF
                              </button>
                            </td>
                          </tr>
                        </table>

                        {/* </div> */}
                        <AccordionTrigger className="dark:bg-[#1c1c1c] bg-[#eeeeee] text-black p-3 rounded-lg w-full"></AccordionTrigger>
                      </div>
                      <AccordionContent className="p-1 mt-2 dark:bg-[#121212] rounded-lg">
                      <li
                        className="rounded-md dark:bg-[#121212] text-black bg-white"
                        style={{
                          padding: "20px",
                          marginBottom: "20px",
                          // background: "#111111",
                          // color: "#adadad",
                        }}
                        key={index}
                      >
                        <strong className="dark:text-[#d5d5d5] text-[#828282]">From : </strong>{" "}
                        {email["FROM"]} <br />
                        <strong className="dark:text-[#d5d5d5] text-[#828282]">To : </strong>{" "}
                        {email["TO"]} <br /> <br />
                        {/* <hr style={{ margin: "30px 0px 30px 0px" }} /> */}
                        {/* <strong style={{ color: "#d5d5d5" }}>Subject : </strong>{" "} */}
                        {/* {email["SUBJECT"]} <br /> */}
                        {/* <strong style={{ color: "#d5d5d5" }}>Sent : </strong>{" "}
                        {new Date(email["SENT"]).toLocaleString()} <br />
                        <strong style={{ color: "#d5d5d5" }}>
                          Received :{" "}
                        </strong>{" "}
                        {new Date(email["RECEIVED"]).toLocaleString()} <br /> */}
                        <strong className="dark:text-[#d5d5d5] text-[#828282]">PDF : </strong>{" "}
                        <button
                          onClick={() =>
                            openPdfViewer(
                              `https://drive.google.com/file/d/${
                                email.PDFLINK?.match(/\/d\/([a-zA-Z0-9_-]+)\//)[1]
                              }/preview`
                            )
                          }
                        >
                          View PDF
                        </button>{" "}
                        <br />
                        {/* <a href={email["PDFLINK"]}>View PDF in new Tab</a> <br /> */}
                        {/* <strong style={{ color: "#d5d5d5" }}>Complaint : </strong>
                        <a >
                          View Complaint
                        </a>{" "} */}
                        <br />
                        {`--------------------------------`}
                        <br />
                        <strong className="dark:text-[#d5d5d5] text-[#828282]">Message : </strong>
                        {""}
                        {email["PDFLINK"] === null ? (
                          <p>No Message</p>
                        ) : (
                          <button
                            onClick={() =>
                              handleExtractText(
                                `https://drive.google.com/uc?id=${
                                  email.PDFLINK?.match(
                                    /\/d\/([a-zA-Z0-9_-]+)\//
                                  )[1]
                                }`,
                                index,
                                "sent"
                              )
                            }
                          >
                            Show Full Message
                          </button>
                        )}
                        {extractedTexts[`sent_${index}`] && (
                          <div className="dark:bg-black bg-white"
                            style={{
                              // background: "#000",
                              padding: 20,
                              marginTop: 10,
                              borderRadius:"10px"
                            }}
                          >
                            {extractedUrls[`sent_${index}`] ? (
                              <>
                                <p className="text-green-500 text-xl">
                                  Links Found in the Mail . . .
                                </p>
                                {`------------------`}
                                {extractedUrls[`sent_${index}`]?.map((url) => (
                                  <p
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      color: "#fff",
                                    }}
                                  >
                                    <a
                                      target="_blank"
                                      className="underline"
                                      href={url}
                                    >
                                      {url}
                                    </a>
                                    <br />
                                  </p>
                                ))}
                                {`------------------`}
                              </>
                            ) : (
                              <>
                                <p className="text-xl text-yellow-500">
                                  No Inner Links Found . . .
                                </p>
                                {`------------------`}
                              </>
                            )}
                            <p className="text-black dark:text-white"
                              style={{
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                // color: "#fff",
                                marginTop: "-60px",
                                marginBottom: "50px",
                              }}
                            >
                              {extractedTexts[`sent_${index}`]}
                            </p>
                          </div>
                        )}
                        {currentlyExtractingEmailIndex === index &&
                          loadingtext && <p>Loading . .</p>}
                        <br />
                        {/* <hr style={{ margin: "30px 0px 30px 0px" }} />
                  <strong style={{ color: "#fff" }}>Message : </strong>
                  <div>
                    {getEmailContent(email["MESSAGE"])}
                  </div> */}
                      </li>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                //     <li
                //       className="rounded-md"
                //       style={{
                //         padding: "20px",
                //         marginBottom: "20px",
                //         background: "#111111",
                //         color: "#adadad",
                //       }}
                //       key={index}
                //     >
                //       <strong style={{ color: "#d5d5d5" }}>To : </strong>{" "}
                //       {email["TO"]} <br />
                //       <strong style={{ color: "#d5d5d5" }}>From : </strong>{" "}
                //       {email["FROM"]} <br />
                //       <hr style={{ margin: "30px 0px 30px 0px" }} />
                //       <strong style={{ color: "#d5d5d5" }}>
                //         Subject :{" "}
                //       </strong>{" "}
                //       {email["SUBJECT"]} <br />
                //       <strong style={{ color: "#d5d5d5" }}>Sent : </strong>{" "}
                //       {new Date(email["SENT"]).toLocaleString()} <br />
                //       <strong style={{ color: "#d5d5d5" }}>
                //         Received :{" "}
                //       </strong>{" "}
                //       {new Date(email["RECEIVED"]).toLocaleString()} <br />
                //       <strong style={{ color: "#d5d5d5" }}>PDF : </strong>{" "}
                //       <button
                //         onClick={() =>
                //           openPdfViewer(
                //             `https://drive.google.com/file/d/${
                //               email.PDFLINK?.match(/\/d\/([a-zA-Z0-9_-]+)\//)[1]
                //             }/preview`
                //           )
                //         }
                //       >
                //         View PDF
                //       </button>{" "}
                //       <br />
                //       <strong style={{ color: "#d5d5d5" }}>
                //         Complaint :{" "}
                //       </strong>{" "}
                //       <a>View Complaint</a> <br />
                //       {`--------------------------------`}
                //       <br />
                //       <strong style={{ color: "#d5d5d5" }}>Message : </strong>
                //       {""}
                //       {email["PDFLINK"] === null ? (
                //         <p>No Message</p>
                //       ) : (
                //         <button
                //           onClick={() =>
                //             handleExtractText(
                //               `https://drive.google.com/uc?id=${
                //                 email.PDFLINK?.match(
                //                   /\/d\/([a-zA-Z0-9_-]+)\//
                //                 )[1]
                //               }`,
                //               index,
                //               "received"
                //             )
                //           }
                //         >
                //           Show Full Message
                //         </button>
                //       )}
                //       {extractedTexts[`received_${index}`] && (
                //         <div
                //           style={{
                //             background: "#000",
                //             padding: 20,
                //             marginTop: 10,
                //             borderRadius: "10px",
                //           }}
                //         >
                //           {extractedUrls[`received_${index}`] ? (
                //             <>
                //               <p className="text-xl text-green-500">
                //                 Links Found in the Mail . . .
                //               </p>
                //               {`------------------`}
                //               {extractedUrls[`received_${index}`]?.map(
                //                 (url) => (
                //                   <pre
                //                     style={{
                //                       whiteSpace: "pre-wrap",
                //                       color: "#fff",
                //                     }}
                //                   >
                //                     <a
                //                       target="_blank"
                //                       className="underline"
                //                       href={url}
                //                     >
                //                       {url}
                //                     </a>
                //                     <br />
                //                   </pre>
                //                 )
                //               )}
                //               {`------------------`}
                //             </>
                //           ) : (
                //             <>
                //               <p className="text-xl text-yellow-500">
                //                 No Inner Links Found . . .
                //               </p>
                //               {`------------------`}
                //             </>
                //           )}
                //           <pre
                //             style={{
                //               whiteSpace: "pre-wrap",
                //               wordWrap: "break-word",
                //               color: "#fff",
                //               marginTop: "-60px",
                //               marginBottom: "50px",
                //             }}
                //           >
                //             {extractedTexts[`received_${index}`]}
                //           </pre>
                //         </div>
                //       )}
                //       {currentlyExtractingEmailIndex === index &&
                //         loadingtext && <p>Loading . .</p>}
                //       <br />
                //       {/* <hr style={{ margin: "30px 0px 30px 0px" }} />
                // <strong style={{ color: "#fff" }}>Message : </strong>
                // <div>
                //   {getEmailContent(email["MESSAGE"])}
                // </div> */}
                //     </li>
                  ))}
                </ul>
              )}
              {activeTab === "pdflinks" && (
                <ul className="">
                  <>
                    <table className="text-sm">
                      <tr className="text-black dark:text-white">
                        <td className="p-2 border-1 font-semibold dark:border-[#393939] border-[#aaaaaa]">Date</td>
                        <td className="p-2 font-semibold dark:border-[#393939] border-[#aaaaaa]">Pdf Link</td>
                      </tr>
                      <p className="p-2 text-green-500">Sent</p>
                      {sentEmails.map((email, index) => (
                        <>
                          <tr key={index} className="">
                            <td className="p-2 dark:text-gray-400 text-black dark:border-[#393939] border-[#aaaaaa]">
                              {email["SENT"]}
                            </td>
                            <td className="p-2 dark:border-[#393939] border-[#aaaaaa] text-black dark:text-white">
                              <button
                                onClick={() =>
                                  openPdfViewer(
                                    `https://drive.google.com/file/d/${
                                      email["PDFLINK"]?.match(
                                        /\/d\/([a-zA-Z0-9_-]+)\//
                                      )[1]
                                    }/preview`
                                  )
                                }
                              >
                                {email["SUBJECT"]}
                              </button>
                            </td>
                          </tr>
                        </>
                      ))}
                      <p className="p-3 text-green-500">Received</p>
                      {receivedEmails.map((email, index) => (
                        <tr className="dark:text-white text-black">
                          <td className="p-2 dark:text-gray-400 text-black dark:border-[#393939] border-[#aaaaaa]">{email["SENT"]}</td>
                          <td className="p-2 dark:border-[#393939] border-[#aaaaaa]">
                            <button
                              onClick={() =>
                                openPdfViewer(
                                  `https://drive.google.com/file/d/${
                                    email["PDFLINK"]?.match(
                                      /\/d\/([a-zA-Z0-9_-]+)\//
                                    )[1]
                                  }/preview`
                                )
                              }
                            >
                              {email["SUBJECT"]}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </table>
                    {/* <div className="flex md:flex-row flex-col">

                      <p className="text-gray-400 mr-10">
                        <strong className="text-white">Date :</strong>{" "}
                        {email["SENT"]}
                      </p>
                      <a className="text-white text-left" key={index} target="_blank" href={email["PDFLINK"]}>
                        Email : {email["SUBJECT"]}
                      </a>
                    </div> */}
                    <br />
                  </>
                </ul>
              )}
              {activeTab === "innerlinks" && (
                <ul className="">
                  {sentEmails.map((email, index) => (
                    <li className="text-black dark:text-gray-300"
                      style={{
                        padding: "20px",
                        marginBottom: "",
                        // background: "#262626",
                        // color: "#adadad",
                      }}
                      key={index}
                    >
                      {`--------------------------------`}
                      <br />
                      {email["SENT"]}
                      <br />
                      <strong style={{ color: "#fff" }}>SENT : </strong>
                      {""}
                      <a href={email?.PDFLINK}>{email?.SUBJECT}</a>
                      <br />
                      {email["PDFLINK"] === null ? (
                        <p>No PADLINK</p>
                      ) : (
                        <button
                          onClick={() =>
                            handleExtractText(
                              `https://drive.google.com/uc?id=${
                                email.PDFLINK?.match(
                                  /\/d\/([a-zA-Z0-9_-]+)\//
                                )[1]
                              }`,
                              index,
                              "inner"
                            )
                          }
                        >
                          View All Pdf Links
                        </button>
                      )}
                      {extractedTexts[`inner_${index}`] && (
                        <div
                          style={{
                            background: "#1d1d1d",
                            padding: 20,
                            marginTop: "",
                          }}
                        >
                          {extractedUrls[`inner_${index}`] ? (
                            <>
                              <p className="text-xl text-green-500">
                                Links Found in the Mail . . .
                              </p>
                              {`------------------`}
                              {extractedUrls[`inner_${index}`]?.map((url) => (
                                <pre
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    color: "#fff",
                                  }}
                                >
                                  <a
                                    target="_blank"
                                    className="underline"
                                    href={url}
                                  >
                                    {url}
                                  </a>
                                  <br />
                                </pre>
                              ))}
                              {`------------------`}
                            </>
                          ) : (
                            <>
                              <p className="text-xl text-yellow-500">
                                No Inner Links Found . . .
                              </p>
                              {`------------------`}
                            </>
                          )}
                        </div>
                      )}
                      {currentlyExtractingEmailIndex === index &&
                        loadingtext && <p>Loading . .</p>}
                      <br />
                      {/* <hr style={{ margin: "30px 0px 30px 0px" }} />
                <strong style={{ color: "#fff" }}>Message : </strong>
                <div>
                  {getEmailContent(email["MESSAGE"])}
                </div> */}
                    </li>
                  ))}
                  {receivedEmails.map((email, index) => (
                    <li
                      style={{
                        padding: "20px",
                        marginBottom: "",
                        // background: "#262626",
                        color: "#adadad",
                      }}
                      key={index}
                    >
                      {`--------------------------------`}
                      <br />
                      {email["RECEIVED"]}
                      <br />
                      <strong style={{ color: "#fff" }}>RECEIVED : </strong>
                      {""}
                      <a href={email?.PDFLINK}>{email?.SUBJECT}</a>
                      <br />
                      {email["PDFLINK"] === null ? (
                        <p>No Message</p>
                      ) : (
                        <button
                          onClick={() =>
                            handleExtractText(
                              `https://drive.google.com/uc?id=${
                                email.PDFLINK?.match(
                                  /\/d\/([a-zA-Z0-9_-]+)\//
                                )[1]
                              }`,
                              index,
                              "inner"
                            )
                          }
                        >
                          View All Links found
                        </button>
                      )}
                      {extractedTexts[`inner_${index}`] && (
                        <div
                          style={{
                            background: "#1d1d1d",
                            padding: 20,
                            marginTop: "",
                          }}
                        >
                          {extractedUrls[`inner_${index}`] ? (
                            <>
                              <p className="text-xl text-green-500">
                                Links Found in the Mail . . .
                              </p>
                              {`------------------`}
                              {extractedUrls[`inner_${index}`]?.map((url) => (
                                <pre
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    color: "#fff",
                                  }}
                                >
                                  <a
                                    target="_blank"
                                    className="underline"
                                    href={url}
                                  >
                                    {url}
                                  </a>
                                  <br />
                                </pre>
                              ))}
                              {`------------------`}
                            </>
                          ) : (
                            <>
                              <p className="text-xl text-yellow-500">
                                No Inner Links Found . . .
                              </p>
                              {`------------------`}
                            </>
                          )}
                        </div>
                      )}
                      {currentlyExtractingEmailIndex === index &&
                        loadingtext && <p>Loading . .</p>}
                      <br />
                      {/* <hr style={{ margin: "30px 0px 30px 0px" }} />
                <strong style={{ color: "#fff" }}>Message : </strong>
                <div>
                  {getEmailContent(email["MESSAGE"])}
                </div> */}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === "messages" && (
                <div className="">
                  {messages?.map((message, index) => (
                    <div className="">
                      {/* // <li style={{ padding: "20px", marginBottom: "20px", background: "#262626", color: "#adadad" }} key={index}> */}
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

                      {/* // </li> */}
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
                      </button>{" "}
                      {isLoading ? (
                        <p>Loading . . </p>
                      ) : (
                        <>
                          {/* {!masterembedlink?.length > 0 ? ( */}
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
                                {/* <br /> */}
                                <input
                                  className="cursor-not-allowed text-black rounded-md my-2 p-2 mr-4"
                                  disabled
                                  type="text"
                                  name="name"
                                  value={selectedData["Name"]}
                                />
                                {/* <br /> */}
                                {embedLink == "" ? (
                                  <button className="px-8 py-2 rounded-md dark:bg-[#1d1d1d] text-black cursor-not-allowed ">
                                    Add Link
                                  </button>
                                ) : (
                                  <button
                                    className="px-8 py-2 rounded-md dark:bg-[#1d1d1d] text-black"
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
                                  onChange={(e) =>
                                    setEmbedLink2(e.target.value)
                                  }
                                />{" "}
                                <input
                                  className="cursor-not-allowed text-black rounded-md my-2 p-2 mr-4"
                                  disabled
                                  type="text"
                                  name="name"
                                  value={selectedData["Name"]}
                                />
                                {/* <br /> */}
                                {embedLink2 == "" ? (
                                  <button className="px-8 py-2 rounded-md dark:bg-[#1d1d1d] text-black cursor-not-allowed ">
                                    Add Link
                                  </button>
                                ) : (
                                  <button
                                    className="px-8 py-2 rounded-md dark:bg-[#1d1d1d] text-black"
                                    onClick={handleEmbedLinkAdd2}
                                  >
                                    Add Link
                                  </button>
                                )}
                              </>
                            )}

                            {/* <input
                  className="text-white bg-[#1d1d1d] my-2 p-2 mr-4"
                  type="text"
                  name="link"
                  placeholder="Enter the Embed Link"
                  required
                  onChange={(e) => setEmbedLink(e.target.value)}
                />{" "} */}

                            {/* <JoditEditor
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
                {/* <br /> */}

                            {/* {console.log(embedLink)} */}
                          </div>
                          {/* ) : ( */}
                          <p>
                            Total Embed Links :{" "}
                            <strong className="text-white">
                              {masterembedlink?.length}
                            </strong>
                          </p>
                          {/* )} */}
                        </>
                      )}
                    </>
                  )}

                  <div className="flex items-center">
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
                  </a>
                  <br />
                  <br />
                  {masterembedlink?.length > 0 && (
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
                                  onClick={() => deleteEmbed(emb.id)}
                                >
                                  Delete This
                                </button>
                              )}
                            </div>{" "}
                            <div
                              dangerouslySetInnerHTML={{
                                __html: `${emb.link}`,
                              }}
                              // dangerouslySetInnerHTML={{
                              //   __html: `<iframe src="${emb.link}" width="100%" height="790px" frameBorder="0" style="border: 0;"></iframe>`,
                              // }}
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

// {activeTab === "messages" && (<div className="">
//             {messages.map((message, index) => (
//               <>
//               {/* // <li style={{ padding: "20px", marginBottom: "20px", background: "#262626", color: "#adadad" }} key={index}> */}
//                 {message.Type === "Outgoing" && (
//                   <>
//                     <strong style={{padding:"10px",marginBottom:"10px",background:"#202020",color: "#fff", float:"right"}}>Outgoing : {message.Text}</strong><br /><br />
//                   </>
//                 )}
//                 {message.Type === "Incoming" && (
//                   <>
//                     <strong style={{padding:"10px",marginBottom:"10px",background:"#606060" ,color: "#fff", float:"left" }}>Incoming : {message.Text}</strong><br /><br />

//                   </>
//                 )}

//               {/* // </li> */}
//               </>
//             ))}
//           </div>)}
