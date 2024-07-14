import { google } from 'googleapis';
import cookie from 'cookie';
export default async function handler(req, res) {
  const { emailId, attachmentId } = req.query;

  if (!emailId || !attachmentId) {
    return res.status(400).json({ error: 'Missing emailId or attachmentId' });
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.access_token;
    const refreshToken = cookies.refresh_token;

    if (!accessToken || !refreshToken) {
      return res.status(401).json({ error: 'No OAuth tokens found' });
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );
    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client});

    // Fetch the attachment
    const response = await gmail.users.messages.attachments.get({
      userId: 'me',
      messageId: emailId,
      id: attachmentId,
    });
    console.log('response',response);
    const attachmentData = response.data;

    res.status(200).json({ data: attachmentData.data });
  } catch (error) {
    console.error('Error fetching attachment:', error);
    res.status(500).json({ error: 'Failed to fetch attachment' });
  }
}
