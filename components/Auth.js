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
     // router.push('/dashboard');
    }
    // router.push('/dashboard');
  };
  
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
