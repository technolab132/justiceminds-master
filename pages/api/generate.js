import {OpenAI} from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_CHATGPT_API_URL, // defaults to process.env["OPENAI_API_KEY"]
});

export default async function handler(req, res) {
    let {message} = req.body
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: message }],
        model: 'gpt-3.5-turbo',
      });
    
    res.status(200).json(completion.choices[0].message.content)
}








// // pages/api/generate.js
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     try {
//       const { message } = req.body;

//       // Make a request to the ChatGPT API
//       const response = await fetch(`${process.env.NEXT_PUBLIC_CHATGPT_API_URL}/generate`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message }),
//       });

//       // Check if the request was successful
//       if (!response.ok) {
//         console.error(`Error calling ChatGPT API. Status: ${response.status}, Text: ${await response.text()}`);
//         res.status(500).json({ error: 'Internal Server Error' });
//         return;
//       }

//       // Parse the response
//       let gptResponse;
//       try {
//         const responseData = await response.json();
//         gptResponse = responseData.response || 'Unable to generate a response.';
//       } catch (jsonError) {
//         console.error('Error parsing JSON response from ChatGPT API:', jsonError);
//         res.status(500).json({ error: 'Internal Server Error' });
//         return;
//       }

//       // Store the GPT response in the Supabase database
//       await supabase.from('messages').upsert([
//         {
//           name: 'ChatGPT',
//           message: gptResponse,
//         },
//       ]);

//       // Respond with the generated message
//       res.status(200).json({ response: gptResponse });
//     } catch (error) {
//       console.error('Error in ChatGPT API:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method Not Allowed' });
//   }
// }
