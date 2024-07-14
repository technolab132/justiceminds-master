// import { google } from 'googleapis';
// import { supabase } from '../../../utils/supabaseClient';

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   `${process.env.NEXT_PUBLIC_REDIRECT_URL}/api/auth/callback`
// );

// export default async function handler(req, res) {
//   try {
//     const code = req.query.code;

//     if (!code) {
//       throw new Error('Missing authorization code in callback URL.');
//     }

//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens);

//     const { data, error } = await supabase.auth.setSession({
//       access_token: tokens.access_token,
//       refresh_token: tokens.refresh_token,
//     });

//     if (error) {
//       console.error('Error processing the callback:', error.message);
//       return res.status(500).json({ error: error.message });
//     }

//     res.redirect('/dashboard');
//   } catch (error) {
//     console.error('Error handling auth callback:', error);
//     res.status(500).json({ error: error.message });
//   }
// }

import { google } from 'googleapis';
import { supabase } from '../../../utils/supabaseClient';
import { fetchEmails } from '../../../utils/gmail';
import { serialize } from 'cookie';
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_REDIRECT_URL}/api/auth/callback`
);

const handler = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code not found in URL.' });
  }

  try {
    console.log('oauth2Client',oauth2Client);
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Tokens received:', tokens);
    oauth2Client.setCredentials(tokens);
    // Log the tokens received
    console.log('Tokens received:', tokens);
    
    // const userInfoClient = google.oauth2('v2').userinfo;
    // const userInfo = await userInfoClient.get({ auth: oauth2Client });
    
    // // Log the user info received
    // console.log('User info received:', userInfo.data);
    
    // const { email } = userInfo.data;

    // Log the email to be used with Supabase
    // console.log('Email:', email);

    // const { data, error } = await supabase.auth.signInWithOAuth({
    //   provider: 'google',
    //   options: {
    //     redirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/dashboard`,
    //     scopes: 'https://www.googleapis.com/auth/gmail.readonly',
    //     access_token: tokens.access_token,
    //     refresh_token: tokens.refresh_token,
    //     provider_token: tokens.id_token,
    //   },
    // });

    // if (error) {
    //   console.log('supabase data',error);
    //   return res.status(400).json({ error: error.message });
    // }else {

    //   console.log('supabase data',data);
    // }
    // // If Supabase returns a URL, redirect the user to that URL
    // if (data?.url) {
    //   return res.redirect(data.url);
    // }
    res.setHeader('Set-Cookie', [
        serialize('accessToken', tokens.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 3600,
          path: '/',
        }),
        serialize('refreshToken', tokens.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 3600 * 24 * 30, // 30 days
          path: '/',
        }),
      ]);
    // const { data1, error1 } = await supabase.auth.setSession({
    //     access_token: tokens.access_token,
    //     refresh_token: tokens.refresh_token,
    // });

    // if (error1) {
    //     console.error('Error processing the callback:', error1.message);
    // } else {
    //     console.log('Session data after setting:', data1);
    //     router.push('/dashboard');
    // }
    // Redirect to the dashboard
    res.redirect(`${process.env.NEXT_PUBLIC_REDIRECT_URL}/dashboard`);
  } catch (error) {
    console.error('Error handling auth callback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
// import { supabase } from '../../../utils/supabaseClient';
// import Cookies from 'universal-cookie';

// export default async function handler(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const cookies = new Cookies(req.headers.cookie); // Initialize cookies with request cookies

//     const { code, code_verifier  } = req.query;

//     if (!code || !code_verifier) {
//       return res.status(400).json({ error: 'Authorization code not found' });
//     }

//     //  // Retrieve code verifier from cookies
//     //  const codeVerifier = cookies.get('codeVerifier');

//     // if (!codeVerifier) {
//     //   return res.status(400).json({ error: 'Code verifier not found' });
//     // }

//     const { data, error } = await supabase.auth.exchangeCodeForSession({
//       code,
//       code_verifier,
//     });

//     if (error) {
//       console.error('Error exchanging code for session:', error.message);
//       return res.status(500).json({ error: 'Error exchanging code for session' });
//     }

//     setCookie('access_token', data.access_token, { req, res, httpOnly: true });
//     setCookie('refresh_token', data.refresh_token, { req, res, httpOnly: true });

//     res.redirect('/dashboard');
//   } catch (error) {
//     console.error('Error handling auth callback:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }





