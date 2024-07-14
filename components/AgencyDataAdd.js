// import React, { useEffect, useState, useRef } from "react";
// import copy from "clipboard-copy";
// import { createClient } from "@supabase/supabase-js";
// import dynamic from "next/dynamic";
// import debounce from "lodash.debounce";
// import Login from "@/components/Login";
// import { setCookie } from "nookies";
// import { parse } from "cookie";
// const JoditEditor = dynamic(() => import("jodit-react"), {
//   ssr: false,
// });
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// const AddContent = () => {
//   const [agencyData, setAgencyData] = useState({
//     agencies: "",
//     tabs: [
//       {
//         name: "",
//         content: "",
//       },
//     ],
//   });

//   const [isLoading, setisLoading] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showmessage, setshowmessage] = useState("");

//   const handleTabNameChange = (index, name) => {
//     const updatedTabs = [...agencyData.tabs];
//     updatedTabs[index].name = name;
//     setAgencyData({ ...agencyData, tabs: updatedTabs });
//   };

//   const handleTabContentChange = (index, content) => {
//     const updatedTabs = [...agencyData.tabs];
//     updatedTabs[index].content = content;
//     setAgencyData({ ...agencyData, tabs: updatedTabs });
//   };

//   const addTab = () => {
//     const updatedTabs = [...agencyData.tabs, { name: "", content: "" }];
//     setAgencyData({ ...agencyData, tabs: updatedTabs });
//   };

//   const removeTab = (index) => {
//     const updatedTabs = agencyData.tabs.filter((_, i) => i !== index);
//     setAgencyData({ ...agencyData, tabs: updatedTabs });
//   };

//   const handleLoginSuccess = () => {
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     // Set the "isLoggedIn" cookie to expire immediately
//     setCookie(null, "isLoggedIn", "true", { maxAge: -1 });
//     setIsLoggedIn(false);
//   };

//   const submitResponse = async () => {
//     try {
//       setisLoading(true);
//       if (!agencyData.agencies) {
//         setshowmessage("Agency name is required");
//         return;
//       }

//       const { data, error } = await supabase.from("Liverpooldata").upsert([
//         {
//           agencies: agencyData.agencies,
//           tabs: agencyData.tabs,
//         },
//       ]);

//       if (error) {
//         console.error("Error inserting data:", error.message);
//         setshowmessage("Error inserting data");
//       } else {
//         console.log("Data inserted successfully:", data);
//         setAgencyData({
//           agencies: "",
//           tabs: [
//             {
//               name: "",
//               content: "",
//             },
//           ],
//         });
//         setshowmessage("Data inserted successfully");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setisLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Parse the cookie after the page is mounted
//     const cookies = parse(document.cookie);
//     setIsLoggedIn(cookies.isLoggedIn === "true");
//   }, []);

//   setTimeout(() => {
//     setshowmessage("");
//   }, 5000);

//   return (
//     <>
//       {isLoggedIn ? (
//         <div className="container mx-auto p-6">

//           <h6 className="pb-6">Add Agency : : : </h6>
//           <input
//             value={agencyData.agencies}
//             onChange={(e) =>
//               setAgencyData({ ...agencyData, agencies: e.target.value })
//             }
//             type="text"
//             className="bg-[#1d1d1d] border-2 border-[#262626] px-4 py-2 mb-6 text-white "
//           />
//           {agencyData.tabs.map((tab, index) => (
//             <div className="">
//                 <p>TAB {index + 1}</p>
//             </div>
//           ))}
//           {agencyData.tabs.map((tab, index) => (
//             <div key={index}>
//               <h6 className="pb-6">Tab {index + 1} Name: : : </h6>
//               <input
//                 value={tab.name}
//                 onChange={(e) => handleTabNameChange(index, e.target.value)}
//                 type="text"
//                 className="bg-[#1d1d1d] border-2 border-[#262626] px-4 py-2 mb-6 text-white"
//               />
//               <h6 className="py-6">Tab {index + 1} Content: : : </h6>
//               <JoditEditor
//                 value={tab.content}
//                 config={{
//                   autofocus: false,
//                   readonly: false,
//                   theme: "dark",
//                   statusbar: false,
//                 }}
//                 onBlur={(content) => handleTabContentChange(index, content)}
//               />
//               {agencyData.tabs.length > 1 && (
//                 <button
//                   onClick={() => removeTab(index)}
//                   className="text-white px-8 py-2 cursor-pointer bg-[#1d1d1d] my-5"
//                 >
//                   Remove Tab
//                 </button>
//               )}
//             </div>
//           ))}
//           <button
//             className="text-white px-8 py-2 cursor-pointer bg-[#1d1d1d] my-5"
//             onClick={addTab}
//           >
//             Add Tab
//           </button><br />
//           <button
//             className="text-white px-8 py-2 cursor-pointer bg-[#1d1d1d] my-5"
//             onClick={submitResponse}
//           >
//             Add Content
//           </button>
//           {showmessage && <p className="text-white">{showmessage}</p>}
//         </div>
//       ) : (
//         <Login onSuccess={handleLoginSuccess} />
//       )}
//     </>
//   );
// };

// export default AddContent;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import Login from "@/components/Login";
import { setCookie } from "nookies";
import { parse } from "cookie";
import LoadingComponent from "./LoadingComponent";
import debounce from "lodash.debounce";
import { TiDeleteOutline } from "react-icons/ti";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { FaXmark } from "react-icons/fa6";
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AddContent = ({ agencyMaster }) => {
  const [agencyData, setAgencyData] = useState({
    agencies: "",
    tabs: [
      {
        name: "Tab1",
        content: "",
        images: [],
        documents: [],
        accordions: [],
        evidences: [],
        questions: [],
        lock: false,
      },
    ],
  });

  const config = useMemo(
    () => ({
      readonly: false,
      toolbarButtonSize: "small",
      autofocus: false,
      readonly: false,
      theme: "dark",
      statusbar: false,
      minHeight: "100px",
    }),
    []
  );

  const [isLoading, setisLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showmessage, setshowmessage] = useState("");
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const editor = useRef(null);

  useEffect(() => {
    console.log(agencyMaster);
    // Fetch data from Supabase if agencyMaster has an id
    if (agencyMaster && agencyMaster.id) {
      setisLoading(true);
      const fetchData = async () => {
        try {
          const { data, error } = await supabase
            .from("Liverpooldata")
            .select()
            .eq("id", agencyMaster.id)
            .single();
          setisLoading(false);

          if (error) {
            console.error("Error fetching data:", error.message);
            setshowmessage("Error fetching data");
          } else {
            // Set the fetched data as initial values
            setAgencyData({
              agencies: data.agencies,
              tabs: data.tabs,
            });
            setisLoading(false);
          }
        } catch (error) {
          console.error("Error:", error);
          setisLoading(false);
        }
      };

      fetchData();
    }
  }, [agencyMaster]);

  const addAccordion = () => {
    // Ensure that accordions is initialized as an array
    const updatedAccordions = [
      ...(agencyData.tabs[selectedTabIndex]?.accordions || []), // Use the correct property name
      { title: "", content: "", fullWidth: false },
    ];

    // Update the state to add a new accordion
    const updatedTabs = [...agencyData.tabs];
    updatedTabs[selectedTabIndex].accordions = updatedAccordions;
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const removeAccordion = (tabIndex, accordionIndex) => {
    const updatedTabs = [...agencyData.tabs];
    updatedTabs[tabIndex].accordions = updatedTabs[tabIndex].accordions.filter(
      (_, index) => index !== accordionIndex
    );
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const handleAccordionTitleChange = (tabIndex, accordionIndex, title) => {
    const updatedTabs = [...agencyData.tabs];
    updatedTabs[tabIndex].accordions[accordionIndex].title = title;
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const handleAccordionContentChange = (tabIndex, accordionIndex, content) => {
    const updatedTabs = [...agencyData.tabs];
    updatedTabs[tabIndex].accordions[accordionIndex].content = content;
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const handleAccordionStateChange = (tabIndex, accordionIndex, state) => {
    const updatedTabs = [...agencyData.tabs];
    updatedTabs[tabIndex].accordions[accordionIndex].fullWidth = state;
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const addEvidence = () => {
    // Ensure that accordions is initialized as an array
    const updatedEvidences = [
      ...(agencyData.tabs[selectedTabIndex]?.evidences || []), // Use the correct property name
      { title: "", content: "" },
    ];

    // Update the state to add a new accordion
    const updatedTabs = [...agencyData.tabs];
    updatedTabs[selectedTabIndex].evidences = updatedEvidences;
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const removeEvidence = (tabIndex, accordionIndex) => {
    const updatedTabs = [...agencyData.tabs];
    updatedTabs[tabIndex].evidences = updatedTabs[tabIndex].evidences.filter(
      (_, index) => index !== accordionIndex
    );
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const handleEvidenceTitleChange = (tabIndex, accordionIndex, title) => {
    const updatedTabs = [...agencyData.tabs];
    updatedTabs[tabIndex].evidences[accordionIndex].title = title;
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const handleEvidenceContentChange = (tabIndex, accordionIndex, content) => {
    const updatedTabs = [...agencyData.tabs];
    updatedTabs[tabIndex].evidences[accordionIndex].content = content;
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const addQuestion = () => {
    // Ensure that accordions is initialized as an array
    const updatedQuestions = [
      ...(agencyData.tabs[selectedTabIndex]?.questions || []), // Use the correct property name
      { que: "", ans: [] },
    ];

    // Update the state to add a new accordion
    const updatedTabs = [...agencyData.tabs];
    updatedTabs[selectedTabIndex].questions = updatedQuestions;
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const removeQuestion = (tabIndex, accordionIndex) => {
    const updatedTabs = [...agencyData.tabs];
    updatedTabs[tabIndex].questions = updatedTabs[tabIndex].questions.filter(
      (_, index) => index !== accordionIndex
    );
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const removeAnswers = (tabIndex, accordionIndex) => {
    const updatedTabs = [...agencyData.tabs];
    // Assuming each question object has an `ans` array
    updatedTabs[tabIndex].questions[accordionIndex].ans = updatedTabs[
      tabIndex
    ].questions[accordionIndex].ans.filter(
      (_, index) => index !== accordionIndex
    );
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const handleQuestionTitleChange = (tabIndex, accordionIndex, title) => {
    const updatedTabs = [...agencyData.tabs];
    updatedTabs[tabIndex].questions[accordionIndex].que = title;
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  // const handleQuestionContentChange = (tabIndex, accordionIndex, content) => {
  //   const updatedTabs = [...agencyData.tabs];
  //   updatedTabs[tabIndex].questions[accordionIndex].ans = content;
  //   setAgencyData({ ...agencyData, tabs: updatedTabs });
  // };

  const handleImageUpload = async (file) => {
    try {
      setisLoading(true);

      const timestamp = new Date().getTime();
      const uniqueFilename = `${timestamp}_${file.name}`;

      const { data, error } = await supabase.storage
        .from("Images")
        .upload(uniqueFilename, file, {
          cacheControl: "3600",
          upsert: false,
        });

      console.log(data);

      if (error) {
        console.error("Error uploading image:", error.message);
        return;
      }

      const filePath = data.path;
      const bucketName = "Images";

      const imageUrl = `${
        process.env.NEXT_PUBLIC_SUPABASE_URL
      }/storage/v1/object/public/${bucketName}/${encodeURIComponent(filePath)}`;

      // Add the uploaded image URL to the current tab's content
      const updatedTabs = [...agencyData.tabs];
      updatedTabs[selectedTabIndex].images = [
        ...(updatedTabs[selectedTabIndex].images || []),
        imageUrl,
      ];

      setAgencyData({ ...agencyData, tabs: updatedTabs });

      setisLoading(false);
    } catch (error) {
      console.error("Error handling image upload:", error.message);
      setisLoading(false);
    }
  };

  const handleTabNameChange = (index, name) => {
    const updatedTabs = [...agencyData.tabs];
    updatedTabs[index].name = name;
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const handleTabContentChange = (index, content) => {
    const updatedTabs = [...agencyData.tabs];
    updatedTabs[index].content = content;
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const addTab = () => {
    const updatedTabs = [
      ...agencyData.tabs,
      {
        name: `Tab${agencyData.tabs.length + 1}`,
        content: "",
        images: [],
        documents: [],
        accordions: [],
        evidences: [],
        questions: [],
        lock: false,
      },
    ];

    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const removeTab = (index) => {
    const updatedTabs = agencyData.tabs.filter((_, i) => i !== index);
    setAgencyData({ ...agencyData, tabs: updatedTabs });

    // Adjust selectedTabIndex if the removed tab was currently selected
    if (index === selectedTabIndex) {
      setSelectedTabIndex(Math.max(0, index - 1));
    }
  };

  const handleTabClick = (index) => {
    setSelectedTabIndex(index);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Set the "isLoggedIn" cookie to expire immediately
    setCookie(null, "isLoggedIn", "true", { maxAge: -1 });
    setIsLoggedIn(false);
  };

  const submitResponse = async () => {
    try {
      setisLoading(true);

      if (!agencyData.agencies) {
        setshowmessage("Agency name is required");
        return;
      }

      if (agencyMaster && agencyMaster.id) {
        // Fetch data from Supabase if agencyMaster has an id
        const existingRecord = await supabase
          .from("Liverpooldata")
          .select()
          .eq("id", agencyMaster.id)
          .single();

        if (existingRecord.error) {
          console.error(
            "Error checking existing record:",
            existingRecord.error.message
          );
          setshowmessage("Error checking existing record");
          return;
        }

        const isNameChanged =
          existingRecord.data?.agencies !== agencyData.agencies;

        if (existingRecord.data && !isNameChanged) {
          // Update existing record
          const { data: updateData, error: updateError } = await supabase
            .from("Liverpooldata")
            .upsert([
              {
                id: agencyMaster.id,
                agencies: agencyData.agencies,
                tabs: agencyData.tabs,
              },
            ]);

          if (updateError) {
            console.error("Error updating data:", updateError.message);
            setshowmessage("Error updating data");
          } else {
            console.log("Data updated successfully:", updateData);
            setshowmessage("Data updated successfully");
          }
        } else {
          // Insert new record
          const { data, error } = await supabase.from("Liverpooldata").upsert([
            {
              agencies: agencyData.agencies,
              tabs: agencyData.tabs,
            },
          ]);

          if (error) {
            console.error("Error inserting data:", error.message);
            setshowmessage("Error inserting data");
          } else {
            console.log("Data inserted successfully:", data);
            setAgencyData({
              agencies: "",
              tabs: [
                {
                  name: "Tab1",
                  content: "",
                  images: [],
                  documents: [],
                  accordions: [],
                  evidences: [],
                  questions: [],
                  lock: false,
                },
              ],
            });
            setshowmessage("Data inserted successfully");
          }
        }
      } else {
        // Insert new record without an agencyMaster (new ID will be generated)
        const { data, error } = await supabase.from("Liverpooldata").upsert([
          {
            agencies: agencyData.agencies,
            tabs: agencyData.tabs,
          },
        ]);

        if (error) {
          console.error("Error inserting data:", error.message);
          setshowmessage("Error inserting data");
        } else {
          console.log("Data inserted successfully:", data);
          setAgencyData({
            agencies: "",
            tabs: [
              {
                name: "Tab1",
                content: "",
                images: [],
                documents: [],
                accordions: [],
                evidences: [],
                questions: [],
                lock: false,
              },
            ],
          });
          setshowmessage("Data inserted successfully");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    // Parse the cookie after the page is mounted
    const cookies = parse(document.cookie);
    setIsLoggedIn(cookies.isLoggedIn === "true");
  }, []);

  setTimeout(() => {
    setshowmessage("");
  }, 5000);

  const handleTabLockChange = (index, isLocked) => {
    const updatedTabs = [...agencyData.tabs];
    updatedTabs[index].lock = isLocked;
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const handleDeleteImage = async (index) => {
    try {
      setisLoading(true);

      const updatedImages = [...agencyData.tabs[selectedTabIndex]?.images];
      const deletedImageUrl = updatedImages.splice(index, 1)[0];

      // Update the state to remove the deleted image
      const updatedTabs = [...agencyData.tabs];
      updatedTabs[selectedTabIndex].images = updatedImages;
      setAgencyData({ ...agencyData, tabs: updatedTabs });

      // Delete the image from Supabase storage
      const { error } = await supabase.storage
        .from("Images")
        .remove([deletedImageUrl]);

      if (error) {
        console.error("Error deleting image:", error.message);
      }
    } catch (error) {
      console.error("Error handling image deletion:", error.message);
    } finally {
      setisLoading(false);
    }
  };

  const handleDocumentUpload = async (file) => {
    try {
      setisLoading(true);

      const timestamp = new Date().getTime();
      const uniqueFilename = `${timestamp}_${file.name}`;

      const { data, error } = await supabase.storage
        .from("Documents")
        .upload(uniqueFilename, file, {
          cacheControl: "3600",
          upsert: false,
        });

      console.log(data);

      if (error) {
        console.error("Error uploading document:", error.message);
        return;
      }

      const filePath = data.path;
      const bucketName = "Documents";

      const documentUrl = `${
        process.env.NEXT_PUBLIC_SUPABASE_URL
      }/storage/v1/object/public/${bucketName}/${encodeURIComponent(filePath)}`;

      // Add the uploaded document URL to the current tab's content
      const updatedTabs = [...agencyData.tabs];
      updatedTabs[selectedTabIndex].documents = [
        ...(updatedTabs[selectedTabIndex].documents || []),
        documentUrl,
      ];

      setAgencyData({ ...agencyData, tabs: updatedTabs });

      setisLoading(false);
    } catch (error) {
      console.error("Error handling document upload:", error.message);
      setisLoading(false);
    }
  };

  const handleDeleteDocument = async (index) => {
    try {
      setisLoading(true);

      const updatedDocuments = [
        ...agencyData.tabs[selectedTabIndex]?.documents,
      ];
      const deletedDocumentUrl = updatedDocuments.splice(index, 1)[0];

      // Update the state to remove the deleted document
      const updatedTabs = [...agencyData.tabs];
      updatedTabs[selectedTabIndex].documents = updatedDocuments;
      setAgencyData({ ...agencyData, tabs: updatedTabs });

      // Delete the document from Supabase storage
      const { error } = await supabase.storage
        .from("Documents")
        .remove([deletedDocumentUrl]);

      if (error) {
        console.error("Error deleting document:", error.message);
      }
    } catch (error) {
      console.error("Error handling document deletion:", error.message);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="container mx-auto p-6 overflow-y-auto">
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <>
              {agencyMaster ? (
                <>
                  <a
                    target="_blank"
                    href={`https://www.justice-minds.com/agency/${agencyData.agencies}id=${agencyMaster.id}`}
                    className="px-4 py-3 bg-[#1d1d1d] text-white"
                    style={{ borderRadius: "5px" }}
                  >
                    Visit Page
                  </a>
                  <h5 className="pb-6 mt-6 text-lg">Edit Agency : : : </h5>
                </>
              ) : (
                <h5 className="pb-6  text-lg">Add Agency : : : </h5>
              )}
              <input
                value={agencyData.agencies}
                onChange={(e) =>
                  setAgencyData({ ...agencyData, agencies: e.target.value })
                }
                type="text"
                className="bg-[#1d1d1d] border-2 border-[#262626] px-4 py-2 mb-6 text-white rounded-md"
              />
              {/* <button
            className="text-white px-8 py-2 cursor-pointer bg-[#1d1d1d] my-5"
            onClick={addTab}
          >
            Add Tab
          </button> */}
              <div className="flex">
                {agencyData.tabs.map((tab, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 cursor-pointer p-2 border border-[#262626] rounded-md ${
                      index === selectedTabIndex
                        ? "bg-[#262626]"
                        : "text-gray-400"
                    }`}
                    onClick={() => handleTabClick(index)}
                  >
                    <span>{tab.name}</span>

                    <input
                      type="checkbox"
                      checked={tab.lock}
                      onChange={(e) =>
                        handleTabLockChange(index, e.target.checked)
                      }
                    />

                    <TiDeleteOutline
                      onClick={() => removeTab(index)}
                      size={18}
                      className="text-red-500"
                    />
                  </div>
                ))}
                <button
                  className="cursor-pointer p-2 border ml-1 border-[#262626] bg-[#262626] text-white rounded-md"
                  onClick={addTab}
                >
                  +
                </button>
              </div>
              <br />
              <div>
                <h6 className="pb-6 mt-3">
                  Tab {selectedTabIndex + 1} Name: : :{" "}
                </h6>
                <input
                  value={agencyData.tabs[selectedTabIndex]?.name || ""}
                  onChange={(e) =>
                    handleTabNameChange(selectedTabIndex, e.target.value)
                  }
                  type="text"
                  className="bg-[#1d1d1d] border-2 border-[#262626] px-4 py-2 mb-2 text-white rounded-md"
                />

                <h6 className="py-6">
                  Tab {selectedTabIndex + 1} Content: : :{" "}
                </h6>
                <JoditEditor
                  ref={editor}
                  value={agencyData.tabs[selectedTabIndex]?.content || ""}
                  config={config}
                  onChange={(content) =>
                    // (content) =>
                    // handleTabContentChange(selectedTabIndex, content)
                    handleTabContentChange(selectedTabIndex, content)
                  }
                />
                {/* 
<JoditEditor
                                ref={editor}
                                value={message}
                                config={{
                                  toolbarButtonSize: "small",
                                  autofocus: false,
                                  readonly: false,
                                  theme: "dark",
                                  statusbar: false,
                                  minHeight: "100px",
                                }}
                                onBlur={handleMessageDebounced}
                              /> */}
              </div>
              <br />
              <div className="flex flex-row gap-3 w-full">
                <div className="w-1/2">
                  <h6 className="py-3">
                    Tab {selectedTabIndex + 1} Accordions: : :
                  </h6>
                  <button
                    className="text-white px-8 py-2 cursor-pointer bg-[#1d1d1d] my-5 rounded-md"
                    onClick={addAccordion}
                  >
                    Add Accordion
                  </button>
                  {agencyData.tabs[selectedTabIndex]?.accordions?.map(
                    (accordion, accordionIndex) => (
                      <Accordion
                        key={accordionIndex}
                        type={"single"}
                        collapsible
                        className="w-full"
                      >
                        <AccordionItem
                          className="text-md border-0 mb-2"
                          value={accordionIndex + 1}
                        >
                          <div className="flex gap-2 items-center">
                            <input
                              value={accordion.title}
                              onChange={(e) =>
                                handleAccordionTitleChange(
                                  selectedTabIndex,
                                  accordionIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Accordion ${
                                accordionIndex + 1
                              } Title`}
                              type="text"
                              className="bg-[#000] w-full border-2 border-[#262626] px-4 py-2 text-white rounded-md "
                            />
                            <AccordionTrigger className="bg-[#1c1c1c] p-3 rounded-lg w-full"></AccordionTrigger>
                          </div>
                          <AccordionContent className="p-3 bg-[#121212] rounded-lg">
                            <JoditEditor
                              value={accordion.content}
                              config={config}
                              onChange={(content) =>
                                handleAccordionContentChange(
                                  selectedTabIndex,
                                  accordionIndex,
                                  content
                                )
                              }
                            />
                            <br />
                            Make full Width :{" "}
                            <input
                              type="checkbox"
                              checked={accordion.fullWidth}
                              onChange={(e) =>
                                handleAccordionStateChange(
                                  selectedTabIndex,
                                  accordionIndex,
                                  e.target.checked
                                )
                              }
                            />
                            <br />
                            <button
                              className="px-8 py-2 cursor-pointer bg-[#0b0202] my-3 rounded-md text-red-500"
                              onClick={() =>
                                removeAccordion(
                                  selectedTabIndex,
                                  accordionIndex
                                )
                              }
                            >
                              Remove
                            </button>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )
                  )}
                </div>
                <div className="w-1/2">
                  <h6 className="py-3">
                    Tab {selectedTabIndex + 1} Evidence: : :
                  </h6>
                  <button
                    className="text-white px-8 py-2 cursor-pointer bg-[#1d1d1d] my-5 rounded-md"
                    onClick={addEvidence}
                  >
                    Add Evidence
                  </button>
                  {agencyData.tabs[selectedTabIndex]?.evidences?.map(
                    (evidence, accordionIndex) => (
                      <Accordion
                        key={accordionIndex}
                        type={"single"}
                        collapsible
                        className="w-full"
                      >
                        <AccordionItem
                          className="text-md border-0 mb-2"
                          value={accordionIndex + 1}
                        >
                          <div className="flex gap-2 items-center">
                            <input
                              value={evidence.title}
                              onChange={(e) =>
                                handleEvidenceTitleChange(
                                  selectedTabIndex,
                                  accordionIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Evidence ${
                                accordionIndex + 1
                              } Title`}
                              type="text"
                              className="bg-[#000] w-full border-2 border-[#262626] px-4 py-2 text-white rounded-md "
                            />
                            <AccordionTrigger className="bg-[#1c1c1c] p-3 rounded-lg w-full"></AccordionTrigger>
                          </div>
                          <AccordionContent className="p-3 bg-[#121212] rounded-lg">
                            <JoditEditor
                              value={evidence.content}
                              config={config}
                              onChange={(content) =>
                                handleEvidenceContentChange(
                                  selectedTabIndex,
                                  accordionIndex,
                                  content
                                )
                              }
                            />
                            <button
                              className="px-8 py-2 cursor-pointer bg-[#0b0202] my-3 rounded-md text-red-500"
                              onClick={() =>
                                removeEvidence(selectedTabIndex, accordionIndex)
                              }
                            >
                              Remove
                            </button>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )
                  )}
                </div>
              </div>

              <br />

              <div className="w-full">
                <h6 className="py-3">
                  Tab {selectedTabIndex + 1} Questions: : :
                </h6>
                <button
                  className="text-white px-8 py-2 cursor-pointer bg-[#1d1d1d] my-5 rounded-md"
                  onClick={addQuestion}
                >
                  Add Question
                </button>
                {agencyData.tabs[selectedTabIndex]?.questions?.map(
                  (accordion, accordionIndex) => (
                    <Accordion
                      key={accordionIndex}
                      type={"single"}
                      collapsible
                      className="w-full"
                    >
                      <AccordionItem
                        className="text-md border-0 mb-2"
                        value={accordionIndex + 1}
                      >
                        <div className="flex gap-2 items-center">
                          <input
                            value={accordion.que}
                            onChange={(e) =>
                              handleQuestionTitleChange(
                                selectedTabIndex,
                                accordionIndex,
                                e.target.value
                              )
                            }
                            placeholder={`Question ${accordionIndex + 1}`}
                            type="text"
                            className="bg-[#000] w-full border-2 border-[#262626] px-4 py-2 text-white rounded-md "
                          />
                          <button
                            className="px-8 py-2 cursor-pointer bg-[#0b0202] my-3 rounded-md text-red-500"
                            onClick={() =>
                              removeQuestion(selectedTabIndex, accordionIndex)
                            }
                          >
                            Remove
                          </button>
                          <AccordionTrigger className="bg-[#1c1c1c] p-3 rounded-lg w-full"></AccordionTrigger>
                        </div>
                        <AccordionContent className="p-3 bg-[#121212] rounded-lg">
                          {accordion?.ans.length === 0 ? (
                            <p>No Answers</p>
                          ) : (
                            <>
                              {accordion?.ans.map((answer, answerIndex) => (
                                <div
                                  key={answerIndex}
                                  className="flex gap-2 mb-1 items-center w-1/2"
                                >
                                  <p>{answer}</p>
                                  <button
                                    className="text-white px-3 py-1 cursor-pointer bg-[#1d1d1d] rounded-md"
                                    onClick={() =>
                                      removeAnswers(
                                        selectedTabIndex,
                                        answerIndex
                                      )
                                    }
                                  >
                                    Remove Answer
                                  </button>
                                </div>
                              ))}
                            </>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )
                )}
              </div>

              <h6 className="py-6">Tab {selectedTabIndex + 1} Images: : : </h6>
              <input
                type="file"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                accept="image/*"
                className="mb-2"
              />
              <br />
              {agencyData.tabs[selectedTabIndex]?.images?.map(
                (imageUrl, index) => (
                  <div key={index} className="relative mt-5 mr-3 inline-block">
                    <img
                      src={imageUrl}
                      alt={`Uploaded Image ${index + 1}`}
                      className="w-32 rounded-md h-32 object-cover mr-2 mb-2"
                    />

                    <TiDeleteOutline
                      className="text-red-500 absolute top-0 -right-3"
                      onClick={() => handleDeleteImage(index)}
                      size={18}
                    />
                  </div>
                )
              )}
              <br />

              <h6 className="py-6">
                Tab {selectedTabIndex + 1} Documents: : :{" "}
              </h6>
              <input
                type="file"
                onChange={(e) => handleDocumentUpload(e.target.files[0])}
                accept=".pdf, .doc, .docx, .mp3"
                className="mb-2"
              />
              <br />
              {agencyData.tabs[selectedTabIndex]?.documents?.map(
                (documentUrl, index) => (
                  <div key={index} className="relative mt-5 mr-3 inline-block">
                    <iframe
                      title={`Uploaded Document ${index + 1}`}
                      src={documentUrl}
                      width="300"
                      height="200"
                    ></iframe>
                    <TiDeleteOutline
                      className="text-red-500 absolute top-0 -right-3"
                      onClick={() => handleDeleteDocument(index)}
                      size={18}
                    />
                  </div>
                )
              )}
              <br />

              <br />
              {agencyMaster ? (
                <button
                  className="text-white px-8 py-2 cursor-pointer bg-[#1d1d1d] my-5 rounded-md"
                  onClick={submitResponse}
                >
                  Edit Content
                </button>
              ) : (
                <button
                  className="text-green-500 px-8 py-2 cursor-pointer bg-[#051503] my-5 rounded-md"
                  onClick={submitResponse}
                >
                  Add Content
                </button>
              )}
              {showmessage && <p className="text-white">{showmessage}</p>}
            </>
          )}
        </div>
      ) : (
        <Login onSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default AddContent;
