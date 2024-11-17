const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const detectarEmocao = (text) => {
  const keywords = {
    depressao: /triste|culpa|desanimado|desamparo|desesperança|baixa autoestima|ansiedade|irritabilidade/gi,
    ansiedade: /preocupação excessiva|preocupado|tensão|medo|insegurança|sobrecarga emocional|ansioso/gi,
    estresse_pos_traumatico: /medo intenso|culpa|vergonha|raiva|ansiedade|tristeza|trauma|flashbacks/gi,
    bipolar: /euforia|impulsivo|irritabilidade|tristeza profunda|autoconfiança extrema|oscilações de humor/gi,
    toc: /pensamentos intrusivos|compulsões|ansiedade|medo|culpa|frustração/gi,
    alimentares: /culpa com comida|vergonha do corpo|compulsão alimentar|ansiedade com peso|medo de ganhar peso/gi,
    esquizofrenia: /confusão|alucinações|paranoia|medo|tristeza|isolamento emocional/gi,
    borderline: /medo de abandono|raiva intensa|tristeza|culpa|vazio emocional|insegurança|emoções intensas/gi,
  };

  for (const [emocao, regex] of Object.entries(keywords)) {
    if (text.match(regex)) return emocao;
  }
  return 'neutro';
};


const gerarPromptEmpatico = (emocao, userInput) => {
  const prompts = {
    depressao: `
      O usuário está enfrentando sentimentos de tristeza profunda, desesperança ou culpa. Seja extremamente empático e acolhedor. 
      Pergunte gentilmente o que está causando essas emoções e valide o que ele está sentindo. Sugira pequenas ações para melhorar o humor, como:
      - Tentar uma caminhada ao ar livre
      - Conversar com alguém de confiança
      - Fazer algo relaxante, como ouvir música ou escrever sobre os sentimentos.
      Reforce que ele não está sozinho e que buscar ajuda é um passo corajoso. Ele disse: "${userInput}".
    `,
    ansiedade: `
      O usuário está lidando com ansiedade ou preocupação excessiva. Valide seus sentimentos e pergunte quais são os principais gatilhos que ele percebe.
      Sugira técnicas para aliviar a ansiedade no momento, como:
      - Um exercício de respiração profunda (inspirar por 4 segundos, segurar por 4 segundos e expirar por 4 segundos).
      - Práticas de mindfulness, como observar objetos ou sons ao redor.
      - Anotar as preocupações em um papel para organizar os pensamentos.
      Reforce que a ansiedade é temporária e existem ferramentas para gerenciá-la. Ele disse: "${userInput}".
    `,
    estresse_pos_traumatico: `
      O usuário está enfrentando dificuldades relacionadas a um evento traumático, como flashbacks ou hipervigilância. Seja muito cuidadoso e sensível.
      Reforce que ele está seguro neste momento e que é normal ter essas reações após um trauma. Pergunte se há algo específico que ele gostaria de compartilhar e valide sua experiência.
      Sugira estratégias para ajudar no momento, como:
      - Focar na respiração para se ancorar no presente.
      - Descrever objetos ou cores ao redor para distrair a mente.
      - Ouvir músicas relaxantes.
      Ele disse: "${userInput}".
    `,
    bipolar: `
      O usuário está relatando oscilações de humor ou comportamentos impulsivos. Seja acolhedor e pergunte gentilmente como ele está se sentindo agora.
      - Durante episódios depressivos: Valide sentimentos de tristeza e sugira pequenas ações que possam ajudar, como tentar estabelecer uma rotina leve.
      - Durante episódios maníacos: Pergunte como ele tem canalizado essa energia e sugira maneiras seguras de utilizá-la, como criatividade ou exercícios físicos.
      Reforce a importância de buscar equilíbrio e pergunte como ele tem cuidado de si mesmo. Ele disse: "${userInput}".
    `,
    toc: `
      O usuário está lidando com pensamentos intrusivos ou compulsões que o incomodam. Valide suas emoções, explicando que esses desafios são comuns em pessoas com TOC.
      Pergunte como ele costuma lidar com esses momentos e sugira práticas para desviar o foco, como:
      - Envolver-se em uma atividade relaxante ou prazerosa.
      - Usar técnicas de atenção plena para observar os pensamentos sem julgá-los.
      - Procurar apoio de um profissional especializado.
      Reforce que ele não está sozinho nesse processo. Ele disse: "${userInput}".
    `,
    alimentares: `
      
    o profissional especializado, como nutricionistas ou terapeutas.
      Reforce que a relação com a comida pode ser transformada com o tempo e que ele merece cuidados. Ele disse: "${userInput}".
    `,
    esquizofrenia: `
      O usuário relatou sintomas de confusão, alucinações ou paranoia. Seja extremamente cuidadoso e acolhedor, validando a experiência dele sem confrontar diretamente suas percepções.
      Pergunte como ele está se sentindo agora e se há algo que o ajude a se sentir mais seguro ou confortável. Sugira técnicas para se ancorar na realidade, como:
      - Descrever o ambiente ao seu redor (cores, objetos, sons).
      - Praticar exercícios de respiração para acalmar a mente.
      - Ouvir músicas tranquilizantes ou fazer algo que o conecte ao momento presente.
      Reforce que procurar ajuda especializada é uma parte importante do tratamento e que ele merece apoio contínuo. Ele disse: "${userInput}".
    `,
    neutro: `
      O usuário quer conversar e compartilhar algo. Seja amigável e empático. Pergunte sobre como está o dia dele e tente criar um diálogo significativo e positivo.
      Use sua intuição para responder de maneira acolhedora e estimulante. Ele disse: "${userInput}".
    `,
  };

  return prompts[emocao] || prompts.neutro;
};


app.get('/', (req, res) => {
  res.send('Backend do Serena rodando!');
});


app.post('/api/call', async (req, res) => {
  try {
    const userInput = req.body.prompt;

    
    const emocao = detectarEmocao(userInput);

    
    const prompt = gerarPromptEmpatico(emocao, userInput);

    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      temperature: 0.8,
    });

  
    res.send(response.choices[0].message.content);
  } catch (error) {
    console.error('Erro na chamada da API do OpenAI:', error);
    res.status(500).send({ error: 'Erro ao gerar resposta. Tente novamente mais tarde.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
