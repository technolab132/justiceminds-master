// components/Auth.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'universal-cookie';

const Auth = () => {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(session);
      if (session) {
        router.push('/dashboard'); // Redirect to a protected route after login
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);
  const signup = async(formData) => {
   // const supabase = createClient()
   console.log('signUp');
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    }
    console.log('data',data);
    const { error } = await supabase.auth.signUp(data)
  
    if (error) {
      console.error('Error initiating OAuth:', error.message);
      //redirect('/error')
    }
    router.push('/dashboard');
    //revalidatePath('/', 'layout')
    //redirect('/')
  }
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/auth/callback`, // Set the redirect URL
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'https://www.googleapis.com/auth/gmail.readonly',
      },
      
    });
    if (error) {
      console.error('Error initiating OAuth:', error.message);
      // res.status(500).json({ error: error.message });
    }else {
      router.push('/dashboard');
    }
    // router.push('/dashboard');
  };
  // const signInWithGoogle = async () => {
  //   try {
  //     const response = await fetch('/api/auth/google');
  //     const { authUrl } = await response.json();
  //     window.location.href = authUrl;
  //   } catch (error) {
  //     console.error('Error initiating OAuth:', error.message);
  //   }
  // };

  // const generateRandomString = (length) => {
  //   const array = new Uint32Array(length);
  //   window.crypto.getRandomValues(array);
  //   return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  // };
  
  // const base64UrlEncode = (str) => {
  //   return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
  //     .replace(/\+/g, '-')
  //     .replace(/\//g, '_')
  //     .replace(/=+$/, '');
  // };
  
  // const sha256 = async (plain) => {
  //   const encoder = new TextEncoder();
  //   const data = encoder.encode(plain);
  //   return await crypto.subtle.digest('SHA-256', data);
  // };
  // const cookies = new Cookies();
  // const signInWithGoogle = async () => {
  //   try {
  //     const codeVerifier = generateRandomString(128);
  //     const codeChallenge = base64UrlEncode(await sha256(codeVerifier));
  //     console.log(cookies);
  //     // Serialize code verifier into a cookie string
  //     cookies.set('codeVerifier', codeVerifier, {
  //       path: '/',
  //       secure: process.env.NODE_ENV === 'production',
  //       maxAge: 60 * 60 * 24, // optional: cookie expiration time in seconds
  //       httpOnly: true,
  //     });
  //     // Encode code verifier for URL
  //     const encodedCodeVerifier = encodeURIComponent(codeVerifier);

  //     // Construct redirectTo URL with code verifier as query parameter
  //     const redirectTo = `${process.env.NEXT_PUBLIC_REDIRECT_URL}/api/auth/callback?code_verifier=${encodedCodeVerifier}`;
  //     console.log('Code verifier set in cookie:', codeVerifier); 
  //     const { data, error } = await supabase.auth.signInWithOAuth({
  //       provider: 'google',
  //       options: {
  //         redirectTo: redirectTo,
  //         scopes: 'https://www.googleapis.com/auth/gmail.readonly',
  //         code_challenge: codeChallenge,
  //         code_challenge_method: 'S256',
  //       },
  //     });
  
  //     if (error) {
  //       console.error('Error initiating OAuth:', error.message);
  //       return;
  //     }
  
  //     if (data?.url) {
  //       window.location.href = data.url;
  //     }
  //   } catch (error) {
  //     console.error('Error initiating OAuth:', error.message);
  //   }
  // };
  // const signInWithGoogle = async () => {
  //   const state = uuidv4();
  //   console.log('state',state);
  //   sessionStorage.setItem('oauth_state', state);
  //   console.log('Generated state:', state);
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //     options: {
  //       redirectTo: `${window.location.origin}/auth/callback`,
  //       queryParams: {
  //         access_type: 'offline',
  //         state, // Include the state parameter here
  //       },
  //       scopes: 'https://www.googleapis.com/auth/gmail.readonly',
  //     },
  //   });
  //   if (error) {
  //     console.error('Error initiating OAuth:', error.message);
  //   } else {
  //     router.push('/dashboard');
  //   }
  // };
  const login = async(formData) => {
    //const supabase = createClient()
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    }
  
    const { error } = await supabase.auth.signInWithPassword(data)
  
    if (error) {
      console.error('Error initiating OAuth:', error.message);
      //redirect('/error')
    }
    router.push('/dashboard');
    //revalidatePath('/', 'layout')
    //redirect('/')
  }

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
        
        
        <button onClick={signInWithGoogle} className=" text-white px-8 py-2 cursor-pointer"
            style={{ background: "#1d1d1d",borderRadius:"5px" }}>Sign In with Google</button>
        {/* {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>} */}
      </div>
    </>
  );
};

export default Auth;
