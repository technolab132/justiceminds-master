import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import LoadingComponent from "@/components/LoadingComponent";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import PublicLogin from "@/components/PublicLogin";
import { setCookie } from "nookies";
import { parse } from "cookie";
import { TiDeleteOutline, TiDocument, TiImage } from "react-icons/ti";
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Button } from "@/components/ui/button"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const MasterChatPage = () => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

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
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAccessed, setIsAccessed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showmessage, setshowmessage] = useState("");

  const [chatGroups, setChatGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState([]);
  const ininame =
    typeof window !== "undefined"
      ? localStorage.getItem("displayName") || ""
      : "";
  const [name, setName] = useState(ininame);
  const initialSelectedchatid =
    typeof window !== "undefined"
      ? localStorage.getItem("selectedChatId") || ""
      : "";
  const [chatid, setchatid] = useState("");
  const editor = useRef(null);
  const [message, setMessage] = useState("");
  const [gpt, setGpt] = useState("");
  const router = useRouter();
  const routerids = router.query.id;
  const id = routerids?.split("id=")[0];
  const innerchatid = (routerids?.split("id=")[1] || "").replace(/%20/g, " ");
  console.log(innerchatid);
  const [selectedOption, setSelectedOption] = useState("message");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [password, setPassword] = useState('');


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  useEffect(() => {
    const fetchPassword = async () => {
      try {
        if (id) {
          const { data, error } = await supabase
            .from('masterchats')
            .select('pass')
            .eq('id', id)
            .single();
  
          if (error) {
            console.error('Error fetching password:', error.message);
          } else {
            setPassword(data.pass || '');
          }
        }
      } catch (error) {
        console.error('Error fetching password:', error.message);
      }
    };
  
    fetchPassword();
  }, [id]);
  

  useEffect(() => {
    const popupClosed = localStorage.getItem("popupClosed");
    if (!popupClosed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("popupClosed", "true");
  };

  // Define fetchMessages outside of useEffect

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAccessSuccess = () => {
    setIsAccessed(true);
  };

  const handleAdminSuccess = () => {
    setIsAccessed(true);
    setIsAdmin(true);
  };

  const handleLogout = () => {
    // Set the "isLoggedIn" cookie to expire immediately
    setCookie(null, "isAccessed", "true", { maxAge: -1 });
    localStorage.removeItem("displayName");

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

  const fetchMessages = async (chatGroupId) => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("chatid", chatGroupId);
      setMessages((prevMessages) => [...prevMessages, ...data]);
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

  // useEffect(() => {
  //   if (id) {
  //     // Fetch chat groups related to the master chat ID
  //     const fetchChatGroups = async () => {
  //       try {
  //         setLoading(true);
  //         if (innerchatid) {
  //           const { data } = await supabase
  //             .from("chatgroups")
  //             .select("*")
  //             .eq("masterchatid", id)
  //             .eq("chatid", innerchatid);
  //           setChatGroups(data);
  //           console.log(data);
  //           setLoading(false);

  //           // Auto-select the first chat group if there is one
  //           if (data.length > 0) {
  //             handleChatGroupClick(data[0].chatid);
  //           }
  //         } else {
  //           const { data } = await supabase
  //             .from("chatgroups")
  //             .select("*")
  //             .eq("masterchatid", id);
  //           setChatGroups(data);
  //           console.log(data);
  //           setLoading(false);

  //           // Auto-select the first chat group if there is one
  //           if (data.length > 0) {
  //             handleChatGroupClick(data[0].chatid);
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Error fetching chat groups:", error.message);
  //       }
  //     };

  //     // Fetch messages related to each chat group when the component mounts
  //     fetchChatGroups();
  //     fetchMessages(innerchatid);
  //   }
  // }, [id]);

  useEffect(() => {
    if (id) {
      // Fetch chat groups related to the master chat ID
      const fetchChatGroups = async () => {
        try {
          setLoading(true);
          let fetchedChatGroups = [];

          if (innerchatid) {
            const { data } = await supabase
              .from("chatgroups")
              .select("*")
              .eq("masterchatid", id)
              .eq("chatid", innerchatid);
            fetchedChatGroups = data;
          } else {
            const { data } = await supabase
              .from("chatgroups")
              .select("*")
              .eq("masterchatid", id);
            fetchedChatGroups = data;
          }

          // Separate chat groups with isMaster true and false
          const masterChatGroups = fetchedChatGroups.filter(
            (chatGroup) => chatGroup.isMaster
          );
          const remainingChatGroups = fetchedChatGroups.filter(
            (chatGroup) => !chatGroup.isMaster
          );

          // Concatenate master chat groups to the beginning of the list
          const updatedChatGroups = [
            ...masterChatGroups,
            ...remainingChatGroups,
          ];

          setChatGroups(updatedChatGroups);
          setLoading(false);

          // Auto-select the first chat group if available
          if (updatedChatGroups.length > 0) {
            handleChatGroupClick(updatedChatGroups[0].chatid);
          }
        } catch (error) {
          console.error("Error fetching chat groups:", error.message);
        }
      };

      // Fetch messages related to each chat group when the component mounts
      fetchChatGroups();
      fetchMessages(innerchatid);
    }
  }, [id]);

  useEffect(() => {
    // Fetch messages related to each chat group when chatGroups state updates
    chatGroups.forEach((chatGroup) => {
      // Fetch messages only if the chatGroup has been clicked
      if (chatGroup.clicked) {
        fetchMessages(chatGroup.chatid);
      }
    });
  }, []);

  // useEffect(() => {
  //   const messagesSubscription = supabase
  //     .channel("messages")
  //     .on(
  //       "postgres_changes",
  //       { event: "INSERT", schema: "public", table: "messages" },
  //       (payload) => {
  //         const newMessage = payload.new;
  //         setMessages((prevMessages) => [...prevMessages, newMessage]);
  //       }
  //     )
  //     .subscribe();

  //   // Clean up the subscription when the component unmounts
  //   return () => messagesSubscription.unsubscribe();
  // }, []);

  useEffect(() => {
    const messagesSubscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          condition: `chatid = '${chatid}'`, // Replace selectedChatId with the ID of the chat/group you want to subscribe to
        },
        (payload) => {
          const newMessage = payload.new;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => messagesSubscription.unsubscribe();
  }, [chatid]);

  const handleChatGroupClick = (chatid) => {
    // Mark the clicked chat group as active
    // localStorage.setItem("selectedChatId", chatid);
    setchatid(chatid);
    setChatGroups((prevChatGroups) =>
      prevChatGroups.map((chatGroup) =>
        chatGroup.chatid === chatid
          ? { ...chatGroup, clicked: true }
          : { ...chatGroup, clicked: false }
      )
    );
    setIsSidebarOpen(false);

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
      // handleMessageDebounced()
      setMessage(editor.current.value);
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
            name: name,
            message: messageToSend,
            chatid: chatid,
          },
        ]);

        setMessage("");
        setLoading(false);
      } else {
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
            name: "Ben Mak",
            message: messageToSend,
            chatid: chatid,
          },
        ]);

        setMessage("");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
      setLoading(false);
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
        setLoading(false);
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
      setLoading(false);
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
        <main className="overflow-auto w-full h-screen relative flex">
          <>
            {isOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="relative bg-[#1c1c1c] p-8 rounded-lg shadow-lg max-w-md">
                  <button
                    onClick={handleClose}
                    className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <img src="/smalllogo.png" style={{ width: "55px" }} />
                  {/* <h3 id='logo'>Justice Minds</h3> */}
                  {/* <img src="/logo 1.svg" style={{ width: "220px" }} /> */}
                  {/* <h2 className="text-2xl font-bold mb-4">Popup Heading</h2> */}
                  <p className="text-md text-gray-200 mt-4 text-justify">
                    JUSTICE MINDS <br /> Empowering professionals and the public across
                    law, healthcare, social care, and law enforcement with
                    secure, evidence-based tools for managing data,
                    communications, and incidents. Pillars: Accuracy &
                    Objectivity Inclusivity & Collaboration Accountability &
                    Discretion Harness the power of Justice Minds for
                    data-driven, ethical decision-making. Login to transform
                    your approach to justice.
                  </p>
                </div>
              </div>
            )}
          </>
          {isSidebarOpen && (
            <div className="dark md:hidden flex-shrink-0 bg-[#000000] z-[100] h-screen fixed top-0 left-0 flex w-[260px] flex-col">
              <div className="flex h-full min-h-0 flex-col ">
                <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
                  <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
                    <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
                      <div className="flex flex-col gap-2 pb-2 text-gray-100 text-sm">
                        <div className="flex justify-between items-center">
                          <a href="#">
                            <img
                              src="/logo 1.svg"
                              className="mb-3 p-3"
                              width={"200px"}
                              alt=""
                            />
                            <img
                              src="/jmlogosmall.png"
                              alt="Logo"
                              className=" mb-3 p-3"
                              style={{ width: "25%" }}
                            />
                          </a>
                          <TiDeleteOutline
                            className="text-red-500 mr-4 mb-4 cursor-pointer"
                            onClick={() => setIsSidebarOpen(false)}
                            size={20}
                          />
                        </div>

                        {}
                        {chatGroups.map((chatGroup) => (
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
                            <div className="">
                              {/* {chatGroup.chatname} */}
                              <div className="flex flex-col">
                                <span className="text-[16px] pb-1">
                                  {chatGroup.chatname}
                                </span>
                                <span className="text-gray-500 text-xs">
                                  {chatGroup.position}
                                </span>
                              </div>
                              {/* <div className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]" /> */}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>

                    <a
                      href="mailto:consult@benmaklondon.com"
                      className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth={0}
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                      </svg>
                      Contact Mr. Mak
                    </a>
                    <button
                      onClick={handleLogout}
                      type="button"
                      className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
                    >
                      Logout
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
          <div className="dark hidden flex-shrink-0 bg-[#000000] md:flex md:w-[260px] md:flex-col">
            <div className="flex h-full min-h-0 flex-col ">
              <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
                <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
                  <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
                    <div className="flex flex-col gap-2 pb-2 text-gray-100 text-sm">
                      <a href="#">
                        <img
                          src="/logo 1.svg"
                          className="mb-3 p-3"
                          width={"200px"}
                          alt=""
                        />
                      </a>
                      {}
                      {chatGroups.map((chatGroup) => (
                        <a
                          onClick={() => handleChatGroupClick(chatGroup.chatid)}
                          key={chatGroup.chatid}
                          className={`flex py-3 px-3 items-center ${
                            chatid === chatGroup?.chatname ? "bg-[#1d1d1d]" : ""
                          } gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group `}
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
                          <div className="">
                            {/* {chatGroup.chatname} */}
                            <div className="flex flex-col">
                              <p
                                className=" pb-1"
                                style={{ wordBreak: "break-word" }}
                              >
                                {chatGroup.chatname}
                              </p>
                              <p
                                className=" text-xs font-thin text-gray-500"
                                style={{ wordBreak: "break-word" }}
                              >
                                {chatGroup.position}
                              </p>
                            </div>
                            {/* <div className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]" /> */}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  <a
                    href="mailto:consult@benmaklondon.com"
                    className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                    </svg>
                    Contact Mr. Mak
                  </a>
                  <button
                    onClick={handleLogout}
                    type="button"
                    className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
                  >
                    Logout
                  </button>
                </nav>
              </div>
            </div>
          </div>

          <div className="flex max-w-full flex-1 flex-col">
            <div className="sticky top-0 z-10 flex items-center p-3 text-gray-200 sm:pl-3 md:hidden">
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
              JUSTICEMINDS
            </div>

            {chatid !== "" ? (
              <>
                <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
                  <div className="flex-1 overflow-y-scroll pb-32 bg-[#090909]">
                    <div className="react-scroll-to-bottom--css-ikyem-79elbk h-[90%] md:h-[100%] overflow-y-auto ">
                      {/* {loading ? (
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
          )} */}

                      {loading ? (
                        <LoadingComponent />
                      ) : (
                        <div className="mb-4 ">
                          {/* <select
                            className="hidden absolute top-5 right-5 p-2 rounded-lg bg-[#1c1c1c]"
                            id="dropdown"
                            value={selectedOption}
                            onChange={handleChange}
                          >
                            <option value="message">Text Message</option>
                            <option value="gpt">GPT</option>
                          </select> */}
                          {console.log(chatGroups)}
                          {chatGroups?.map((i) => (
                            <p>
                              {chatid === i.chatid && (
                                <>
                                  {i.isMaster && (
                                    <div
                                      class="p-4 text-sm text-gray-200 rounded-lg bg-[#282828]"
                                      role="alert"
                                    >
                                      <span class="">
                                        All Professionals and service user open
                                        table. All Professionals can access
                                        their partners messages specifically- in
                                        the left coloumn. Master chat open table
                                        for all.
                                      </span>
                                    </div>
                                  )}
                                </>
                              )}
                            </p>
                          ))}
                          {/* {chatGroupswithMaster[0]?.isMaster && (
                            
                          )} */}
                          <ResizablePanelGroup
                            direction="horizontal"
                            className="gap-1 flex"
                          >
                            <ResizablePanel defaultSize={5}>
                              <div className="min-w-[400px] bg-[#111111]">
                                <p className="p-3 border-b-1 border-b border-gray-600">
                                  Documents & Images
                                </p>
                                {messages.map((msg) => (
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
                                            <span className="text-gray-500 font-light text-xs ">
                                              {new Date(
                                                msg.created_at
                                              ).toLocaleString()}
                                            </span>
                                            {msg.message?.includes("<iframe") ||
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
                            <ResizablePanel defaultSize={95}>
                              <div className="w-full bg-black">
                                <p className="p-3 border-b-1 border-b border-gray-600">
                                  Comments & Messages
                                </p>
                                {messages.map((msg) => (
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
                                            className={`text-white mb-2 flex gap-2 items-center ${
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
                                          </strong>
                                          <div
                                            className="bg-[#111111] p-2 rounded-md"
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
                          </ResizablePanelGroup>

                          {/* <div className="sm:hidden block">
                            {messages?.map((msg) => (
                              <div
                                key={msg.id}
                                className="text-justify text-gray-400 p-4"
                              >
                                <strong
                                  className={`text-white ${
                                    msg.name === "ChatGPT"
                                      ? "font-bold text-red-500"
                                      : ""
                                  } mr-5`}
                                >
                                  {msg.name} :{" "}
                                  <span className="text-gray-500 font-light">
                                    {new Date(msg.created_at).toLocaleString()}
                                  </span>
                                </strong>
                                <div
                                  className=""
                                  dangerouslySetInnerHTML={{
                                    __html: msg.message,
                                  }}
                                ></div>
                              </div>
                            ))}
                          </div> */}

                          {/* <div ref={messagesEndRef} /> */}
                        </div>
                      )}

                      {/* <div className="react-scroll-to-bottom--css-ikyem-1n7m0yu">
            <div className="py-10 relative w-full flex flex-col h-full">
              <img src="logo 1.svg" width={"400px"} className="text-center items-center justify-center h-screen mx-auto" alt="" />
            </div>
            <div className="flex flex-col items-center text-sm dark:bg-gray-800" />
          </div> */}
                    </div>
                  </div>
                  <div className="absolute z-[1000] bg-black bottom-16 md:bottom-0 left-0 w-full md:border-t-0  md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient md:!bg-transparent dark:md:bg-vert-dark-gradient pt-1">
                    <form className="stretch mx-6 flex flex-row gap-3 last:mb-2">
                      {selectedOption === "message" && (
                        <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
                          {/* {isAdmin === true ? (
                      
                    ) : (
<p>hi</p>
                    )} */}
                          {/* <input
                            className="bg-[#4f4f4f] rounded-md py-2 px-4 mb-2"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder="Display Name"
                            type="text"
                            name=""
                            id=""
                          /> */}
                          <div className="flex w-full gap-3">
                            <div className="flex flex-col gap-2">
                              <label
                                for="fileInput"
                                className="relative cursor-pointer bg-[#1c1c1c] hover:bg-black p-2 rounded-md"
                              >
                                <TiImage />
                                <input
                                  id="fileInput"
                                  type="file"
                                  accept=".jpg, .png, .jpeg"
                                  onChange={(e) =>
                                    handleImageUpload(e.target.files[0])
                                  }
                                  className="hidden"
                                />
                              </label>
                              <label
                                for="fileInput1"
                                className="relative cursor-pointer bg-[#1c1c1c] hover:bg-black p-2 rounded-md"
                              >
                                <TiDocument />
                                <input
                                  id="fileInput1"
                                  type="file"
                                  accept=".pdf, .doc, .docx"
                                  onChange={(e) =>
                                    handleDocUpload(e.target.files[0])
                                  }
                                  className="hidden"
                                />
                              </label>
                              {/* <input
                                type="file"
                                accept="image/jpg"
                                onChange={(e) =>
                                  handleImageUpload(e.target.files[0])
                                }
                              /> */}
                            </div>
                            {/* <br /> */}
                            {/* <input type="text" /> */}
                            <JoditEditor
                              ref={editor}
                              value={message}
                              config={config}
                              onChange={(newM) => setMessage(newM)}
                              className="w-[100%]"
                              // onKeyDown={handleKeyDown}
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
                              className="absolute p-2 bg-green-400 rounded-md bottom-1  md:bottom-1.5 disabled:bg-gray-500 right-1 md:right-2 disabled:opacity-40"
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
                      {selectedOption === "gpt" && (
                        <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
                          {/* <input
                            className="bg-[#4f4f4f] rounded-md py-2 px-4 mb-2"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder="Display Name"
                            type="text"
                            name=""
                            id=""
                          /> */}
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
              </>
            ) : (
              <p className="p-5 ">Select chats from the sidebar</p>
            )}
          </div>
        </main>
      ) : (
        <PublicLogin
          onSuccess={handleAccessSuccess}
          onAdmin={handleAdminSuccess}
          pass={password}
        />
      )}
    </>
  );
};

export default MasterChatPage;
