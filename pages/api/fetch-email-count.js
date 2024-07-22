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

    const senderEmail = req.query.sender;
    const type = req.query.type;

    if (!senderEmail) {
      return res.status(400).json({ error: 'Sender email is required' });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Refresh the access token if needed
    // const { credentials } = await oauth2Client.refreshAccessToken();
    // oauth2Client.setCredentials(credentials);

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    let query = '';
    if (type === 'RECIEVE') {
      query = `from:${senderEmail}`;
    } else if (type === 'SENT') {
      query = `to:${senderEmail}`;
    }

    console.log(`Query: ${query}`); // Log the constructed query

    let totalEmails = 0;
    let pageToken = null;

    do {
      const response = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        pageToken: pageToken,
        maxResults: 100,
      });

      totalEmails += response.data.messages ? response.data.messages.length : 0;
      pageToken = response.data.nextPageToken;
    } while (pageToken);

    res.status(200).json({ count: totalEmails });
  } catch (error) {
    console.error('Error fetching email count:', error.response?.data || error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
