const { GoogleGenAI } = require("@google/genai");

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  try {
    const { history, message, systemInstruction } = req.body;
    
    if (!message) {
      res.status(400).end('Message is required.');
      return;
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error('API_KEY environment variable not set.');
        res.status(500).end('API key not configured on server.');
        return;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history || [],
        config: {
            systemInstruction: systemInstruction,
        },
    });

    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
      const chunkText = chunk.text;
      if (chunkText) {
        res.write(chunkText);
      }
    }

    res.end();

  } catch (error) {
    console.error('Error in AI chat handler:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to get chat response.' });
    }
    res.end();
  }
};
