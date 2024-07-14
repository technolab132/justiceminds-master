// import React, {useState, useEffect} from 'react'
// import Link from "next/link";
// import Navbar from "@/components/Navbar";
// import Login from "@/components/Login";
// import { setCookie } from "nookies";
// import { parse } from "cookie";
// import LoadingComponent from "@/components/LoadingComponent";
// import { createClient } from '@supabase/supabase-js';
// import { AssemblyAI } from 'assemblyai';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);
// const client = new AssemblyAI({ apiKey: 'e837af9c56674f6eb72ad23199c060ce' });

// const TranscribePage = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [file, setFile] = useState(null);
//   const [transcription, setTranscription] = useState('');
//   const [isTranscribing, setIsTranscribing] = useState(false);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleUploadAndTranscribe = async () => {
//     if (!file) {
//       console.error('No file selected');
//       return;
//     }

//     try {
//       setIsTranscribing(true);
//       const timestamp = new Date().getTime();
//       const uniqueFilename = `${timestamp}_${file.name}`;
//       const { data, error } = await supabase.storage.from('Documents').upload(uniqueFilename, file, {
//         cacheControl: '3600',
//         upsert: false,
//       });

//       if (error) {
//         console.error('Error uploading file to Supabase:', error.message);
//         setIsTranscribing(false);
//         return;
//       }

//       const audioUrl = `https://kxdizugmndorfkztghbi.supabase.co/storage/v1/object/public/Documents/${encodeURIComponent(data.path)}`;
//       const params = { audio: audioUrl, speaker_labels: true };
//       const transcript = await client.transcripts.transcribe(params);
//       let fullTranscript = '';
//       for (let utterance of transcript.utterances || []) {
//         fullTranscript += `Speaker ${utterance.speaker}: ${utterance.text}\n`;
//       }
//       console.log("Full Transcript: " + fullTranscript);
//       setTranscription(fullTranscript);
//       setIsTranscribing(false);
//     } catch (error) {
//       console.error('Error:', error.message);
//       setIsTranscribing(false);
//     }
//   };

//   const handleLoginSuccess = () => {
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     // Set the "isLoggedIn" cookie to expire immediately
//     setCookie(null, "isLoggedIn", "true", { maxAge: -1 });
//     setIsLoggedIn(false);
//   };

//   useEffect(() => {
//     // Parse the cookie after the page is mounted
//     const cookies = parse(document.cookie);
//     setIsLoggedIn(cookies.isLoggedIn === "true");
//   }, []);

//   return (
//     <>
//       {isLoggedIn ? (
//         <>
//           <Navbar />
//           <div className="p-4 mt-[80px]">
//             <h2>Transcription : </h2>
//             <input type="file" onChange={handleFileChange} />
//             <button
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
//               onClick={handleUploadAndTranscribe}
//             >
//               Upload & Transcribe
//             </button>
//             {isTranscribing && <LoadingComponent />}
//             {transcription && (
//               <div className="mt-4">
//                 <h2 className="font-bold text-lg">Transcription:</h2>
//                 <p>{transcription}</p>
//               </div>
//             )}
//           </div>
//         </>
//       ) : (
//         <Login onSuccess={handleLoginSuccess} />
//       )}
//     </>
//   );
// };

// export default TranscribePage;

// import React, { useState, useEffect } from 'react';
// import Link from "next/link";
// import Navbar from "@/components/Navbar";
// import Login from "@/components/Login";
// import { setCookie } from "nookies";
// import { parse } from "cookie";
// import LoadingComponent from "@/components/LoadingComponent";
// import { createClient } from '@supabase/supabase-js';
// import { AssemblyAI } from 'assemblyai';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);
// const client = new AssemblyAI({ apiKey: 'e837af9c56674f6eb72ad23199c060ce' });

// const TranscribePage = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [file, setFile] = useState(null);
//   const [transcripts, setTranscripts] = useState([]);
//   const [chats, setChats] = useState([]);
//   const [isTranscribing, setIsTranscribing] = useState(false);
//   const [prompt, setPrompt] = useState('');
//   const [response, setResponse] = useState('');

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleUploadAndTranscribe = async () => {
//     if (!file) {
//       console.error('No file selected');
//       return;
//     }

//     try {
//       setIsTranscribing(true);
//       const timestamp = new Date().getTime();
//       const uniqueFilename = `${timestamp}_${file.name}`;
//       const { data, error } = await supabase.storage.from('Documents').upload(uniqueFilename, file, {
//         cacheControl: '3600',
//         upsert: false,
//       });

//       if (error) {
//         console.error('Error uploading file to Supabase:', error.message);
//         setIsTranscribing(false);
//         return;
//       }

//       const audioUrl = `https://kxdizugmndorfkztghbi.supabase.co/storage/v1/object/public/Documents/${encodeURIComponent(data.path)}`;
//       const params = { audio: audioUrl, speaker_labels: true };
//       const transcript = await client.transcripts.transcribe(params);
//       const { error: dbError } = await supabase.from('transcripts').insert({ filename: uniqueFilename, transcript: transcript.text });
//       if (dbError) {
//         console.error('Error saving transcript to Supabase:', dbError.message);
//       }
//       await fetchTranscripts();
//       setIsTranscribing(false);
//     } catch (error) {
//       console.error('Error:', error.message);
//       setIsTranscribing(false);
//     }
//   };

//   const handlePromptChange = (event) => {
//     setPrompt(event.target.value);
//   };

//   const handleChat = async () => {
//     try {
//       const { response } = await client.lemur.task({ transcript_ids: [transcripts[0].id], prompt });
//       setResponse(response);
//       // Save the chat to Supabase
//       const { error } = await supabase.from('aschats').insert({ transcript_id: transcripts[0].id, prompt, response });
//       if (error) {
//         console.error('Error saving chat to Supabase:', error.message);
//       }
//       await fetchChats();
//     } catch (error) {
//       console.error('Error:', error.message);
//     }
//   };

//   const handleLoginSuccess = () => {
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     // Set the "isLoggedIn" cookie to expire immediately
//     setCookie(null, "isLoggedIn", "true", { maxAge: -1 });
//     setIsLoggedIn(false);
//   };

//   useEffect(() => {
//     // Parse the cookie after the page is mounted
//     const cookies = parse(document.cookie);
//     setIsLoggedIn(cookies.isLoggedIn === "true");
//     fetchTranscripts();
//     fetchChats();
//   }, []);

//   const fetchTranscripts = async () => {
//     const { data, error } = await supabase.from('transcripts').select('*');
//     if (error) {
//       console.error('Error fetching transcripts:', error.message);
//     } else {
//       setTranscripts(data);
//     }
//   };

//   const fetchChats = async () => {
//     const { data, error } = await supabase.from('aschats').select('*');
//     if (error) {
//       console.error('Error fetching chats:', error.message);
//     } else {
//       setChats(data);
//     }
//   };

//   return (
//     <>
//       {isLoggedIn ? (
//         <>
//           <Navbar />
//           <div className="p-4 mt-[80px]">
//             <h2>Transcriptions:</h2>
//             <input type="file" onChange={handleFileChange} />
//             <button
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
//               onClick={handleUploadAndTranscribe}
//             >
//               Upload & Transcribe
//             </button>
//             {isTranscribing && <LoadingComponent />}
//             {transcripts.map((transcript) => (
//               <div key={transcript.id} className="mt-4">
//                 <h3 className="font-bold text-lg">{transcript.filename}</h3>
//                 <p>{transcript.transcript}</p>
//               </div>
//             ))}
//             <h2>Chat with Assembly AI:</h2>
//             <input
//               type="text"
//               value={prompt}
//               onChange={handlePromptChange}
//               placeholder="Enter a prompt"
//               className="border border-gray-300 p-2 rounded w-full mb-4"
//             />
//             <button
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//               onClick={handleChat}
//             >
//               Chat
//             </button>
//             {response && (
//               <div className="mt-4">
//                 <h2 className="font-bold text-lg">Response:</h2>
//                 <p>{response}</p>
//               </div>
//             )}
//             <h2>Chat History:</h2>
//             {chats.map((chat) => (
//               <div key={chat.id} className="mt-4">
//                 <h3 className="font-bold text-lg">Prompt:</h3>
//                 <p>{chat.prompt}</p>
//                 <h3 className="font-bold text-lg">Response:</h3>
//                 <p>{chat.response}</p>
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         <Login onSuccess={handleLoginSuccess} />
//       )}
//     </>
//   );
// };

// export default TranscribePage;

// import React, { useState, useEffect } from 'react';
// import Link from "next/link";
// import Navbar from "@/components/Navbar";
// import Login from "@/components/Login";
// import { setCookie, parseCookies } from "nookies";
// import LoadingComponent from "@/components/LoadingComponent";
// import { createClient } from '@supabase/supabase-js';
// import { AssemblyAI } from 'assemblyai';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);
// const client = new AssemblyAI({ apiKey: '91668eb0d7b442698d2d8b046e00d55f' });

// const TranscribePage = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [file, setFile] = useState(null);
//   const [transcripts, setTranscripts] = useState([]);
//   const [chats, setChats] = useState([]);
//   const [isTranscribing, setIsTranscribing] = useState(false);
//   const [prompt, setPrompt] = useState('');
//   const [response, setResponse] = useState('');

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleUploadAndTranscribe = async () => {
//     if (!file) {
//       console.error('No file selected');
//       return;
//     }

//     try {
//       setIsTranscribing(true);
//       const timestamp = new Date().getTime();
//       const uniqueFilename = `${timestamp}_${file.name}`;
//       const { data, error } = await supabase.storage.from('Documents').upload(uniqueFilename, file, {
//         cacheControl: '3600',
//         upsert: false,
//       });

//       if (error) {
//         console.error('Error uploading file to Supabase:', error.message);
//         setIsTranscribing(false);
//         return;
//       }

//       const audioUrl = `https://kxdizugmndorfkztghbi.supabase.co/storage/v1/object/public/Documents/${encodeURIComponent(data.path)}`;
//       const params = { audio: audioUrl, speaker_labels: true };
//       const transcript = await client.transcripts.transcribe(params);
//       const { error: dbError } = await supabase.from('transcripts').insert({ filename: uniqueFilename, transcript: transcript.text });
//       if (dbError) {
//         console.error('Error saving transcript to Supabase:', dbError.message);
//       }
//       if (transcriptError) {
//         console.error('Error saving transcript to Supabase:', transcriptError.message);
//       }
//       await fetchTranscripts();
//       setIsTranscribing(false);
//     } catch (error) {
//       console.error('Error:', error.message);
//       setIsTranscribing(false);
//     }
//   };

//   const handlePromptChange = (event) => {
//     setPrompt(event.target.value);
//   };

//   const handleChat = async () => {
//     try {
//       const response = await fetch('/api/lemur/generate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ transcript_ids: [transcripts[0].id], prompt }),
//       });

//       const data = await response.json();
//       console.log(data);
//       setResponse(data.response);

//       // Save the chat to Supabase
//       const { error } = await supabase.from('aschats').insert({ transcript_id: transcripts[0].id, prompt, response: data.response });
//       if (error) {
//         console.error('Error saving chat to Supabase:', error.message);
//       }
//       await fetchChats();
//     } catch (error) {
//       console.error('Error:', error.message);
//     }
//   };

//   const handleLoginSuccess = () => {
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     // Set the "isLoggedIn" cookie to expire immediately
//     setCookie(null, "isLoggedIn", "true", { maxAge: -1 });
//     setIsLoggedIn(false);
//   };

//   useEffect(() => {
//     // Parse the cookie after the page is mounted
//     const cookies = parseCookies();
//     setIsLoggedIn(cookies.isLoggedIn === "true");
//     fetchTranscripts();
//     fetchChats();
//   }, []);

//   const fetchTranscripts = async () => {
//     const { data, error } = await supabase.from('transcripts').select('*');
//     if (error) {
//       console.error('Error fetching transcripts:', error.message);
//     } else {
//       setTranscripts(data);
//     }
//   };

//   const fetchChats = async () => {
//     const { data, error } = await supabase.from('aschats').select('*');
//     if (error) {
//       console.error('Error fetching chats:', error.message);
//     } else {
//       setChats(data);
//     }
//   };

//   return (
//     <>
//       {isLoggedIn ? (
//         <>
//           <Navbar />
//           <div className="p-4 mt-[80px]">
//             <h2>Transcriptions:</h2>
//             <input type="file" onChange={handleFileChange} />
//             <button
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
//               onClick={handleUploadAndTranscribe}
//             >
//               Upload & Transcribe
//             </button>
//             {isTranscribing && <LoadingComponent />}
//             {transcripts.map((transcript) => (
//               <div key={transcript.id} className="mt-4">
//                 <h3 className="font-bold text-lg">{transcript.filename}</h3>
//                 <p>{transcript.transcript}</p>
//               </div>
//             ))}
//             <h2>Chat with Assembly AI:</h2>
//             <input
//               type="text"
//               value={prompt}
//               onChange={handlePromptChange}
//               placeholder="Enter a prompt"
//               className="border border-gray-300 p-2 rounded w-full mb-4"
//             />
//             <button
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//               onClick={handleChat}
//             >
//               Chat
//             </button>
//             {response && (
//               <div className="mt-4">
//                 <h2 className="font-bold text-lg">Response:</h2>
//                 <p>{response}</p>
//               </div>
//             )}
//             <h2>Chat History:</h2>
//             {chats.map((chat) => (
//               <div key={chat.id} className="mt-4">
//                 <h3 className="font-bold text-lg">Prompt:</h3>
//                 <p>{chat.prompt}</p>
//                 <h3 className="font-bold text-lg">Response:</h3>
//                 <p>{chat.response}</p>
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         <Login onSuccess={handleLoginSuccess} />
//       )}
//     </>
//   );
// };

// export default TranscribePage;

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Login from "@/components/Login";
import { setCookie, parseCookies } from "nookies";
import LoadingComponent from "@/components/LoadingComponent";
import { createClient } from "@supabase/supabase-js";
import { AssemblyAI } from "assemblyai";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TiCancel, TiDeleteOutline, TiEdit, TiTick } from "react-icons/ti";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const client = new AssemblyAI({ apiKey: "e837af9c56674f6eb72ad23199c060ce" });

const TranscribePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [file, setFile] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const [selectedTranscriptId, setSelectedTranscriptId] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioSource, setAudioSource] = useState("");

  const [editTranscriptId, setEditTranscriptId] = useState(null);
  const [editTranscriptName, setEditTranscriptName] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUploadAndTranscribe = async () => {
    if (!file) {
      alert("No File Selected");
      //   console.error("No file selected");
      return;
    }

    try {
      setIsTranscribing(true);
      const timestamp = new Date().getTime();
      const uniqueFilename = `${timestamp}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("Documents")
        .upload(uniqueFilename, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading file to Supabase:", error.message);
        setIsTranscribing(false);
        return;
      }

      const audioUrl = `https://kxdizugmndorfkztghbi.supabase.co/storage/v1/object/public/Documents/${encodeURIComponent(
        data.path
      )}`;
      const params = { audio: audioUrl, speaker_labels: true };
      const transcript = await client.transcripts.transcribe(params);
      let fullTranscript = "";
      for (let utterance of transcript?.utterances || []) {
        fullTranscript += `Speaker ${utterance.speaker}:\n ${utterance.text}\n`;
      }

      const { error: dbError } = await supabase
        .from("transcripts")
        .insert({ filename: uniqueFilename, transcript: fullTranscript });
      if (dbError) {
        console.error("Error saving transcript to Supabase:", dbError.message);
      }
      await fetchTranscripts();
      setIsTranscribing(false);
    } catch (error) {
      console.error("Error:", error.message);
      setIsTranscribing(false);
    }
  };

  const handleTranscriptClick = (transcriptId) => {
    setIsTranscribing(true);
    setSelectedTranscriptId(transcriptId);
    // const selectedTranscript = transcripts.find((t) => t.id === transcriptId);
    // if (selectedTranscript) {
    //   setAudioSource(
    //     `https://kxdizugmndorfkztghbi.supabase.co/storage/v1/object/public/Documents/${encodeURIComponent(
    //       selectedTranscript.filename
    //     )}`
    //   );
    // }
    setIsTranscribing(false);
  };

  const handleDeleteTranscript = async (transcriptId, filename) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transcript?"
    );
    if (confirmed) {
      try {
        const { error } = await supabase
          .from("transcripts")
          .delete()
          .eq("id", transcriptId);
        if (error) {
          console.error("Error deleting transcript:", error.message);
        } else {
          await supabase.storage.from("Documents").remove([filename]); // Delete audio file from storage
          await fetchTranscripts();
          setSelectedTranscriptId(null); // Clear selected transcript after deletion
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
  };

  const handleEditTranscript = async () => {
    if (editTranscriptName.trim() === "") {
      alert("Transcript name cannot be empty");
      return;
    }

    const existingTranscript = transcripts.find(
      (t) => t.filename === editTranscriptName && t.id !== editTranscriptId
    );
    if (existingTranscript) {
      alert("Transcript title already exists. Please choose a different one.");
      return;
    }

    try {
      const { data: transcript, error } = await supabase
        .from("transcripts")
        .update({ filename: editTranscriptName })
        .eq("id", editTranscriptId);
      if (error) {
        console.error("Error updating transcript:", error.message);
      } else {
        await fetchTranscripts();
        setEditTranscriptId(null);
        setEditTranscriptName("");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };


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
    const cookies = parseCookies();
    setIsLoggedIn(cookies.isLoggedIn === "true");
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    const { data, error } = await supabase.from("transcripts").select("*");
    if (error) {
      console.error("Error fetching transcripts:", error.message);
    } else {
      setTranscripts(data);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <Navbar />
          <div className="p-4 mt-[70px]">
            <div className="border-b border-gray-700 pb-6">
            <h5 className="mb-3">Upload Audio files:</h5>
            <input type="file" onChange={handleFileChange} />
            <button
              className="bg-gray-500 hover:bg-gray-700 mt-3 text-white font-bold py-2 px-4 rounded-lg"
              onClick={handleUploadAndTranscribe}
            >
              Upload & Transcribe
            </button>
            </div>
            {isTranscribing && <LoadingComponent />}
            <div className="mt-1">
              <div className="flex gap-6">
                <ResizablePanelGroup
                  direction="horizontal"
                  className="dark rounded-lg flex h-screen pt-2"
                >
                  <ResizablePanel defaultSize={20}>
                    <div className="left w-full min-w-[200px] h-[70vh] overflow-y-auto">
                      <h3 className="font-bold text-lg mb-3">
                        Transcript Files:
                      </h3>
                      <ul className="">
                        {transcripts.map((transcript) => (
                          // <div className="flex items-center justify-between">
                          <li
                            style={{ wordBreak: "break-word" }}
                            key={transcript.id}
                            className={`cursor-pointer flex gap-4 items-center justify-between hover:bg-[#1d1d1d] mb-3 p-3 rounded-lg ${
                              selectedTranscriptId === transcript.id
                                ? "bg-[#252525]"
                                : "bg-[#111]"
                            }`}
                            onClick={() => handleTranscriptClick(transcript.id)}
                          >
                            {editTranscriptId === transcript.id ? (
                              <input
                                type="text"
                                className="border-b bg-[#1c1c1c] border-gray-800 focus:outline-none focus:border-gray-400"
                                value={editTranscriptName}
                                onChange={(e) =>
                                  setEditTranscriptName(e.target.value)
                                }
                                autoFocus
                              />
                            ) : (
                              <span>{transcript.filename}</span>
                            )}
                            <div>
                              {editTranscriptId === transcript.id ? (
                                <div className="flex">
                                  <TiTick
                                    className="text-green-500"
                                    onClick={handleEditTranscript}
                                  >
                                    Save
                                  </TiTick>
                                  <TiCancel
                                    className="text-red-500 ml-2"
                                    onClick={() => {
                                      setEditTranscriptId(null);
                                      setEditTranscriptName("");
                                    }}
                                  >
                                    Cancel
                                  </TiCancel>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-4">
                                  <TiEdit
                                    className="text-gray-200 cursor-pointer"
                                    onClick={() => {
                                      setEditTranscriptId(transcript.id);
                                      setEditTranscriptName(transcript.filename);
                                    }}
                                  />
                                  <TiDeleteOutline
                                    className="text-red-500 cursor-pointer"
                                    onClick={() =>
                                      handleDeleteTranscript(
                                        transcript.id,
                                        transcript.filename
                                      )
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </li>

                          // </div>
                        ))}
                      </ul>
                    </div>
                  </ResizablePanel>
                  <ResizableHandle
                    withHandle
                    className="ress text-gray-500 bg-[#2c2c2c]"
                  />
                  <ResizablePanel defaultSize={80}>
                    <div className="right px-6 py-2 w-full min-w-[600px] h-[70vh] overflow-y-auto">
                      {selectedTranscriptId == null ? (
                        <p>Select Audio from the sidebar</p>
                      ) : (
                        <>
                          {/* <iframe
                            src={audioSource}
                            width="100%"
                            frameborder="0"
                          ></iframe> */}
                          {selectedTranscriptId !== null && (
                            <div className="mt-4">
                              <h3 className="font-bold text-lg mb-3">Transcript:</h3>
                              <p>
                                {
                                  transcripts.find(
                                    (t) => t.id === selectedTranscriptId
                                  )?.transcript
                                }
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Login onSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default TranscribePage;
