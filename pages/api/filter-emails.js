import { google } from 'googleapis';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    if(req.query.token){
      const accessToken = req.query.token;
      const refreshToken = req.query.refreshToken;
      const label = req.query?.label;
      const type = req.query.type;
      const senderEmail = req.query.emailId;
      const pageToken = req.query.pageToken;
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );
      oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
  
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  
      let query = '';
      if (type === 'RECIEVE' || type === 'received' || type === 'RECEIVED') {
        query = `from:${senderEmail},label:${label}`;
      } else if (type === 'SENT') {
        query = `to:${senderEmail},label:${label}`;
      }
  
      const gmailResponse = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        pageToken: pageToken || undefined, // Set the pageToken if provided
        maxResults: 400, // Number of emails per page
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
        nextPageToken: gmailResponse.data.nextPageToken || null,
      });
    }else{
      const cookies = cookie.parse(req.headers.cookie || '');
      const accessToken = cookies.access_token;
      const refreshToken = cookies.refresh_token;
  
      if (!accessToken || !refreshToken) {
        return res.status(401).json({ error: 'No OAuth tokens found' });
      }
  
      const senderEmail = req.query.sender;
      const label = req.query?.label;
      const type = req.query.type;
      const pageToken = req.query.pageToken; // Get the pageToken from query parameters
  
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
  
      let query = '';
      if (type === 'RECIEVE' || type === 'received' || type === 'RECEIVED') {
        query = `from:${senderEmail},label:${label}`;
      } else if (type === 'SENT') {
        query = `to:${senderEmail},label:${label}`;
      }
  
      const gmailResponse = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        pageToken: pageToken || undefined, // Set the pageToken if provided
        maxResults: 400, // Number of emails per page
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
        nextPageToken: gmailResponse.data.nextPageToken || null,
      });
    }
    

    
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
