import { google } from 'googleapis';

/**
 * Function to fetch emails from Gmail using OAuth2 client.
 * @param {OAuth2Client} oauth2Client Initialized OAuth2Client instance with credentials set.
 * @returns {Promise<Array>} Array of email message details.
 */
export const fetchEmails = async (oauth2Client) => {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const emails = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10, // Fetch 10 emails for example
    });

    const emailDetails = await Promise.all(
      emails.data.messages.map(async (message) => {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        });
        return msg.data;
      })
    );

    return emailDetails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw new Error('Failed to fetch emails');
  }
};
