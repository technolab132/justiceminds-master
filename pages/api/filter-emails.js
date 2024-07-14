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

    if (!accessToken || !refreshToken) {
      return res.status(401).json({ error: 'No OAuth tokens found' });
    }

    const senderEmail = req.query.sender; // Get the sender email from query parameters
    const label = req.query?.label;
    const type = req.query.type;
    if (!senderEmail) {
      return res.status(400).json({ error: 'Sender email is required' });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Build the query string
    let query = ''
    if(type == 'RECIEVE'){
      query = `from:${senderEmail}`;
      if (label) {
        query += ` label:${label}`;
      }
    }else if(type == 'SENT'){
      query = `to:${senderEmail}`;
      if (label) {
        query += ` label:${label}`;
      }
    }
    
    // Fetch emails with the specific sender email
    const gmailResponse = await gmail.users.messages.list({
      userId: 'me',
      q: query,
    });

    const messages = await Promise.all(
      (gmailResponse.data.messages || []).map(async (message) => {
        const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
        return email.data;
      })
    );

    res.status(200).json({ emails: messages });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
