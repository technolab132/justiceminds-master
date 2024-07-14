// components/Chat.js
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import LoadingComponent from "./LoadingComponent";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import Link from "next/link";
import { useRouter } from "next/router";
import MasterChatPage from "./MasterChat";
import copy from "clipboard-copy";
import { TiClipboard, TiDeleteOutline } from "react-icons/ti";
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";



const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Chat = ({ logout }) => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatid, setchatid] = useState("");
  const [availableChats, setAvailableChats] = useState([]);
  const [sidebar, setSidebar] = useState("close");
  const editor = useRef(null);
  const [message, setMessage] = useState("");
  const [gpt, setGpt] = useState("");
  const [availableMasterChats, setAvailableMasterChats] = useState([]);

  const initialSelectedMasterChatId =
    localStorage.getItem("selectedMasterChatId") || null;

  const [masterchatid, setMasterChatId] = useState(initialSelectedMasterChatId);
  const [newMasterChatName, setNewMasterChatName] = useState("");
  const [IsCopied, setIsCopied] = useState(false);
  const [selectedOption, setSelectedOption] = useState("message");
  const [updatedMasterChats, setUpdatedMasterChats] = useState([]);

  const selectMasterChat = async (masterChatId) => {
    // Save the selected master chat id to localStorage
    localStorage.setItem("selectedMasterChatId", masterChatId);
    setMasterChatId(masterChatId);
  };

  const handleCopy = (id) => {
    copy(`https://justice-minds.com/masterchat/${id}`); // Call the onClose function from props to reset selectedData to null
    setIsCopied(true);

    // Reset the copied state after a few seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // Function to fetch available master chat groups
  const fetchMasterChats = async () => {
    try {
      const { data } = await supabase.from("masterchats").select("*").order("posId", {ascending:true});
      setAvailableMasterChats(data);
      // Set the default master chat to the currently selected master chat or the first master chat in the list
      const defaultMasterChat =
        selectedMasterChat || (data.length > 0 ? data[0].id : null);
      setSelectedMasterChat(defaultMasterChat);
    } catch (error) {
      console.error("Error fetching master chats:", error.message);
    }
  };

  useEffect(() => {
    // Fetch available master chat groups when the component mounts
    fetchMasterChats();
  }, []);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Function to handle chat selection
  const selectChatGroup = (selectedchatid) => {
    console.log(selectedchatid);
    setchatid(selectedchatid);
  };

  const handleMessageDebounced = debounce((content) => {
    setMessage(content);
  }, 500);


  // const moveMasterChat = (dragIndex, hoverIndex) => {
  //   const dragItem = updatedMasterChats[dragIndex];
  //   const updatedList = [...updatedMasterChats];
  //   updatedList.splice(dragIndex, 1);
  //   updatedList.splice(hoverIndex, 0, dragItem);
  //   // Update the state with the updated list
  //   setUpdatedMasterChats(updatedList);
  // };

  // const updateMasterChatSequence = async () => {
  //   setLoading(true);
  //   try {
  //     await Promise.all(
  //       updatedMasterChats.map(async (chat, index) => {
  //         await supabase
  //           .from("masterchats")
  //           .update({ posId: index + 1 }) // Update posId to reflect new order
  //           .eq("id", chat.id);
  //       })
  //     );
  //     console.log("Sequence saved successfully.");
  //   } catch (error) {
  //     console.error("Error saving sequence:", error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSaveSequence = () => {
  //   updateMasterChatSequence();
  // };


  // const DraggableMasterChat = ({ masterChat, index }) => {
  //   const [{ isDragging }, drag] = useDrag({
  //     type: "MASTER_CHAT",
  //     item: { id: masterChat.id, index },
  //     collect: (monitor) => ({
  //       isDragging: monitor.isDragging(),
  //     }),
  //   });

  //   const [, drop] = useDrop({
  //     accept: "MASTER_CHAT",
  //     hover(item, monitor) {
  //       if (!drag) {
  //         return;
  //       }
  //       const dragIndex = item.index;
  //       const hoverIndex = index;
  //       if (dragIndex === hoverIndex) {
  //         return;
  //       }
  //       moveMasterChat(dragIndex, hoverIndex);
  //       item.index = hoverIndex;
  //     },
  //   });

  //   const opacity = isDragging ? 0.5 : 1;

  //   return (
  //     <div ref={(node) => drag(drop(node))} style={{ opacity }}>
  //       <div>{masterChat.name}</div>
  //     </div>
  //   );
  // };


  


  useEffect(() => {
    // Function to fetch available chat groups
    const fetchChats = async () => {
      try {
        const { data } = await supabase.from("chatgroups").select("*");
        setAvailableChats(data);
        // Set the default chat to the currently selected chat or the first chat in the list
        const defaultChat = chatid || (data.length > 0 ? data[0].chatid : null);
        setchatid(defaultChat);
      } catch (error) {
        console.error("Error fetching chat groups:", error.message);
      }
    };

    // Fetch available chat groups when the component mounts
    fetchChats();
  }, []);

  // const selectMasterChat = (selectedMasterChatId) => {
  //   console.log(selectedMasterChatId);
  //   setMasterChatId(selectedMasterChatId);
  // };

  useEffect(() => {
    // Function to fetch existing messages
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: true })
          .eq("chatid", chatid);
        setMessages(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error.message);
        setLoading(false);
      }
    };

    // Function to set up Supabase subscription for real-time updates
    const setUpSubscription = () => {
      const channel = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            // Handle new messages and update the state
            setMessages((prevMessages) => [...prevMessages, payload.new]);
          }
        )
        .subscribe();

      return channel;
    };

    // Fetch existing messages when the component mounts or when chatid changes
    if (chatid) {
      fetchMessages();
      const channel = setUpSubscription();

      // Clean up the subscription when the component is unmounted or when chatid changes
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [chatid]);

  const deleteMasterChat = async (id) => {
    try {
      console.log(id);
      // alert("Confirm Delete")
      var isConfirm = confirm("Are you Sure ?");
      if (isConfirm) {
        const { error } = await supabase
          .from("masterchats")
          .delete()
          .eq("id", id);

        if (error) {
          console.log(error);
        } else {
          const { data } = await supabase.from("masterchats").select("*");
          setAvailableMasterChats(data);
        }
        alert("This is Irreversible.");
      } else {
        alert("Operation Cancelled");
        return;
      }
    } catch (error) {
      console.log(error);
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

  // const createmasterchat = async () => {
  //   try {
  //     if (newMasterChatName) {
  //       const { data, error } = await supabase
  //         .from("masterchats")
  //         .insert([
  //           {
  //             name: newMasterChatName,
  //           },
  //         ]);

  //       if (error) {
  //         console.error(error);
  //       } else {
  //         router.reload()
  //       }
  //     }

  //     setNewMasterChatName("");

  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  const createmasterchat = async () => {
    try {
      if (newMasterChatName) {
        // Split the comma-separated values into an array
        const namesArray = newMasterChatName
          .split(",")
          .map((name) => name.trim());

        // Insert each entry individually
        const insertPromises = namesArray.map(async (name) => {
          return await supabase.from("masterchats").insert([{ name }]);
        });

        // Wait for all insert operations to complete
        const results = await Promise.all(insertPromises);

        // Check for errors in any of the insert operations
        const hasError = results.some((result) => result.error);

        if (hasError) {
          console.error("Error inserting entries");
        } else {
          // Reload the router if all entries are inserted successfully
          router.reload();
        }
      }

      setNewMasterChatName("");
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div className="flex h-screen">
      <ResizablePanelGroup
        direction="horizontal"
        className="dark rounded-lg flex h-screen pt-[60px] lg:pt-[80px]"
      >
        <ResizablePanel defaultSize={20}>
          <div className="md:flex-shrink-0 overflow-auto">
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "10px",
                height: "87vh",

                background: "black",
                minWidth: "270px",
                maxWidth: "670px",
              }}
            >
              {/* <> */}
              <div className="flex flex-col items-center justify-between gap-3 mb-3 w-full">
                <textarea
                  cols={2}
                  type="text"
                  className="bg-[#111111] px-3 py-2 w-full"
                  placeholder="Group Names (csv) . ."
                  style={{ borderRadius: "5px" }}
                  value={newMasterChatName}
                  onChange={(e) => setNewMasterChatName(e.target.value)}
                />
                <button
                  onClick={createmasterchat}
                  style={{ borderRadius: "5px" }}
                  className="px-3 py-2 bg-[#1d1d1d] text-white w-full"
                >
                  Add
                </button>
              </div>

              {/* <DndProvider backend={HTML5Backend}>
        {availableMasterChats.map((masterChat, index) => (
          <DraggableMasterChat key={masterChat.posId} masterChat={masterChat} index={index} />
        ))}
      </DndProvider>
      <button onClick={handleSaveSequence}>Save Sequence</button> */}

              {availableMasterChats?.map((masterChat, index) => (
                <>
                  {availableMasterChats?.length === 0 ? (
                    <p className="text-white p-2">No Chat Groups</p>
                  ) : (
                    <Link
                      className={`flex justify-between items-center ${
                        masterchatid === masterChat.id
                          ? "bg-[#2A2B32]"
                          : "bg-[#0c0c0c] text-gray-400"
                      }`}
                      style={{
                        width: "100%",
                        marginBottom: "10px",
                        textAlign: "left",
                        borderRadius: "5px",
                      }}
                      key={masterChat.id}
                      href={`#`}
                    >
                      <button
                        style={{ wordBreak: "break-word" }}
                        onClick={() => selectMasterChat(masterChat.id)}
                        className="py-4 px-3 text-left w-[70%]"
                        key={index}
                      >
                        {masterChat.name}
                      </button>
                      <span className="flex pr-5 gap-3">
                        <TiClipboard
                          size={18}
                          onClick={() => handleCopy(masterChat.id)}
                        />
                        <TiDeleteOutline
                          className="text-red-700"
                          onClick={() => deleteMasterChat(masterChat.id)}
                          size={18}
                        />
                      </span>
                    </Link>
                  )}
                </>
              ))}
              {/* </> */}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="text-yellow-500 ress" />
        <ResizablePanel defaultSize={80}>
          <div className="overflow-hidden">
            <MasterChatPage id={masterchatid} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Chat;
