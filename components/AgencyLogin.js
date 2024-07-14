import React, { useState } from "react";
import { setCookie } from "nookies";

const ALogin = ({ onSuccess, onAdmin }) => {
  //   const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    if (password === "9999") {
      // Set a cookie named "isLoggedIn" with value "true"
      setCookie(null, "isAccessed", "true", { maxAge: 120 }); // Expires in 5 minutes
      //   localStorage.setItem("displayName", name)
      onSuccess();
    }
    if (password === "Admin") {
      setCookie(null, "isAdmin", "true", { maxAge: 120 }); // Expires in 5 minutes
      setCookie(null, "isAccessed", "true", { maxAge: 120 }); // Expires in 5 minutes
      onSuccess();
      onAdmin();
    } else {
      setErrorMessage("Invalid Password");
    }
  };

  return (
    <>
      <div className="bg-[#1c1c1c] flex flex-col items-center justify-center h-[50vh]">
        {/* <img
          src="/logo11.png"
          alt="Logo"
          className="bigimg mb-6"
          style={{ width: "25%" }}
        />
        <img
          src="/smalllogo.png"
          alt="Logo"
          className="smallimg mb-6"
          style={{ width: "25%" }}
        /> */}
        <h3>Its Locked</h3>
        <br />
        <form className="text-center">
          <div className="mb-6">
            {/* <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 w-64 bg-black border mb-2 focus:border-white "
              style={{ border: "2px solid #171717" }}
            /><br /> */}
            <input
              type="password"
              placeholder="Password"
              autoComplete="current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 w-64 bg-black border focus:border-white "
              style={{ border: "2px solid #171717" }}
            />
          </div>
          <button
            onClick={handleLogin}
            className=" text-white px-8 py-2 cursor-pointer"
            style={{ background: "#111" }}
          >
            Unlock
          </button>
        </form>

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </>
  );
};

export default ALogin;
