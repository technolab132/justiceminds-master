// lib/middleware.js
export const parseJSON = (handler) => async (req, res) => {
    if (req.method === 'POST') {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const rawBody = Buffer.concat(chunks).toString();
      try {
        req.body = JSON.parse(rawBody);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid JSON' });
      }
    }
    return handler(req, res);
  };
  