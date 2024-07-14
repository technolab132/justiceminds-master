// utils/fetchEmails.js
// import { google } from 'googleapis';
// import { OAuth2Client } from 'google-auth-library';

// const oauth2Client = new OAuth2Client(
//   process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//   process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
//   'http://localhost:3000/auth/callback'
// );

// export const fetchEmails = async (accessToken) => {
//   oauth2Client.setCredentials({ access_token: accessToken });
//   const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

//   try {
//     // Fetch the list of emails
//     const res = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });
//     const messages = res.data.messages || [];

//     // Fetch details for each email
//     const emailPromises = messages.map(async (message) => {
//       const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
//       return email.data;
//     });

//     const emails = await Promise.all(emailPromises);
//     return emails;
//   } catch (error) {
//     console.error('Error fetching emails:', error);
//     throw error;
//   }
// };

// import { oAuth2ClientInstance } from '../lib/gmailClient';

// import path from 'path';

// // const TOKEN_PATH = path.join(process.cwd(), 'token.json');

// export async function fetchEmails(request) {
//   const oAuth2Client = oAuth2ClientInstance;

//   if (!oAuth2Client) {
//     return new Response('Unauthorized', { status: 401 });
//   }

//   const urlString = request.url.toString(); // Convert request.url to a string
//   const url = new URL(urlString); // Create a new URL instance from the string
//   const code = url.searchParams.get('code');

//   if (!code) {
//     console.error('Missing code parameter in URL:', urlString);
//     return new Response('Missing code parameter', { status: 400 });
//   }

//   try {
//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens);

//     // Save the credentials to the token.json file
//   //  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));

//     return new Response('Authorization successful', { status: 200 });
//   } catch (error) {
//     console.error('Error during authorization:', error);
//     return new Response('Authorization failed', { status: 500 });
//   }
// }


import { google } from 'googleapis';
import cookie from 'cookie';

export async function fetchEmails(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const { accessToken, refreshToken } = cookies;

  if (!accessToken || !refreshToken) throw new Error('No OAuth tokens found');

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const res = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });

  const emails = await Promise.all(
    res.data.messages.map(async (message) => {
      const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
      return email.data;
    })
  );

  return emails;
}

