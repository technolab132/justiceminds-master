

// // lib/gmailClient.js
// lib/gmailClient.js
// lib/gmailClient.js
import { google } from 'googleapis';
import { promises as fs } from 'fs';
import path from 'path';

const GMAIL_API_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/auth/callback';//'https://sbyocimrxpmvuelrqzuw.supabase.co/auth/v1/callback'//

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const TOKEN_PATH = path.join(process.cwd(), 'token.json');

export async function getGmailClient(tokens) {
  try {
    console.log('tokens',tokens);
    if (tokens) {
      // const { code } = await oAuth2Client.getToken(tokens);
      // console.log('tokens',code);
      oAuth2Client.setCredentials(tokens);
      // const session = localStorage.getItem('sb-sbyocimrxpmvuelrqzuw-auth-token');
      // if (!session) {
      //   throw new Error('No session found');
      // }

      // const parsedResponse = JSON.parse(session);
      // const accessToken = parsedResponse.access_token;
      // const refreshToken = parsedResponse.refresh_token;
      // const tokenType = parsedResponse.token_type;
      // const expiryDate = parsedResponse.expiry_date;
      // const token = {
      //   access_token: accessToken,
      //   refresh_token: refreshToken,
      //   scope: GMAIL_API_SCOPE,
      //   token_type: tokenType,
      //   expiry_date: expiryDate

      // } 
      //oAuth2Client.setCredentials(tokens);
      console.log('oauthclient',oAuth2Client)
      // Check if the access token is expiring or expired
      const expiryDate = tokens.expiry_date || 0;
      const isExpired = Date.now() > expiryDate;

      if (isExpired) {
        console.log('Access token expired, refreshing...');
        const newTokens = await oAuth2Client.refreshAccessToken();
        oAuth2Client.setCredentials(newTokens.credentials);
        console.log('refresh token',newTokens.credentials);
        //oAuth2Client.setCredentials(credentials);

        // Save the new tokens to the file
       // await fs.writeFile(TOKEN_PATH, JSON.stringify(credentials));
      }
    } else {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [GMAIL_API_SCOPE],
      });

      return {
        statusCode: 302,
        redirect: {
          destination: authUrl,
        },
      };
    }
    
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    console.log('google',gmail);
    return gmail;
  } catch (error) {
    console.error('Error getting Gmail client:', error.message);
    return null;
  }
}

export const oAuth2ClientInstance = oAuth2Client;

// lib/gmailClient.js
// import axios from 'axios';
// import { verifyToken } from './verifyToken';
// const clientId = process.env.GOOGLE_CLIENT_ID;
// const redirectUri = 'https://sbyocimrxpmvuelrqzuw.supabase.co/auth/v1/callback';
// const scope = 'https://www.googleapis.com/auth/gmail.readonly';

// export async function getMessages(accessToken) {
//   try {
//     const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
//     console.log('authurl',authUrl);
//     await verifyToken(accessToken);
//     console.log('accessToken from gmail client',accessToken);
//     const response = await axios.get('https://www.googleapis.com/gmail/v1/users/me/messages', {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${accessToken}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//     throw error;
//   }
// }

// export async function getMessage(accessToken, messageId) {
//   try {
//     console.log('accessToken',accessToken);
//     const response = await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching message ${messageId}:`, error);
//     throw error;
//   }
// }

// Similar functions for fetching attachments
