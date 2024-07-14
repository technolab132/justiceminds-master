import React, { useState } from "react";
import { setCookie } from "nookies";

const Login = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    if (username === "jmadmin" && password === "Jmadmin123#") {
      // Set a cookie named "isLoggedIn" with value "true"
      setCookie(null, "isLoggedIn", "true", { maxAge: 900 }); // Expires in 5 minutes
      setCookie(null, "isAccessed", "true", { maxAge: 900 }); // Expires in 5 minutes
      onSuccess();
    } else {
      setErrorMessage("Invalid username or password");
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
          src="/logo11.png"
          alt="Logo"
          className="smallimg mb-3"
          style={{ width: "20%" }}
        />
        
        <form className="text-center">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-2 w-64 bg-black border focus:border-white"
              style={{ border: "2px solid #171717", borderRadius:"5px" }}
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              autoComplete="current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 w-64 bg-black border focus:border-white "
              style={{ border: "2px solid #171717",borderRadius:"5px" }}
            />
          </div>
          <button
            onClick={handleLogin}
            className=" text-white px-8 py-2 cursor-pointer"
            style={{ background: "#1d1d1d",borderRadius:"5px" }}
          >
            Sign In
          </button>
        </form>

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </>
  );
};

export default Login;
