const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});


app.get('/', (req, res) => {
  res.send('Backend do Serena rodando!');
});

app.post('/api/call', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: req.body.prompt }],
      max_tokens: 1024,
      temperature: 0.8,
    });

    res.send(response.choices[0].message.content);
  } catch (error) {
    console.error("Erro na chamada da API do OpenAI:", error);
    res.status(500).send({ error: 'Erro ao gerar resposta. Tente novamente mais tarde.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});