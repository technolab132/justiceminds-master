// pages/api/save-tokens.js
import { oAuth2ClientInstance } from '../../lib/gmailClient';
import { promises as fs } from 'fs';
import path from 'path';

const TOKEN_PATH = path.join(process.cwd(), 'token.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Missing code parameter' });
    }

    try {
      const oAuth2Client = oAuth2ClientInstance;

      if (!oAuth2Client) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      // Save the credentials to the token.json file
      await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));

      return res.status(200).json({ message: 'Authorization successful', tokens });
    } catch (error) {
      console.error('Error during authorization:', error);
      return res.status(500).json({ error: 'Authorization failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
