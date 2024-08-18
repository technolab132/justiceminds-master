import { google } from 'googleapis';
import { decryptToken } from '../../lib/tokenUtils'; // Utility to decrypt token

export default async function handler(req, res) {
  const { token,refreshToken, emailId } = req.query; // Include iv in the query

  // if (!token || !emailId || !iv) {
  //   return res.status(400).json({ error: 'Token, IV, and email ID are required' });
  // }

  try {
    // Decrypt the token
    // const decryptedToken = decryptToken(token, req.query.iv);
    // console.log('Decrypted token:', decryptedToken);

    // Set up OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken,
    });

    //oauth2Client.setCredentials({ access_token: token });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  
    // Validate the emailId before making the request
    if (!emailId || typeof emailId !== 'string') {
      throw new Error('Invalid emailId format.');
    }

    // Fetch email data
    const gmailResponse = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 100, // Number of emails per page
    });

    const messages = await Promise.all(
      (gmailResponse.data.messages || []).map(async (message) => {
        const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
        return email.data;
      })
    );

    // Return the emails and the nextPageToken if available
    res.status(200).json({
      emails: messages,
      //nextPageToken: gmailResponse.data.nextPageToken || null,
    });
  } catch (error) {
    console.error('Error fetching email data:', error);
    res.status(500).json({ error: 'Failed to fetch email data' });
  }
}
