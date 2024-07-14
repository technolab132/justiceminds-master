import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import pdf from 'pdf-parse';

export default async function handler(req,res) {
  if (req.method === 'POST') {
    try {
      const { pdfUrl } = req.body;

      // Fetch the PDF file
      const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });

      // Convert the PDF buffer to text
      const dataBuffer = response.data;
      const data = new Uint8Array(dataBuffer);
      const text = await pdf(data);

      res.status(200).json({ text: text.text });
    } catch (error) {
      console.error('Error extracting text:', error);
      res.status(500).json({ error: 'Error extracting text' });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
