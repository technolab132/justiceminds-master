

import { setCookie } from "nookies";
import { redirect } from 'next/navigation'
// import { supabase } from "../lib/supabase";
import supabaseClient from "./utils/supabaseClient";
// import { createClient } from '@/utils/supabase/server'
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import { Dashboard } from './pages/dashboard'
import { AuthProvider } from './components/Auth';
import { Auth } from './components/Auth';
const Login = () => {
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
//  const signInWithGoogle = async () => {
//   const supabase = useSupabaseClient();
//   console.log(supabase);
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: 'google',
//     options: {
//       redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
//       queryParams: {
//         access_type: 'offline',
//         prompt: 'consent',
//       },
//     },
//   });

//   if (error) {
//     console.error('Error initiating OAuth:', error.message);
//     // res.status(500).json({ error: error.message });
//   } else {
//     //redirect(data.url);
//   }
//   console.log('data',data);
//  // redirect('/dashboard')
  
// }
// const signInWithGoogle =  () => {
//   console.log('Supabase client:');
//   const supabase = useSupabaseClient();
//   const router = useRouter();

//   // Log supabase client to ensure it's initialized
//   console.log('Supabase client:', supabase);

//   // Ensure environment variable is loaded
//   console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

//   if (!supabase) {
//     console.error('Supabase client is not initialized');
//     return;
//   }

//   try {
//     const { data, error } =  supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: {
//         redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
//         queryParams: {
//           access_type: 'offline',
//           prompt: 'consent',
//         },
//       },
//     });

//     if (error) {
//       console.error('Error initiating OAuth:', error.message);
//     } else {
//       console.log('OAuth data:', data);
//       // Assuming you want to redirect after successful login
//       router.push('/dashboard');
//     }
//   } catch (err) {
//     console.error('Unexpected error during sign-in:', err.message);
//   }
// };

// useEffect(() => {
//   const { subscription  } = supabaseClient.auth.onAuthStateChange(
//     (event, session) => {
//       fetch("/api/auth", {
//         method: "POST",
//         headers: new Headers({ "Content-Type": "application/json" }),
//         credentials: "same-origin",
//         body: JSON.stringify({ event, session }),
//       }).then((res) => res.json());
//     }
//   );

//   return () => {
//     subscription?.unsubscribe();
//   };
// }, []);
console.log(Auth);
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
          {/* <button
            onClick={signInWithGoogle}
            className=" text-white px-8 py-2 cursor-pointer"
            style={{ background: "#1d1d1d",borderRadius:"5px" }}
          >
            Sign In With Google
          </button> */}
          <Auth />
        </form>

        {/* {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>} */}
      </div>
    </>
  );
  console.log(Auth);
  // return <Auth />;
};

export default Login;
