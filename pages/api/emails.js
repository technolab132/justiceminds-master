// Import your custom Gmail client
// import { getMessages, getMessage } from "../../lib/gmailClient";

// // // Define your GET request handler
// export default async function handler(req,res) {
//   console.log(req.headers);
//   // Retrieve the access token from the request or environment variables
//   const accessToken = req.headers['authorization']?.split("Bearer ")[1];
//   console.log("accessToken from handler", accessToken);
//   // Check if the access token is available
//   if (!accessToken) {
//     res.status(401).json({ error: "Unauthorized" });
//   }

//   try {
//     // Fetch messages from Gmail using the access token
//     const messages = await getMessages(accessToken);

//     // Process the messages if needed
//     // For example, you can extract message IDs and other details

//     // Return the response
//     res.status(200).json(messages);
//   } catch (error) {
//     console.error("Error fetching emails:", error);
//     res.status(500).json({ error: "Error fetching emails" });
//   }
// }

// pages/api/email.js
// import { getGmailClient } from '../../lib/gmailClient';
// import { supabase } from '../../utils/supabaseClient';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
    runtime: 'edge', // Ensure API route runs in Edge runtime
  },
};

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     try {
//       console.log('Request method:', req.method);
//       console.log('Request headers:', req.headers);
//       console.log('Request body:', req.body);
//       // Parse the incoming request body
//       const code = req.body;

//       console.log('Received code:', code);

//       // Initialize Gmail client with the provided code
//       const gmailClient = await getGmailClient(code);

//       if (!gmailClient) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       console.log('Gmail Client initialized:', gmailClient);

//       // Fetch emails
//       const gmailResponse = await gmailClient.users.messages.list({
//         userId: 'me',
//         maxResults: 10, // Change this value to retrieve more or fewer emails
//       });

//       const messageIds = gmailResponse.data.messages || [];

//       const emails = await Promise.all(
//         messageIds.map(async (messageId) => {
//           const message = await gmailClient.users.messages.get({
//             userId: 'me',
//             id: messageId.id,
//           });

//           const headers = message.data.payload.headers;
//           const subject = headers.find(({ name }) => name === 'Subject').value;
//           const from = headers.find(({ name }) => name === 'From').value;
//           const date = headers.find(({ name }) => name === 'Date').value;

//           let body = '';

//           // Check if the message has parts
//           if (message.data.payload.parts) {
//             const htmlPart = message.data.payload.parts.find(part => part.mimeType === 'text/html');
//             const plainTextPart = message.data.payload.parts.find(part => part.mimeType === 'text/plain');

//             if (htmlPart && htmlPart.body.data) {
//               body = Buffer.from(htmlPart.body.data, 'base64').toString('utf-8');
//             } else if (plainTextPart && plainTextPart.body.data) {
//               body = Buffer.from(plainTextPart.body.data, 'base64').toString('utf-8');
//             }
//           } else if (message.data.payload.body && message.data.payload.body.data) {
//             // If message has no parts, directly access the body
//             body = Buffer.from(message.data.payload.body.data, 'base64').toString('utf-8');
//           }

//           return {
//             id: messageId.id,
//             subject,
//             from,
//             date,
//             body,
//           };
//         })
//       );

//       return res.status(200).json(emails);
//     } catch (error) {
//       console.error('Error fetching emails:', error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//   } else {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }
// }

import { parseJSON } from '../../lib/middleware';
import { getGmailClient } from '../../lib/gmailClient';

// const handler = async (req, res) => {
//   if (req.method === 'POST') {
//     console.log('Request body:', req.body);
//     const code = req.body;

//     console.log('Received code:', code);

//     try {
//       const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages', {
//         headers: {
//           Authorization: `Bearer ${code.accessToken}`,
//         },
//       });
    
//       const data = await response.json();
//       console.log('data',data)
//      // const gmailClient = await getGmailClient(code);

//       if (!gmailClient) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       console.log('Gmail Client initialized:', gmailClient);

//       const gmailResponse = await gmailClient.users.messages.list({
//         userId: 'me',
//         maxResults: 10,
//       });

//       const messageIds = gmailResponse.data.messages || [];

//       const emails = await Promise.all(
//         messageIds.map(async (messageId) => {
//           const message = await gmailClient.users.messages.get({
//             userId: 'me',
//             id: messageId.id,
//           });

//           const headers = message.data.payload.headers;
//           const subject = headers.find(({ name }) => name === 'Subject').value;
//           const from = headers.find(({ name }) => name === 'From').value;
//           const date = headers.find(({ name }) => name === 'Date').value;

//           let body = '';

//           if (message.data.payload.parts) {
//             const htmlPart = message.data.payload.parts.find(part => part.mimeType === 'text/html');
//             const plainTextPart = message.data.payload.parts.find(part => part.mimeType === 'text/plain');

//             if (htmlPart && htmlPart.body.data) {
//               body = Buffer.from(htmlPart.body.data, 'base64').toString('utf-8');
//             } else if (plainTextPart && plainTextPart.body.data) {
//               body = Buffer.from(plainTextPart.body.data, 'base64').toString('utf-8');
//             }
//           } else if (message.data.payload.body && message.data.payload.body.data) {
//             body = Buffer.from(message.data.payload.body.data, 'base64').toString('utf-8');
//           }

//           return {
//             id: messageId.id,
//             subject,
//             from,
//             date,
//             body,
//           };
//         })
//       );

//       return res.status(200).json(emails);
//     } catch (error) {
//       console.error('Error fetching emails:', error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//   } else {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }
// };

export default parseJSON(handler);


// export default async function handler(req, response) {
//   // const authorizationHeader = request.headers.authorization;
//   // if (!authorizationHeader) {
//   //   return response.status(401).json({ error: 'Unauthorized' });
//   // }

//   // const token = authorizationHeader.split(' ')[1];
//   // const tokens = JSON.parse(Buffer.from(token, 'base64').toString());

//   // if (!tokens) {
//   //   return response.status(401).json({ error: 'Unauthorized' });
//   // }
  
//  // const session = localStorage.getItem('sb-sbyocimrxpmvuelrqzuw-auth-token');
//   // if (!session) {
//   //   throw new Error('No session found');
//   // }
//   // console.log(tokens);
//   // const parsedResponse = JSON.parse(session);
//   // const accessToken = parsedResponse.access_token;
//   // const refreshToken = parsedResponse.refresh_token;
//   // const tokenType = parsedResponse.token_type;
//   // const expiryDate = parsedResponse.expiry_date;
//  // const { data: session, error: sessionError } = await supabase.auth.getSession();

//   // if (sessionError) {
//   //   console.error('Error retrieving session:', sessionError.message);
//   //   return res.status(401).json({ error: 'Unauthorized' });
//   // }
//   //const { code } = req.body;
//   if (req.method === 'POST') {
    
//     const code = req.body;
//     console.log('request:', req.body);
//     const gmailClient = await getGmailClient(code);

//     if (!gmailClient) {
//       return response.status(401).json({ error: 'Unauthorized' });
//     }

//     try {
//       console.log('gmailClient',gmailClient.users.messages)
//       const gmailResponse = await gmailClient.users.messages.list({
//         userId: 'me',
//         maxResults: 10, // Change this value to retrieve more or fewer emails
//       });
//       console.log('gmailResponse',gmailResponse)
//       const messageIds = gmailResponse.data.messages || [];

//       const emails = await Promise.all(
//         messageIds.map(async (messageId) => {
//           const message = await gmailClient.users.messages.get({
//             userId: 'me',
//             id: messageId.id,
//           });

//           const headers = message.data.payload.headers;
//           const subject = headers.find(({ name }) => name === 'Subject').value;
//           const from = headers.find(({ name }) => name === 'From').value;
//           const date = headers.find(({ name }) => name === 'Date').value;

//           let body = '';

//           // Check if the message has parts
//           if (message.data.payload.parts) {
//             const htmlPart = message.data.payload.parts.find(part => part.mimeType === 'text/html');
//             const plainTextPart = message.data.payload.parts.find(part => part.mimeType === 'text/plain');

//             if (htmlPart && htmlPart.body.data) {
//               body = Buffer.from(htmlPart.body.data, 'base64').toString('utf-8');
//             } else if (plainTextPart && plainTextPart.body.data) {
//               body = Buffer.from(plainTextPart.body.data, 'base64').toString('utf-8');
//             }
//           } else if (message.data.payload.body && message.data.payload.body.data) {
//             // If message has no parts, directly access the body
//             body = Buffer.from(message.data.payload.body.data, 'base64').toString('utf-8');
//           }

//           return {
//             id: messageId.id,
//             subject,
//             from,
//             date,
//             body,
//           };
//         })
//       );

//       return response.status(200).json(emails);
//     } catch (error) {
//       console.error('Error fetching emails:', error);
//       return response.status(500).json({ error: 'Internal Server Error' });
//     }
//   } else {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }
// }





// import { google } from 'googleapis';

// const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// export default async function handler(req, res) {
//   const accessToken = req.headers.authorization?.split('Bearer ')[1];

//   if (!accessToken) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   try {
//     oAuth2Client.setCredentials({ access_token: accessToken });
//     const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

//     const response = await gmail.users.messages.list({ userId: 'me' });
//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error('Error fetching emails:', error);
//     res.status(500).json({ error: 'Error fetching emails' });
//   }
// }
