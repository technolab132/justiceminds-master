import React, { useState } from "react";
import { setCookie } from "nookies";
import { RiLockFill, RiLockUnlockFill } from "react-icons/ri";

const PublicLogin = ({ onSuccess, onAdmin, pass }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    if (password === "#i!x_!9" || (password === pass && pass !== null)) {
      // Set a cookie named "isLoggedIn" with value "true"
      setCookie(null, "isAccessed", "true", { maxAge: 900 }); // Expires in 5 minutes
      localStorage.setItem("displayName", name);
      onSuccess();
    }
    if (password === "Admin") {
      setCookie(null, "isAdmin", "true", { maxAge: 900 }); // Expires in 5 minutes
      setCookie(null, "isAccessed", "true", { maxAge: 900 }); // Expires in 5 minutes
      onSuccess();
      onAdmin();
    } else {
      setErrorMessage("Invalid Password");
    }
  };

  return (
    <>
      <div className="bg-black flex flex-col items-center justify-center h-screen">
      <img
          src="/logo11.png"
          alt="Logo"
          className="bigimg mb-3"
          style={{ width: "20%" }}
        />
        <img
          src="/smalllogo.png"
          alt="Logo"
          className="smallimg mb-3"
          style={{ width: "20%" }}
        />
        <span className="mb-6 text-center text-gray-300 text-md capitalize">Professional Intervention <br /> Preaction Protocol (PIPP)</span>
        <form className="text-center">
          
          <div className="mb-6">
            <input
              type="text"
              placeholder="Insert Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 w-64 bg-black border mb-2 focus:border-white "
              style={{ border: "2px solid #171717" }}
            /><br />
            <input
              type="password"
              placeholder="Organization Pin"
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
            style={{ background: "#1d1d1d" }}
          >
            Access PIPP
          </button>
<RiLockFill className="text-center my-2 w-1/2 mx-auto" />
        </form>

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </>
  );
};

export default PublicLogin;
