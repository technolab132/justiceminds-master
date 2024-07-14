import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import LoadingComponent from "@/components/LoadingComponent";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import PublicLogin from "@/components/PublicLogin";
import { setCookie } from "nookies";
import { parse } from "cookie";
import {
  TiArchive,
  TiClipboard,
  TiDeleteOutline,
  TiDocument,
  TiImage,
} from "react-icons/ti";
import { Reorder } from "framer-motion";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import copy from "clipboard-copy";
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const MasterChatPage = ({ id }) => {
  const router = useRouter();
  const [isAccessed, setIsAccessed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showmessage, setshowmessage] = useState("");
  const [newChatGroup, setNewChatGroup] = useState("");
  const [newPosition, setNewPosition] = useState("");

  const [chatGroups, setChatGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState([]);
  const [name, setName] = useState("Ben mak");
  const [chatid, setchatid] = useState("");
  const editor = useRef(null);
  const [message, setMessage] = useState("");
  const [gpt, setGpt] = useState("");
  const [selectedOption, setSelectedOption] = useState("message");
  const messagesEndRef = useRef(null);
  const [fields, setFields] = useState([1, 2, 3, 4, 5, 6]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  const [pass, setPass] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // Define fetchMessages outside of useEffect
  const scrollToBottom = () => {
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleAccessSuccess = () => {
    setIsAccessed(true);
  };

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    setIsAccessed(true);
  };

  const handleLogout = () => {
    // Set the "isLoggedIn" cookie to expire immediately
    setCookie(null, "isAccessed", "true", { maxAge: -1 });
    setIsAccessed(false);
    setIsAdmin(false);
  };

  useEffect(() => {
    // Parse the cookie after the page is mounted
    const cookies = parse(document.cookie);
    setIsAccessed(cookies.isAccessed === "true");
    setIsAdmin(cookies.isAccessed === "true");
  }, []);

  setTimeout(() => {
    setshowmessage("");
  }, 5000);

  useEffect(() => {
    const fetchPassword = async () => {
      try {
        const { data, error } = await supabase
          .from("masterchats")
          .select("pass")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching password:", error.message);
        } else {
          setPass(data.pass || ""); // Set the fetched password or an empty string if no password exists
        }
      } catch (error) {
        console.error("Error fetching password:", error.message);
      }
    };

    if (id) {
      fetchPassword();
    }
  }, [id]);

  const fetchMessages = async (chatGroupId) => {
    try {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("chatid", chatGroupId);

      if (firstRender) {
        setMessages((prevMessages) => [...data]);
        setFirstRender(false);
      } else setMessages((prevMessages) => [...prevMessages, ...data]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  const handleMessageDebounced = debounce((content) => {
    setMessage(content);
  }, 500);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const [firstRender, setFirstRender] = useState(false);
  useEffect(() => {
    if (id) {
      // setchatid("");
      // Fetch chat groups related to the master chat ID
      const fetchChatGroups = async () => {
        try {
          setLoading(true);
          const { data } = await supabase
            .from("chatgroups")
            .select("*")
            .eq("masterchatid", id);

          if (!firstRender && data && data[0]) {
            setFirstRender(true);

            data[0]["clicked"] = true;
            setChatGroups(data);
            setchatid(data[0].id);
          }

          setLoading(false);
        } catch (error) {
          console.error("Error fetching chat groups:", error.message);
        }
      };

      // Fetch messages related to each chat group when the component mounts
      fetchChatGroups();
    }
  }, [id]);

  useEffect(() => {
    // Fetch messages related to each chat group when chatGroups state updates
    chatGroups?.forEach((chatGroup) => {
      // Fetch messages only if the chatGroup has been clicked
      if (chatGroup.clicked) {
        fetchMessages(chatGroup.chatid);
      }
    });
  }, [chatGroups]);

  useEffect(() => {
    const messagesSubscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => messagesSubscription.unsubscribe();
  }, []);

  const handleChatGroupClick = (chatid) => {
    setLoading(true);

    // Mark the clicked chat group as active
    setchatid(chatid);
    setChatGroups((prevChatGroups) =>
      prevChatGroups.map((chatGroup) =>
        chatGroup.chatid === chatid
          ? { ...chatGroup, clicked: true }
          : { ...chatGroup, clicked: false }
      )
    );

    // Clear previous messages when a new chat group is clicked
    setMessages([]);

    // Fetch messages for the clicked chat group
    fetchMessages(chatid);
  };

  const handleImageUpload = async (file) => {
    try {
      setLoading(true);

      const timestamp = new Date().getTime(); // Generate a timestamp for uniqueness
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

      const filePath = data.path; // Get the path from the response
      const bucketName = "Images"; // Replace with your actual bucket name

      // Construct the URL with the correct path
      const imageUrl = `${
        process.env.NEXT_PUBLIC_SUPABASE_URL
      }/storage/v1/object/public/${bucketName}/${encodeURIComponent(filePath)}`;
      const messageWithImage = `<img src="${imageUrl}" class="w-full md:w-[70%] lg:w-[50%] rounded-md" alt="uploaded image" />`;

      console.log("Image URL:", imageUrl);

      await sendMessageWithImage(messageWithImage);
      // router.reload()
    } catch (error) {
      console.error("Error handling image upload:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessageWithImage = async (messageWithImage) => {
    try {
      setLoading(true);

      await supabase.from("messages").upsert([
        {
          name,
          message: messageWithImage,
          chatid,
        },
      ]);

      setLoading(false);
    } catch (error) {
      console.error("Error sending message with image:", error.message);
      setLoading(false);
    }
  };

  const handleDocUpload = async (file) => {
    try {
      setLoading(true);

      const timestamp = new Date().getTime(); // Generate a timestamp for uniqueness
      const uniqueFilename = `${timestamp}_${file.name}`;

      const { data, error } = await supabase.storage
        .from("Documents")
        .upload(uniqueFilename, file, {
          cacheControl: "3600",
          upsert: false,
        });

      console.log(data);

      if (error) {
        console.error("Error uploading doc:", error.message);
        return;
      }

      const filePath = data.path; // Get the path from the response
      const bucketName = "Documents"; // Replace with your actual bucket name

      // Construct the URL with the correct path
      const docUrl = `${
        process.env.NEXT_PUBLIC_SUPABASE_URL
      }/storage/v1/object/public/${bucketName}/${encodeURIComponent(filePath)}`;
      const messageWithDoc = `<iframe src="${docUrl}" width="100%" height="700px"></iframe>`;

      // console.log("Image URL:", imageUrl);

      await sendMessageWithDoc(messageWithDoc);
      // router.reload()
    } catch (error) {
      console.error("Error handling image upload:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessageWithDoc = async (messageWithDoc) => {
    try {
      setLoading(true);

      await supabase.from("messages").upsert([
        {
          name,
          message: messageWithDoc,
          chatid,
        },
      ]);

      setLoading(false);
    } catch (error) {
      console.error("Error sending message with image:", error.message);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      if (name && message && chatid) {
        setLoading(true);
        console.log(message);
        let messageToSend = message;

        // Check if the message starts with "/gpt"
        // if (newMessage.toLowerCase().startsWith("/gpt")) {
        //   const response = await fetch("/api/generate", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ message: newMessage }),
        //   });

        //   if (!response.ok) {
        //     console.error(
        //       `Error calling internal API. Status: ${
        //         response.status
        //       }, Text: ${await response.text()}`
        //     );
        //     return;
        //   }

        //   const responseData = await response.json();
        //   const gptResponse = responseData || "Unable to generate a response.";

        //   messageToSend = `${newMessage}\n<br /><span class="text-green-500 font-semibold">Ben:</span> ${gptResponse}`;
        // }

        // Store the message in the Supabase database with the chatid
        await supabase.from("messages").upsert([
          {
            name,
            message: messageToSend,
            chatid,
          },
        ]);

        setMessage("");
        scrollToBottom();
        setLoading(false);
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
      setLoading(false);
    }
  };

  const handleToggleMaster = async (chatGroup) => {
    try {
      // Get the current isMaster value from the chatGroup object
      const currentIsMaster = chatGroup.isMaster;

      // Update Supabase database with the toggled value
      const { data, error } = await supabase
        .from("chatgroups")
        .update({ isMaster: !currentIsMaster })
        .eq("chatid", chatGroup.chatid);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error updating isMaster:", error.message);
    } finally {
      // Reload the router to reflect the updated data
      router.reload();
    }
  };

  const sendGPT = async () => {
    try {
      if (name && gpt && chatid) {
        setLoading(true);
        console.log(gpt);
        let messageToSend = gpt;

        // Check if the message starts with "/gpt"
        if (gpt) {
          const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: gpt }),
          });

          if (!response.ok) {
            console.error(
              `Error calling internal API. Status: ${
                response.status
              }, Text: ${await response.text()}`
            );
            return;
          }

          const responseData = await response.json();
          const gptResponse = responseData || "Unable to generate a response.";

          messageToSend = `${gpt}\n<br /><span class="text-green-500 font-semibold">Ben:</span> ${gptResponse}`;
        }

        // Store the message in the Supabase database with the chatid
        await supabase.from("messages").upsert([
          {
            name,
            message: messageToSend,
            chatid,
          },
        ]);

        setGpt("");
        scrollToBottom();
        setLoading(false);
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (id) => {
    try {
      const { data, error } = await supabase
        .from("masterchats")
        .update({ pass: pass })
        .eq("id", id);

      if (error) {
        console.error("Error updating password:", error.message);
      } else {
        setPass("");
        console.log("Password updated successfully");
      }
    } catch (error) {
      console.error("Error updating password:", error.message);
    }
  };

  // const createGroup = async (id) => {
  //   try {
  //     if (newChatGroup && id && newPosition) {
  //       const { data, error } = await supabase.from("chatgroups").insert([
  //         {
  //           chatname: newChatGroup,
  //           chatid: newChatGroup,
  //           masterchatid: id,
  //           position: newPosition,
  //         },
  //       ]);

  //       if (error) {
  //         console.error(error);
  //       } else {
  //         router.reload()
  //       }
  //     } else {
  //       alert("Please fill out all fields");
  //     }

  //     setNewChatGroup("");
  //     setNewPosition("");

  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const createGroup = async (id) => {
  //   try {
  //     if (newChatGroup && id) {
  //       // Split the comma-separated subgroup names into an array
  //       const subgroupsArray = newChatGroup
  //         .split(",")
  //         .map((subgroupName) => subgroupName.trim());

  //       // Insert each subgroup name individually
  //       const insertPromises = subgroupsArray.map(async (subgroupName) => {
  //         return await supabase.from("chatgroups").insert([
  //           {
  //             chatname: subgroupName,
  //             chatid: subgroupName,
  //             masterchatid: id,
  //             position: newPosition,
  //           },
  //         ]);
  //       });

  //       // Wait for all insert operations to complete
  //       const results = await Promise.all(insertPromises);

  //       // Check for errors in any of the insert operations
  //       const hasError = results.some((result) => result.error);

  //       if (hasError) {
  //         console.error("Error inserting subgroup entries");
  //       } else {
  //         // Reload the router if all entries are inserted successfully
  //         router.reload();
  //       }
  //     } else {
  //       alert("Please fill out all fields");
  //     }

  //     setNewChatGroup("");
  //     setNewPosition();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const createGroup = async (id) => {
    try {
      if (newChatGroup && newPosition && id) {
        // Split the comma-separated subgroup names into an array
        const subgroupsArray = newChatGroup
          .split(",")
          .map((subgroupName) => subgroupName.trim());

        // Split the comma-separated positions into an array
        const positionsArray = newPosition
          .split(",")
          .map((position) => position.trim());

        if (subgroupsArray.length !== positionsArray.length) {
          alert("Number of subgroups and positions should match");
          return;
        }

        // Insert each subgroup name and position individually
        const insertPromises = subgroupsArray.map(
          async (subgroupName, index) => {
            return await supabase.from("chatgroups").insert([
              {
                chatname: subgroupName,
                chatid: subgroupName,
                masterchatid: id,
                position: positionsArray[index],
                isMaster: isMaster,
              },
            ]);
          }
        );

        // Wait for all insert operations to complete
        const results = await Promise.all(insertPromises);

        // Check for errors in any of the insert operations
        const hasError = results.some((result) => result.error);

        if (hasError) {
          console.error("Error inserting subgroup entries");
        } else {
          // Reload the router if all entries are inserted successfully
          router.reload();
        }
      } else {
        alert("Please fill out all fields");
      }

      setNewChatGroup("");
      setNewPosition("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleGlobalKeyPress = (e) => {
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault(); // Prevents the default behavior
        sendMessage(); // Call your sendMessage function here
      }
    };

    document.addEventListener("keydown", handleGlobalKeyPress);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyPress);
    };
  }, [sendMessage]);

  const deletePage = async (id) => {
    try {
      console.log(id);
      // alert("Confirm Delete")
      var isConfirm = confirm("Are you Sure ?");
      if (isConfirm) {
        const { error } = await supabase
          .from("chatgroups")
          .delete()
          .eq("id", id);

        if (error) {
          console.log(error);
        } else {
          //   const { data } = await supabase.from("chatgroups").select("*").eq("id", id);
          // setChatGroups(data);
        }
        alert("This is Irreversible.");
        router.reload();
      } else {
        alert("Operation Cancelled");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      console.log(id);
      // alert("Confirm Delete")
      var isConfirm = confirm("Are you Sure ?");
      if (isConfirm) {
        const { error } = await supabase.from("messages").delete().eq("id", id);

        if (error) {
          console.log(error);
        } else {
          //   const { data } = await supabase.from("chatgroups").select("*").eq("id", id);
          // setChatGroups(data);
        }
        alert("This is Irreversible.");
        router.reload();
      } else {
        alert("Operation Cancelled");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // <div>
    //   <h1>Messages for Master Chat ID: {id}</h1>
    //   {chatGroups.map((chatGroup) => (
    //     <div
    //       key={chatGroup.chatid}
    //       onClick={() => handleChatGroupClick(chatGroup.chatid)}
    //       style={{ cursor: "pointer", margin: "10px", padding: "5px", border: "1px solid #ccc" }}
    //     >
    //       <p>{chatGroup.chatname}</p>
    //     </div>
    //   ))}
    //   {messages?.map((msg) => (
    //     <div key={msg.id}>
    //       <p>{msg.message}</p>
    //     </div>
    //   ))}
    // </div>

    <>
      {isAccessed ? (
        <main className=" w-full h-screen relative flex">
          <ResizablePanelGroup direction="horizontal" className="">
            <ResizablePanel defaultSize={25}>
              {isSidebarOpen && (
                <div className="dark md:hidden flex-shrink-0 bg-[#000000] z-[100] h-screen fixed top-0 left-0 flex w-[260px] flex-col">
                  <div className="flex h-full min-h-0 flex-col ">
                    <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
                      <nav className="flex h-full flex-1 flex-col space-y-1 ">
                        <div className="flex-col flex-1  border-b border-white/20 bg-[#111111]">
                          <div className="flex flex-col gap-3 p-[10px] text-gray-100">
                            {id ? (
                              <>
                                <input
                                  className="bg-[#4f4f4f] rounded-md py-2 px-4 mb-2 "
                                  onChange={(e) => setPass(e.target.value)}
                                  value={pass}
                                  placeholder="Password"
                                  type="text"
                                  name=""
                                  id=""
                                />
                                <button
                                  className="px-3 py-2 bg-[#1d1d1d] text-white w-full"
                                  onClick={() => handlePasswordUpdate(id)}
                                >
                                  Update Password
                                </button>
                                <div className="flex justify-between items-center gap-2">
                                  <textarea
                                    cols={2}
                                    type="text"
                                    className="bg-[#1d1d1d] px-3 py-2 w-full text-md"
                                    style={{ borderRadius: "5px" }}
                                    placeholder="Subgroup Names ( csvs )"
                                    value={newChatGroup}
                                    onChange={(e) =>
                                      setNewChatGroup(e.target.value)
                                    }
                                  />
                                </div>
                                <div>
                                  <textarea
                                    cols={2}
                                    type="text"
                                    className="bg-[#1d1d1d] px-3 py-2 w-full text-md"
                                    style={{ borderRadius: "5px" }}
                                    placeholder="Positions ( csvs )"
                                    value={newPosition}
                                    onChange={(e) =>
                                      setNewPosition(e.target.value)
                                    }
                                  />
                                </div>
                                <button
                                  style={{ borderRadius: "5px" }}
                                  onClick={() => createGroup(id)}
                                  className="px-3 py-2 bg-[#1d1d1d] text-white w-full"
                                >
                                  Add
                                </button>
                              </>
                            ) : (
                              <p>Select Group Chat</p>
                            )}

                            {chatGroups?.length === 0 ? (
                              <>
                                <p className="p-3">No Chat Pages</p>
                              </>
                            ) : (
                              <div className="">
                                {chatGroups?.map((chatGroup) => (
                                  <>
                                    <a
                                      onClick={() =>
                                        handleChatGroupClick(chatGroup.chatid)
                                      }
                                      key={chatGroup.chatid}
                                      className={`flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group `}
                                    >
                                      <svg
                                        stroke="currentColor"
                                        fill="none"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                      </svg>
                                      <div className="flex flex-row justify-between items-center w-full">
                                        <div className="flex flex-col">
                                          <span className="text-[16px] pb-1">
                                            {chatGroup.chatname}
                                          </span>
                                          <span className="text-gray-500">
                                            {chatGroup.position}
                                          </span>
                                        </div>
                                        <span className="flex pl-4">
                                          <TiDeleteOutline
                                            onClick={() =>
                                              deletePage(chatGroup.id)
                                            }
                                            size={18}
                                          />
                                        </span>
                                        {/* <div className="absolute inset-y-0 right-0 w-8 z-10 " /> */}
                                      </div>
                                    </a>
                                  </>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
              <div className="dark flex-shrink-0 bg-[#000000] md:flex max-w-[690px] min-w-[290px] md:flex-col">
                <div className="flex h-full min-h-0 flex-col ">
                  <div className=" flex h-full w-full flex-1 items-start border-white/20">
                    <nav className="flex h-full flex-1 flex-col space-y-1 ">
                      <div className="flex-col flex-1  border-b border-white/20 bg-[#000]">
                        <div
                          className="flex overflow-auto flex-col gap-3 p-[10px] text-gray-100"
                          style={{ height: "88vh" }}
                        >
                          {id ? (
                            <>
                              <input
                                className="bg-[#4f4f4f] rounded-md py-2 px-4 mb-2 "
                                onChange={(e) => setPass(e.target.value)}
                                value={pass}
                                placeholder="Password"
                                type="text"
                                name=""
                                id=""
                              />
                              <button
                                className="px-3 py-2 bg-[#1d1d1d] text-white w-full"
                                onClick={() => handlePasswordUpdate(id)}
                              >
                                Update Password
                              </button>
                              <div className="flex justify-between items-center gap-1">
                                <textarea
                                  cols={2}
                                  type="text"
                                  className="bg-[#111111] px-3 py-2 w-full text-md"
                                  style={{ borderRadius: "5px" }}
                                  placeholder="Subgroup Names ( csvs )"
                                  value={newChatGroup}
                                  onChange={(e) =>
                                    setNewChatGroup(e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <textarea
                                  cols={2}
                                  type="text"
                                  className="bg-[#111111] px-3 py-2 w-full text-md"
                                  style={{ borderRadius: "5px" }}
                                  placeholder="Positions ( csvs )"
                                  value={newPosition}
                                  onChange={(e) =>
                                    setNewPosition(e.target.value)
                                  }
                                />
                              </div>
                              <button
                                style={{ borderRadius: "5px" }}
                                onClick={() => createGroup(id)}
                                className="px-3 py-2 bg-[#1d1d1d] text-white w-full"
                              >
                                Add
                              </button>
                            </>
                          ) : (
                            <p>Select Group Chat</p>
                          )}

                          {chatGroups?.length === 0 ? (
                            <>
                              <p className="p-3">No Chat Pages</p>
                            </>
                          ) : (
                            <div className="">
                              {/* <Reorder.Group values={chatGroups} onReorder={setChatGroups}>
                          {chatGroups?.map((chatGroup) => (
                            <Reorder.Item value={chatGroup.id}  key={chatGroup.id}>
                              <a
                                onClick={() =>
                                  handleChatGroupClick(chatGroup.chatid)
                                }
                                key={chatGroup.chatid}
                                className={`flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group `}
                              >
                                <div className="flex flex-row justify-between items-center w-full">
                                  <div className="flex flex-col">
                                    <span style={{ wordBreak: "break-word" }} className="text-[15px] pb-1">
                                      {chatGroup.chatname}
                                    </span>
                                    <span style={{ wordBreak: "break-word" }} className="text-gray-500 text-sm">
                                      {chatGroup.position}
                                    </span>
                                  </div>
                                  <span className="flex pl-4 gap-3">
                                    <TiClipboard
                                      className="text-gray-400"
                                      onClick={() =>
                                        copy(
                                          `https://justice-minds.com/masterchat/${chatGroup.masterchatid}id=${chatGroup.chatid}`
                                        )
                                      }
                                      size={18}
                                    />
                                    <TiDeleteOutline
                                      className="text-red-600"
                                      onClick={() => deletePage(chatGroup.id)}
                                      size={18}
                                    />
                                  </span>
                                </div>
                              </a>
                            </Reorder.Item>
                          ))}
                          </Reorder.Group> */}

                              {chatGroups?.map((chatGroup, index) => (
                                <>
                                  <a
                                    onClick={() =>
                                      handleChatGroupClick(chatGroup.chatid)
                                    }
                                    key={chatGroup.chatid}
                                    className={`flex py-3 px-3 mb-2 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] bg-[#0c0c0c] cursor-pointer break-all group `}
                                  >
                                    {/* <svg
                                  stroke="currentColor"
                                  fill="none"
                                  strokeWidth={2}
                                  viewBox="0 0 24 24"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg> */}
                                    <div className="flex flex-row justify-between items-center w-full">
                                      <div className="flex flex-col">
                                        <span
                                          style={{ wordBreak: "break-word" }}
                                          className="text-[15px] pb-1"
                                        >
                                          {chatGroup.chatname}
                                        </span>
                                        <span
                                          style={{ wordBreak: "break-word" }}
                                          className="text-gray-500 text-xs"
                                        >
                                          {chatGroup.position}
                                        </span>
                                      </div>
                                      <span className="flex pl-4 gap-3">
                                        {chatGroup.isMaster === true ? (
                                          <TiArchive
                                            className={"text-green-500"}
                                            onClick={() =>
                                              handleToggleMaster(chatGroup)
                                            } // Call handleToggleMaster with chatGroup
                                            size={18}
                                          />
                                        ) : (
                                          <TiArchive
                                            className={"text-white"}
                                            onClick={() =>
                                              handleToggleMaster(chatGroup)
                                            } // Call handleToggleMaster with chatGroup
                                            size={18}
                                          />
                                        )}

                                        <TiClipboard
                                          className="text-gray-400"
                                          onClick={() =>
                                            copy(
                                              `https://justice-minds.com/masterchat/${chatGroup.masterchatid}id=${chatGroup.chatid}`
                                            )
                                          }
                                          size={18}
                                        />
                                        <TiDeleteOutline
                                          className="text-red-600"
                                          onClick={() =>
                                            deletePage(chatGroup.id)
                                          }
                                          size={18}
                                        />
                                      </span>
                                      {/* <div className="absolute inset-y-0 right-0 w-8 z-10 " /> */}
                                    </div>
                                  </a>
                                </>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="text-blue-500 ress" />
            <ResizablePanel
              className="flex max-w-full flex-1 flex-col overflow-hidden"
              defaultSize={75}
            >
              {/* <div className=""> */}
              {/* <div className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-gray-800 pl-1 pt-1 text-gray-200 sm:pl-3 md:hidden">
                  <button
                    onClick={toggleSidebar}
                    type="button"
                    className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:hover:text-white"
                  >
                    <span className="sr-only">Open sidebar</span>
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth={0}
                      viewBox="0 0 15 15"
                      className="h-6 w-6 text-white"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div> */}

              {chatid ? (
                <div className="relative h-full w-full transition-width flex flex-col overflow-y-hidden items-stretch flex-1">
                  <div className="flex-1 overflow-y-auto">
                    <div className=" h-[70%] overflow-y-auto">
                      {loading ? (
                        <LoadingComponent />
                      ) : (
                        <div className="mb-4 ">
                          <select
                            className="absolute top-5 right-5 p-2 rounded-lg bg-[#393939]"
                            id="dropdown"
                            value={selectedOption}
                            onChange={handleChange}
                          >
                            <option value="message">Text Message</option>
                            <option value="gpt">GPT</option>
                          </select>

                          <ResizablePanelGroup
                            direction="horizontal"
                            className="flex gap-1"
                          >
                            {/* <div className="flex gap-1"> */}
                            <ResizablePanel defaultSize={50}>
                              <div className="min-w-[400px] bg-[#111111]">
                                <p className="p-3 border-b-1 border-b border-gray-600">
                                  Documents & Images
                                </p>
                                {messages &&
                                  messages.map((msg) => (
                                    <>
                                      {(msg.message?.includes("<iframe") ||
                                        msg.message?.includes("<img")) && (
                                        <>
                                          <div
                                            key={msg.id}
                                            className={`text-justify text-gray-400 p-4 `}
                                          >
                                            <strong
                                              className={`text-white flex gap-2 items-center ${
                                                msg.name === "ChatGPT"
                                                  ? "font-bold text-red-500"
                                                  : ""
                                              } mr-5`}
                                            >
                                              {msg.name} :{" "}
                                              <span className="text-gray-500 font-light text-xs">
                                                {new Date(
                                                  msg.created_at
                                                ).toLocaleString()}
                                              </span>
                                              {msg.message?.includes(
                                                "<iframe"
                                              ) ||
                                              msg.message?.includes("<img") ? (
                                                <span
                                                  onClick={() =>
                                                    deleteMessage(msg.id)
                                                  }
                                                  className="text-red-600 flex gap-1 cursor-pointer items-center"
                                                >
                                                  <TiDeleteOutline size={18} />
                                                  Delete
                                                </span>
                                              ) : null}
                                            </strong>
                                            <div
                                              className=""
                                              dangerouslySetInnerHTML={{
                                                __html: msg.message,
                                              }}
                                            ></div>
                                          </div>
                                        </>
                                      )}
                                    </>
                                  ))}
                              </div>
                            </ResizablePanel>
                            <ResizableHandle
                              className="ress bg-white"
                              withHandle
                            />
                            <ResizablePanel defaultSize={50}>
                              <div className="bg-black">
                                <p className="p-3 border-b-1 border-b border-gray-600">
                                  Comments & Messages
                                </p>
                                {messages &&
                                  messages.map((msg) => (
                                    <>
                                      {msg.message?.includes("<iframe") ||
                                      msg.message?.includes("<img") ? (
                                        <></>
                                      ) : (
                                        <>
                                          <div
                                            key={msg.id}
                                            className={`text-justify text-gray-400 pt-4 px-3 `}
                                          >
                                            <strong
                                              className={`text-white flex gap-2 items-center ${
                                                msg.name === "ChatGPT"
                                                  ? "font-bold text-red-500"
                                                  : ""
                                              } mr-5`}
                                            >
                                              {msg.name} :{" "}
                                              <span className="text-gray-500 font-light text-xs">
                                                {new Date(
                                                  msg.created_at
                                                ).toLocaleString()}
                                              </span>
                                              {msg.message?.includes(
                                                "<iframe"
                                              ) ||
                                              msg.message?.includes(
                                                "<img"
                                              ) ? null : (
                                                <span
                                                  onClick={() =>
                                                    deleteMessage(msg.id)
                                                  }
                                                  className="text-red-600 flex gap-1 cursor-pointer items-center"
                                                >
                                                  <TiDeleteOutline size={18} />
                                                  Delete
                                                </span>
                                              )}
                                            </strong>
                                            <div
                                              className=""
                                              dangerouslySetInnerHTML={{
                                                __html: msg.message,
                                              }}
                                            ></div>
                                          </div>
                                        </>
                                      )}
                                    </>
                                  ))}
                              </div>
                            </ResizablePanel>

                            {/* </div> */}
                          </ResizablePanelGroup>
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-20 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-[#000] pt-3 md:!bg-transparent dark:md:bg-vert-dark-gradient">
                    <form className="stretch mx-6 flex flex-row gap-3 last:mb-2">
                      {selectedOption === "message" && (
                        <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
                          <div className="flex w-full gap-3">
                            <div className="flex flex-col gap-2 mb-2">
                              <label
                                for="fileInput"
                                class="relative cursor-pointer bg-[#1c1c1c] hover:bg-black p-2 rounded-md"
                              >
                                <TiImage />
                                <input
                                  id="fileInput"
                                  type="file"
                                  accept="image/jpg"
                                  onChange={(e) =>
                                    handleImageUpload(e.target.files[0])
                                  }
                                  class="hidden"
                                />
                              </label>

                              <label
                                for="fileInput1"
                                class="relative cursor-pointer bg-[#1c1c1c] hover:bg-black p-2 rounded-md-md"
                              >
                                <TiDocument />
                                <input
                                  id="fileInput1"
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  onChange={(e) =>
                                    handleDocUpload(e.target.files[0])
                                  }
                                  class="hidden"
                                />
                              </label>
                            </div>

                            <input
                              className="bg-[#4f4f4f] rounded-md py-2 px-4 mb-2 hidden"
                              onChange={(e) => setName(e.target.value)}
                              value={name}
                              placeholder="Display Name"
                              type="text"
                              name=""
                              id=""
                            />
                            <div className="w-[100%]">
                              {/* <input type="text" /> */}
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
                                className="w-[100%]"
                                // onChange={(value) => setMessage(value)}
                              />
                              {/* <textarea
                        rows={2}
                        style={{ overflowY: "hidden", outline: "none" }}
                        placeholder="Send a message..."
                        className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
                        value={newMessage}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault(); // Prevents the new line from being added
                            sendMessage(); // Call your sendMessage function here
                          }
                        }}
                        onChange={(e) => setNewMessage(e.target.value)}
                      /> */}
                              <button
                                onClick={sendMessage}
                                type="button"
                                className="absolute p-2 bg-gray-400 rounded-md bottom-1.5 md:bottom-2.5 bg-transparent disabled:bg-gray-500 right-1 md:right-2 disabled:opacity-40"
                              >
                                <svg
                                  stroke="currentColor"
                                  fill="none"
                                  strokeWidth={2}
                                  viewBox="0 0 24 24"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4 mr-1 text-white "
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <line x1={22} y1={2} x2={11} y2={13} />
                                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedOption === "gpt" && (
                        <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
                          <input
                            className="bg-[#4f4f4f] rounded-md py-2 px-4 mb-2"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            // defaultValue={"Ben Mak"}
                            placeholder="Display Name"
                            type="text"
                            name=""
                            id=""
                          />
                          <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-[#4f4f4f] rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                            {/* <input type="text" /> */}
                            {/* <JoditEditor
                        ref={editor}
                        value={message}
                        config={{
                          autofocus: false,
                          readonly: false,
                          theme: "dark",
                          statusbar: false,
                          // uploader: {
                          //   insertImageAsBase64URI:true
                          // },
                        }}
                        onBlur={handleMessageDebounced}
                      /> */}
                            <textarea
                              rows={2}
                              style={{ overflowY: "hidden", outline: "none" }}
                              placeholder="Send a message..."
                              className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
                              value={gpt}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault(); // Prevents the new line from being added
                                  sendGPT(); // Call your sendMessage function here
                                }
                              }}
                              onChange={(e) => setGpt(e.target.value)}
                            />
                            <button
                              onClick={sendGPT}
                              type="button"
                              className="absolute p-2 bg-gray-400 rounded-md bottom-1.5 md:bottom-2.5 bg-transparent disabled:bg-gray-500 right-1 md:right-2 disabled:opacity-40"
                            >
                              <svg
                                stroke="currentColor"
                                fill="none"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 mr-1 text-white "
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <line x1={22} y1={2} x2={11} y2={13} />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              ) : (
                <p className="p-5">Select chats</p>
              )}
              {/* </div> */}
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      ) : (
        <PublicLogin
          onSuccess={handleAccessSuccess}
          onAdmin={handleAdminSuccess}
        />
      )}
      {/* <div className="flex flex-row gap-10">
        <div className="w-[20%] p-10 bg-[#1a1a1a]">
          <div className="mb-5 text-white">Available Chats:</div>
          <ul>
            {availableChats.map((chat) => (
              
              <li key={chat.chatid}>
                <button
                  className={`text-white hover:underline ${
                    chatid === chat.chatid ? "font-bold" : ""
                  }`}
                  onClick={() => selectChatGroup(chat.chatid)}
                >
                  {chat.chatname}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-[80%] p-10">
          {loading ? (
            <LoadingComponent />
          ) : (
            <>
              <div className="text-white font-bold mb-3">
                Selected Chat ID: {chatid}
              </div>
              {messages?.map((msg) => (
                
                <div
                  key={msg.id}
                  className="text-justify text-gray-400 p-4 bg-[#1d1d1d]"
                >
                  {console.log(messages)}
                  <strong
                    className={`text-white ${
                      msg.name === "ChatGPT" ? "font-bold text-red-500" : ""
                    } mr-5`}
                  >
                    {msg.name} :{" "}
                    <span className="text-gray-500 font-light">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </strong>
                  <div
                    className=""
                    dangerouslySetInnerHTML={{ __html: msg.message }}
                  ></div>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="w-[20%] fixed right-0 top-0 h-full mb-4 bg-[#1a1a1a]">
          <div className="p-10">
            <img
              src="/logo 1.svg"
              width={"220px"}
              className="mb-10"
              alt=""
            />
            <input
              placeholder="Your Name"
              className="bg-[#000] p-2 text-white mb-3"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              rows={6}
              className="bg-[#000] p-2 text-white mb-3"
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <br />
            <button
              className="text-white px-8 py-2 cursor-pointer bg-[#000] border-[2px] border-[#5c5c5c] my-5"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default MasterChatPage;
