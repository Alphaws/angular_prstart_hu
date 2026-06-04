const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL_NAME = process.env.MODEL_NAME || 'angular_assistant';

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await fetch(`${OLLAMA_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [{ role: 'user', content: message }],
                stream: false
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Ollama error: ${error}`);
        }

        const data = await response.json();
        res.json({ response: data.message.content });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to connect to AI model' });
    }
});

app.listen(PORT, () => {
    console.log(`API Proxy running on port ${PORT}`);
    console.log(`Connecting to Ollama at: ${OLLAMA_URL}`);
});
