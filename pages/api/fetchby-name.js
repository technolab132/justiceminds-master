import { google } from 'googleapis';
import cookie from 'cookie';

const getOAuth2Client = (accessToken, refreshToken) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  return oauth2Client;
};

const refreshAccessToken = async (oauth2Client) => {
  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    console.log('Refreshed access token:', credentials);
    return credentials;
  } catch (error) {
    console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to refresh access token');
  }
};

const extractNameAndEmail = (headerValue) => {
  const match = headerValue.match(/^(.*?)\s*<(.+?)>$/);
  if (match) {
    const name = match[1].trim();
    const email = match[2];
    return { name: name || email, email };
  } else {
    // If the format is not "Name <email>", just return the whole string as both name and email
    const email = headerValue.trim();
    return { name: email, email };
  }
};

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
    const userEmail = req.query.userEmail;

    if (!name || !name.trim() || !userEmail || !userEmail.trim()) {
      return res.status(400).json({ error: 'Name and userEmail query parameters are required' });
    }

    let oauth2Client = getOAuth2Client(accessToken, refreshToken);

    try {
      await oauth2Client.getTokenInfo(accessToken);
    } catch {
      console.log('Access token expired or invalid, attempting to refresh...');
      try {
        const newAccessToken = await refreshAccessToken(oauth2Client);
        oauth2Client = getOAuth2Client(newAccessToken, refreshToken);
        res.setHeader('Set-Cookie', [
          cookie.serialize('access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'strict',
            path: '/',
          }),
        ]);
      } catch (refreshError) {
        console.error('Failed to refresh access token:', refreshError);
        return res.status(401).json({ error: 'auth_required', message: 'Please authenticate again' });
      }
    }

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    let gmailResponse = {
      data: {
        messages: [],
      },
    };

    const fromResponse = await gmail.users.messages.list({
      userId: 'me',
      q: `from:${name}`,
    });

    if (fromResponse.data.messages && fromResponse.data.messages.length > 0) {
      gmailResponse.data.messages = fromResponse.data.messages;
    } else {
      const toResponse = await gmail.users.messages.list({
        userId: 'me',
        q: `to:${name}`,
      });
      gmailResponse.data.messages = toResponse.data.messages || [];
    }

    if (!gmailResponse.data.messages || gmailResponse.data.messages.length === 0) {
      return res.status(200).json({ uniqueClients: [] });
    }

    const uniqueClients = new Map();

    await Promise.all(
      gmailResponse.data.messages.map(async (message) => {
        const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
        const headers = email.data.payload.headers;
        console.log(headers);
        // First, check the "From" header
        const fromHeader = headers.find((header) => header.name === 'From');
        if (fromHeader) {
          const { name: fromName, email: fromEmail } = extractNameAndEmail(fromHeader.value);
          if (fromEmail !== userEmail) {
            uniqueClients.set(fromEmail, { name: fromName, email: fromEmail });
            return; // If found in 'From', no need to check 'To'
          }
        }

        // If not found in 'From', check the "To" header
        const toHeader = headers.find((header) => header.name === 'To');
        if (toHeader) {
          const { name: toName, email: toEmail } = extractNameAndEmail(toHeader.value);
          if (toName.includes(name) && toEmail !== userEmail) {
            uniqueClients.set(toEmail, { name: toName, email: toEmail });
          }
        }
      })
    );

    res.status(200).json({
      uniqueClients: Array.from(uniqueClients.values()),
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
