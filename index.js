const express = require('express');
const fetch = require('node-fetch');

const app = express();
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.get('/', (req, res) => {
  res.json({ status: 'running', test: 'ok' });
});

app.get('/test-gemini', async (req, res) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://test-app.fly.dev',
        'X-Title': 'Gemini Test'
      },
      body: JSON.stringify({
        model: 'google/gemini-3.5-flash',
        messages: [{ role: 'user', content: 'Hello, are you working?' }]
      })
    });

    const data = await response.json();

    res.json({
      success: response.ok && !data.error,
      status: response.status,
      result: data.choices?.[0]?.message?.content || 'No response'
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
