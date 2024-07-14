import { oAuth2ClientInstance } from '../../lib/gmailClient';

export const saveGmailToken = async (code) => {
  try {
    const oAuth2Client = oAuth2ClientInstance;

    if (!oAuth2Client) {
      throw new Error('Unauthorized');
    }

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Instead of saving the tokens to a file, you can store them in local storage or send them to a backend server
    localStorage.setItem('gmail_tokens', JSON.stringify(tokens));

    return { success: true };
  } catch (error) {
    console.error('Error during authorization:', error);
    return { success: false, error };
  }
};
