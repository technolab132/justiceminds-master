// // utils/pdfParser.js
// const axios = require('axios');
// const pdf = require('pdf-parse');

// async function extractTextFromPDF(pdfUrl) {
//   try {
//     // Fetch the PDF from the URL
//     const response = await axios.get(pdfUrl, {
//       responseType: 'arraybuffer',
//     });

//     // Convert the binary PDF data to a buffer
//     const pdfBuffer = Buffer.from(response.data);

//     // Parse the PDF
//     const data = await pdf(pdfBuffer);

//     return {
//       text: data.text,
//       numPages: data.numPages,
//     };
//   } catch (error) {
//     console.error('Error extracting text from PDF:', error);
//     return null;
//   }
// }

// module.exports = extractTextFromPDF;
