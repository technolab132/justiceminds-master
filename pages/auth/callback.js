// pages/auth/callback.js
// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { supabase } from '../../utils/supabaseClient';

// const AuthCallback = () => {
//   const router = useRouter();

//   useEffect(() => {
//     const handleAuthCallback = async () => {
//       try {
//         const fragment = window.location.hash.substring(1);
//         const params = new URLSearchParams(fragment);
//         console.log('params',params);
//         const accessToken = params.get('access_token');
//         const refreshToken = params.get('refresh_token');
//         const expiresIn = params.get('expires_in'); // Add expiry time if provided

//         if (!accessToken || !refreshToken) {
//           throw new Error('Missing required parameters in callback URL.');
//         }
//         const session = localStorage.getItem('supabase.auth.token');
//         if (!session) {
//           throw new Error('No session found');
//         }

//         const parsedResponse = JSON.parse(session);
//         console.log(parsedResponse)
//         //const accessToken = parsedResponse.currentSession.access_token;
//         // Store tokens in localStorage or any other preferred storage
//         const expiryDate = new Date().getTime() + parseInt(expiresIn, 10) * 1000; // Convert expiry time to milliseconds
//         const GMAIL_API_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';
//         const tokens = {
//           access_token: accessToken,
//           refresh_token: refreshToken,
//           expires_in: expiresIn,
//           scope: GMAIL_API_SCOPE,
//           expiry_date: expiryDate,
//           token_type: 'bearer'
//         };
//         localStorage.setItem('gmail_tokens', JSON.stringify(tokens));

//         const { data, error } = await supabase.auth.setSession({
//           access_token: accessToken,
//           refresh_token: refreshToken,
//         });

//         if (error) {
//           console.error('Error processing the callback:', error.message);
//         } else {
//           console.log('Session data after setting:', data);
//           // const { data: session, error: sessionError } = await supabase.auth.getSession();

//           // if (sessionError) {
//           //   console.error('Error retrieving session:', sessionError.message);
//           //   return res.status(401).json({ error: 'Unauthorized' });
//           // }

//           // console.log('Session:', session);
//           // // Extract code from URL
//           // const urlString = window.location.href;
//           // const url = new URL(urlString);
//           // const code = url.searchParams.get('code');

//           // if (code) {
//           //   try {
//           //     // Call API route to handle OAuth tokens
//           //     const response = await fetch('/api/save-tokens', {
//           //       method: 'POST',
//           //       headers: { 'Content-Type': 'application/json' },
//           //       body: JSON.stringify({ code }),
//           //     });

//           //     if (response.ok) {
//           //       console.log('Tokens saved successfully');
//           //     } else {
//           //       console.error('Error saving tokens:', await response.json());
//           //     }
//           //   } catch (error) {
//           //     console.error('Error during token saving:', error);
//           //   }
//           // } else {
//           //   console.error('Missing code parameter in URL:', urlString);
//           // }


//           router.push('/dashboard');
//           // Initialize Gmail client with tokens
//           // const gmailClient = await getGmailClient({ access_token: accessToken, refresh_token: refreshToken });
//           // if (gmailClient && gmailClient.statusCode && gmailClient.redirect) {
//           //   router.replace(gmailClient.redirect.destination);
//           // } else {
//           //   router.push('/dashboard');
//           // }
//         }
//       } catch (error) {
//         console.error('Error handling auth callback:', error);
//       }
//     };

//     handleAuthCallback();
//   }, [router]);

//   return <div>Loading...</div>;
// };
// const AuthCallback = () => {
//   const router = useRouter();

//   useEffect(() => {
//     const handleAuthCallback = async () => {
//       try {
//         const { error } = await supabase.auth.exchangeCodeForSession({
//           url: window.location.href,
//         });

//         if (error) {
//           console.error('Error processing the callback:', error.message);
//         } else {
//           router.push('/dashboard');
//         }
//       } catch (error) {
//         console.error('Error handling auth callback:', error);
//       }
//     };

//     handleAuthCallback();
//   }, [router]);

//   return <div>Loading...</div>;
// };
// const AuthCallback = () => {
//   const router = useRouter();

//   useEffect(() => {
//     const handleAuthCallback = async () => {
//       const { code, state } = router.query;
//       console.log('Authorization code:', code);
//       console.log('State parameter:', state);
//       if (!code) {
//         console.error('Authorization code not found in URL.');
//         return;
//       }

//       // Verify the state parameter to prevent CSRF attacks
//       const storedState = sessionStorage.getItem('oauth_state');
//       console.log('Stored state:', storedState);
//       if (state !== storedState) {
//         console.error('Invalid state parameter.');
//         return;
//       }

//       // Exchange the authorization code for tokens
//       try {
//         const { data, error } = await supabase.auth.exchangeCodeForSession({
//           code,
//           redirectTo: window.location.origin + '/auth/callback',
//         });
//         console.log('data',data);
//         if (error) {
//           console.error('Error exchanging code for session:', error.message);
//         } else {
//           router.push('/dashboard');
//         }
//         router.push('/dashboard');
//       } catch (error) {
//         console.error('Error handling auth callback:', error);
//       }
//     };

//     handleAuthCallback();
//   }, [router]);

//   return <div>Loading...</div>;
// };
// export default AuthCallback;
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';
import { getSessionFromUrl } from '@supabase/auth-helpers-nextjs';
import Cookies from 'js-cookie';
const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // const { error } = await getSessionFromUrl({
      //   supabaseClient: supabase,
      //   storeSession: true,
      // });

      const {data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error handling auth callback:', error.message);
        return;
      }else{
        console.log('data',data);
        const accessToken = data.session.provider_token;
        const refreshToken = data.session.refresh_token;
        Cookies.set('access_token', accessToken, { expires: 7, secure: true, sameSite: 'Strict' });
        Cookies.set('refresh_token', refreshToken, { expires: 7, secure: true, sameSite: 'Strict' });
        console.log('data', data);
      }

      router.push('/dashboard');
    };
    
    handleOAuthCallback();
  }, [router]);

  return <div>Loading...</div>;
};

export default Callback;

