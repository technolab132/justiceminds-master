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

    const name = req.query.name;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name query parameter is required' });
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
    const gmailResponse = await gmail.users.messages.list({
      userId: 'me',
      q: `from:${name}`,
    });

    if (!gmailResponse.data.messages || gmailResponse.data.messages.length === 0) {
      return res.status(200).json({ uniqueClients: [] });
    }

    const uniqueClients = new Map();

    await Promise.all(
      gmailResponse.data.messages.map(async (message) => {
        const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
        const headers = email.data.payload.headers;
        const fromHeader = headers.find((header) => header.name === 'From');
        if (fromHeader) {
          const nameEmailMatch = fromHeader.value.match(/(.+?)\s*<(.+?)>/);
          if (nameEmailMatch && nameEmailMatch.length === 3) {
            const name = nameEmailMatch[1].trim();
            const emailAddress = nameEmailMatch[2];
            uniqueClients.set(emailAddress, name);
          } else {
            const emailAddressMatch = fromHeader.value.match(/<(.+?)>/);
            if (emailAddressMatch && emailAddressMatch.length === 2) {
              const emailAddress = emailAddressMatch[1];
              uniqueClients.set(emailAddress, '');
            }
          }
        }
      })
    );

    res.status(200).json({ uniqueClients: Array.from(uniqueClients.entries()).map(([email, name]) => ({ email, name })) });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
