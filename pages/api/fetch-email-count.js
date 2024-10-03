import { google } from 'googleapis';
import cookie from 'cookie';
// for html body
const decodeBase64UrlSafe = (str) => {
  try {
    // Handle any potential issues with padding
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64);
    return decodeURIComponent(escape(decoded));
  } catch (e) {
    console.error("Error decoding Base64 string", e);
    return '';
  }
};

// Function to find and decode the text and HTML parts
const getBodyData = (payload) => {
  let textBody = 'No Message';
  let htmlBody = 'No Message';
  let inlineImages = {};

  if (!payload.parts && payload.mimeType === 'text/html') {
    htmlBody = decodeBase64UrlSafe(payload.body.data);
  } else if (payload.parts) {
    payload.parts.forEach(part => {
      if (part.mimeType === 'multipart/related' && part.parts) {
        part.parts.forEach(subPart => {
          if (subPart.mimeType === 'text/plain') {
            textBody = decodeBase64UrlSafe(subPart.body.data);
          } else if (subPart.mimeType === 'text/html') {
            htmlBody = decodeBase64UrlSafe(subPart.body.data);
          }
        });
      }else if (part.mimeType === 'multipart/alternative' && part.parts) {
        part.parts.forEach(subPart => {
          if (subPart.mimeType === 'text/plain') {
            textBody = decodeBase64UrlSafe(subPart.body.data);
          } else if (subPart.mimeType === 'text/html') {
            htmlBody = decodeBase64UrlSafe(subPart.body.data);
          }
        });
      } else if (part.mimeType === 'text/plain') {
        textBody = decodeBase64UrlSafe(part.body.data);
      } else if (part.mimeType === 'text/html') {
        htmlBody = decodeBase64UrlSafe(part.body.data);
      } 
      else if (part.mimeType.startsWith('image/')) {
        const cid = part.headers.find(h => h.name.toLowerCase() === 'content-id')?.value.replace(/[<>]/g, '');
        if (cid) {
          // Assume attachmentId is a string and not a promise
          const attachmentId = part.body.attachmentId;
          if (attachmentId) {
            // Store attachmentId directly if it's a string or resolved value
            inlineImages[cid] = attachmentId; 
          }
          // You can optionally log attachmentId here for debugging
          console.log('attachmentId', attachmentId);
        }
        //inlineImages[part.headers.find(h => h.name === 'Content-ID').value] = `data:${part.mimeType};base64,${part.body.data}`;
      }
    });
  }
  htmlBody = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${htmlBody}</body></html>`;

  return { textBody, htmlBody, inlineImages };
};

const extractUrlsFromText = (text) => {
  if (typeof text === 'string') {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.match(urlPattern) || [];
  }
  return [];
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if(req.query.token){
      const accessToken = req.query.token;
      const refreshToken = req.query.refreshToken;
      const type = req.query.type;
      const senderEmail = req.query.emailId;
  
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
        query = `from:${senderEmail},label:INBOX`;
      } else if (type === 'SENT') {
        query = `to:${senderEmail},label:${type}`;
      }
  
      console.log(`Query: ${query}`); // Log the constructed query
  
      let totalEmails = 0;
      let pageToken = null;
      let totalPdfAttachments = 0;
      let totalInnerLinks = 0;
      do {
        const response = await gmail.users.messages.list({
          userId: 'me',
          q: query,
          pageToken: pageToken,
          maxResults: 100,
        });

        // Log the response for debugging
        console.log('Response:', response.data);

        // Ensure messages is defined and is an array before mapping
        if (response.data && Array.isArray(response.data.messages)) {
          totalEmails += response.data.messages.length;

          // Process messages in parallel to reduce response time
          const promises = response.data.messages.map(message => 
            gmail.users.messages.get({ userId: 'me', id: message.id })
              .then(email => {
                const { textBody } = getBodyData(email.data.payload);
                const innerLinksCount = extractUrlsFromText(textBody).length;
                if (innerLinksCount > 0) {
                  totalInnerLinks += 1; // Count one for each email with at least one inner link
                }
                const pdfParts = email.data.payload.parts ? email.data.payload.parts.filter(part => part.mimeType === 'application/pdf') : [];
                if (pdfParts.length > 0) {
                  totalPdfAttachments += 1; // Count one for each email with at least one PDF attachment
                }
              })
          );
          await Promise.all(promises);
        } else {
          console.warn('No messages found or messages is not an array:', response.data.messages);
        }
        pageToken = response.data.nextPageToken;
      } while (pageToken);
  
      res.status(200).json({ count: totalEmails, totalPdfAttachments: totalPdfAttachments, totalInnerLinks: totalInnerLinks });
    }else{
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
        query = `from:${senderEmail},label:INBOX`;
      } else if (type === 'SENT') {
        query = `to:${senderEmail},label:${type}`;
      }
  
      console.log(`Query: ${query}`); // Log the constructed query
  
      let totalEmails = 0;
      let pageToken = null;
      let totalPdfAttachments = 0;
      let totalInnerLinks = 0;
      do {
        const response = await gmail.users.messages.list({
          userId: 'me',
          q: query,
          pageToken: pageToken,
          maxResults: 100,
        });

        // Process messages in parallel to reduce response time
        // Ensure messages is defined and is an array before mapping
        if (response.data && Array.isArray(response.data.messages)) {
          totalEmails += response.data.messages.length;

          // Process messages in parallel to reduce response time
          const promises = response.data.messages.map(message => 
            gmail.users.messages.get({ userId: 'me', id: message.id })
              .then(email => {
              const { textBody } = getBodyData(email.data.payload);
              const innerLinksCount = extractUrlsFromText(textBody).length;
              if (innerLinksCount > 0) {
                totalInnerLinks += 1; // Count one for each email with at least one inner link
              }
              const pdfParts = email.data.payload.parts ? email.data.payload.parts.filter(part => part.mimeType === 'application/pdf') : [];
              if (pdfParts.length > 0) {
                totalPdfAttachments += 1; // Count one for each email with at least one PDF attachment
              }
            })
          );
          await Promise.all(promises);
        } else {
          console.warn('No messages found or messages is not an array:', response.data.messages);
        }
        pageToken = response.data.nextPageToken;
      } while (pageToken);
  
      res.status(200).json({ count: totalEmails, totalPdfAttachments: totalPdfAttachments, totalInnerLinks: totalInnerLinks });
    }
    
  } catch (error) {
    console.error('Error fetching email count:', error.response?.data || error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
