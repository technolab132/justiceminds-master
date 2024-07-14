import React, { useState } from "react";
import { setCookie } from "nookies";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Token = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
        // Query the "Links" table in Supabase to find a record with the matching email and token
        const { data, error } = await supabase
          .from("Links")
          .select("email, token")
          .eq("email", email)
          .eq("token", token);
  
        if (error) {
          console.error("Error querying data:", error.message);
          setErrorMessage("An error occurred while logging in.");
        } else if (data.length === 1) {
          // Valid email and token combination found in the "Links" table
          // Set a cookie named "isLoggedIn" with value "true"
          setCookie(null, "isLoggedIn", "true", { maxAge: 900 }); // Expires in 15 minutes
          onSuccess();
        } else {
          // No matching record found
          setErrorMessage("Invalid email or token.");
        }
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage("An error occurred while logging in.");
      }
    // if (email ===  && password === "Jmadmin123#") {
    //   // Set a cookie named "isLoggedIn" with value "true"
    //   setCookie(null, "isLoggedIn", "true", { maxAge: 900 }); // Expires in 5 minutes
    //   onSuccess();
    // } else {
    //   setErrorMessage("Invalid username or password");
    // }
  };

  return (
    <>
      <div className="bg-black flex flex-col items-center justify-center h-screen">
        <img
          src="/logo 1.svg"
          alt="Logo"
          className=" mb-6"
          style={{ width: "25%" }}
        />
        <img
          src="/jmlogosmall.png"
          alt="Logo"
          className=" mb-6"
          style={{ width: "25%" }}
        />
        TRIAL ___ TRIAL<br /><br />
        <form className="text-center">
          <div className="mb-4">
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 w-64 bg-black border focus:border-white"
              style={{ border: "2px solid #171717" }}
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Generated Token"
              autoComplete="current password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="px-4 py-2 w-64 bg-black border focus:border-white "
              style={{ border: "2px solid #171717" }}
            />
          </div>
          <button
            onClick={handleLogin}
            className=" text-white px-8 py-2 cursor-pointer"
            style={{ background: "#1d1d1d" }}
          >
            Access the Page
          </button>
        </form>

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </>
  );
};

export default Token;
