// import { google } from 'googleapis';
// import cookie from 'cookie';

// export default async function handler(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const cookies = cookie.parse(req.headers.cookie || '');
//     const { accessToken, refreshToken } = cookies;

//     if (!accessToken || !refreshToken) {
//       return res.status(401).json({ error: 'No OAuth tokens found' });
//     }
//     const label = req.query.label;

//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );
//     oauth2Client.setCredentials({
//       access_token: accessToken,
//       refresh_token: refreshToken,
//     });

//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
//     const gmailResponse = await gmail.users.messages.list({ userId: 'me', q:` label:${label}`});

//     const emails = await Promise.all(
//       gmailResponse.data.messages.map(async (message) => {
//         const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
//         return email.data;
//       })
//     );

//     res.status(200).json({ emails });
//   } catch (error) {
//     console.error('Error fetching emails:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }
import { google } from 'googleapis';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.access_token;
    const refreshToken = cookies.refresh_token;
    console.log('accessToken',accessToken);
    if (!accessToken || !refreshToken) {
      return res.status(401).json({ error: 'No OAuth tokens found' });
    }
    console.log('accessToken',accessToken);
    const label = req.query.label;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const gmailResponse = await gmail.users.messages.list({ userId: 'me', q: `label:${label}` });

    const emails = await Promise.all(
      gmailResponse.data.messages.map(async (message) => {
        const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
        return email.data;
      })
    );

    res.status(200).json({ emails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

