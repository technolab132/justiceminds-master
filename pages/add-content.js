import React, { useEffect, useState, useRef } from "react";
import copy from "clipboard-copy";
import { createClient } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import Login from "../components/Login";
import { setCookie } from "nookies";
import { parse } from "cookie";
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AddContent = () => {
  const [agencyData, setAgencyData] = useState({
    agencies: "",
    tabs: [
      {
        name: "",
        content: "",
      },
    ],
  });

  const [isLoading, setisLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showmessage, setshowmessage] = useState("");

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
    const updatedTabs = [...agencyData.tabs, { name: "", content: "" }];
    setAgencyData({ ...agencyData, tabs: updatedTabs });
  };

  const removeTab = (index) => {
    const updatedTabs = agencyData.tabs.filter((_, i) => i !== index);
    setAgencyData({ ...agencyData, tabs: updatedTabs });
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
              name: "",
              content: "",
            },
          ],
        });
        setshowmessage("Data inserted successfully");
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

  return (
    <>
      {isLoggedIn ? (
        <div className="container mx-auto p-6">
          <a href="/"><img
          src="/jmlogosmall.png"
          style={{ width: "20%", marginBottom: "30px" }}
        /></a>
        <a href="/"><img
          src="/logo 1.svg"
          style={{ width: "20%", marginBottom: "30px" }}
        /></a>
          <h1 className="container mx-auto text-3xl font-semibold my-10">
            {agencyData.agencies}
          </h1>
          <h3 className="pb-6">Name of the Agency : : : </h3>
          <input
            value={agencyData.agencies}
            onChange={(e) =>
              setAgencyData({ ...agencyData, agencies: e.target.value })
            }
            type="text"
            className="bg-[#1d1d1d] border-2 border-[#262626] px-4 py-2 mb-6 text-white "
          />
          {agencyData.tabs.map((tab, index) => (
            <div key={index}>
              <h3 className="pb-6">Tab {index + 1} Name: : : </h3>
              <input
                value={tab.name}
                onChange={(e) => handleTabNameChange(index, e.target.value)}
                type="text"
                className="bg-[#1d1d1d] border-2 border-[#262626] px-4 py-2 mb-6 text-white"
              />
              <h3 className="py-6">Tab {index + 1} Content: : : </h3>
              <JoditEditor
                value={tab.content}
                config={{
                  autofocus: false,
                  readonly: false,
                  theme: "dark",
                  statusbar: false,
                }}
                onBlur={(content) => handleTabContentChange(index, content)}
              />
              {agencyData.tabs.length > 1 && (
                <button
                  onClick={() => removeTab(index)}
                  className="text-white px-8 py-2 cursor-pointer bg-[#1d1d1d] my-5"
                >
                  Remove Tab
                </button>
              )}
            </div>
          ))}
          <button
            className="text-white px-8 py-2 cursor-pointer bg-[#1d1d1d] my-5"
            onClick={addTab}
          >
            Add Tab
          </button><br />
          <button
            className="text-white px-8 py-2 cursor-pointer bg-[#1d1d1d] my-5"
            onClick={submitResponse}
          >
            Add Content
          </button>
          {showmessage && <p className="text-white">{showmessage}</p>}
        </div>
      ) : (
        <Login onSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default AddContent;
