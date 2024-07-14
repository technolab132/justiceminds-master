import React, { useEffect, useState, useRef } from "react";
import copy from "clipboard-copy";
import { createClient } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import Login from "@/components/Login";
import { setCookie } from "nookies";
import { parse } from "cookie";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const addchatgroup = () => {
  const [isLoading, setisLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showmessage, setshowmessage] = useState("");
  const [newChatName, setNewChatName] = useState("");
  const [newMasterChatName, setNewMasterChatName] = useState("");
  const [groups, setGroups] = useState();
  const [selectedMasterChat, setSelectedMasterChat] = useState("");
  const [masterChats, setMasterChats] = useState([]);


  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  
  useEffect(() => {
    const fetchMasterChats = async () => {
      const { data } = await supabase.from("masterchats").select("*");
      setMasterChats(data);
    };

    fetchMasterChats();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      const { data } = await supabase.from("chatgroups").select("*");
      // console.log(data);
      setGroups(data);
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    // Parse the cookie after the page is mounted
    const cookies = parse(document.cookie);
    setIsLoggedIn(cookies.isLoggedIn === "true");
  }, []);

  setTimeout(() => {
    setshowmessage("");
  }, 5000);

  const createmasterchat = async () => {
    try {
      if (newMasterChatName) {
        const { data, error } = await supabase
          .from("masterchats")
          .insert([
            {
              name: newMasterChatName,
            },
          ]);

        if (error) {
          console.error(error);
        }
      }

      setNewMasterChatName("");

    } catch (error) {
      console.error(error);
    }
  }

  const createGroup = async () => {
    try {
      if (newChatName && selectedMasterChat) {
        const { data, error } = await supabase
          .from("chatgroups")
          .insert([
            {
              chatname: newChatName,
              chatid: newChatName,
              masterchatid: selectedMasterChat,
            },
          ]);

        if (error) {
          console.error(error);
        }
      }

      setNewChatName("");

    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <>
      {isLoggedIn ? (
        // <div className="flex flex-row justify-center h-full items-center">
        //     <div className="flex-col flex">
        //     {groups?.map(group => (
        //     <p className="px-10 py-2 rounded-md w-full bg-[#1d1d1d]  my-3">{group.chatname}</p>
        // ))}

        //     </div>

        // <input type="text" className="bg-[#1d1d1d] px-3 py-2" placeholder="Enter the new group chat name" value={newchatname} onChange={(e) => setNewchatName(e.target.value)} /><br />
        // <button className="px-3 py-2 bg-[#1d1d1d] text-white">Create</button>
        // </div>
        <main className="overflow-hidden w-full h-screen relative flex">
          
          <div className="flex max-w-full flex-1 flex-col">
            <div className="relative h-full w-full transition-width ">
            <a href="/" className="flex justify-start title-font font-medium items-center p-10 text-white sm:mb-0">
            <img src="/logo 1.svg" style={{ width: "25%" }} alt="" />
            <img src="/jmlogosmall.png" style={{ width: "25%" }} />
          </a>
              <div className="flex flex-row w-full overflow-y-scroll">
                
                <div className="react-scroll-to-bottom--css-ikyem-79elbk   p-10">
                  
                    <h1 className="pb-6">Create Master Chats</h1>
                    <input
                    type="text"
                    className="bg-[#1d1d1d] px-3 py-2"
                    placeholder="Enter the new group chat name"
                    value={newMasterChatName}
                    onChange={(e) => setNewMasterChatName(e.target.value)}
                  />
                  <br /><br/>
                  <br /><br/>
                  <button onClick={createmasterchat} className="px-3 py-2 bg-[#1d1d1d] text-white">
                    Create
                  </button>
                  
                </div>
                <div className="react-scroll-to-bottom--css-ikyem-79elbk  p-10">
                    <h1 className="pb-6">Create New Page</h1>
                    <input
                    type="text"
                    className="bg-[#1d1d1d] px-3 py-2"
                    placeholder="Enter the new group chat name"
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                  />
                  <br /><br/>
                  <select
                    className="bg-[#1d1d1d] px-3 py-2"
                    value={selectedMasterChat}
                    onChange={(e) => setSelectedMasterChat(e.target.value)}
                  >
                    <option value="" disabled>Select a Master Chat</option>
                    {masterChats.map((masterChat) => (
                      <option key={masterChat.id} value={masterChat.id}>
                        {masterChat.name}
                      </option>
                    ))}
                  </select>
                  <br /><br/>
                  <button onClick={createGroup} className="px-3 py-2 bg-[#1d1d1d] text-white">
                    Create
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <>
          <Login onSuccess={handleLoginSuccess} />
        </>
      )}
    </>
  );
};

export default addchatgroup;
