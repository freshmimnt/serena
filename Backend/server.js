import mysql from 'mysql2';

import express from 'express';
import dotenv from 'dotenv';

import sgMail from '@sendgrid/mail';
import Stripe from 'stripe';
import OpenAI from "openai";
import cors from 'cors';


dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const stripe = new Stripe(process.env.STRIPE_API_KEY, { apiVersion: '2024-11-08' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
}).promise();

function generateRandomPassword(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random()     * chars.length)]).join('');
}




app.delete('/', async (req, res) => {
    try {
        const { user_id } = req.body; 

        await pool.query(
            "DELETE FROM users WHERE user_id = ?",
            [user_id]
        );
        res.json({ message: 'Sucesso' });
    } catch (err) {
        console.error("Erro:", err);
        res.status(500).send("Erro");
    }
});


app.put('/', async (req, res) => {
    try {
        const { user_id, name, email } = req.body; 

        await pool.query(
            "UPDATE users SET name = ?, email = ? WHERE user_id = ?",
            [name, email, user_id] 
        );
        res.json({ message: 'Sucesso' });
    } catch (err) {
        console.error("Erro:", err);
        res.status(500).send("Erro");
    }
});

app.get('/days-left', async (req, res) => {
    try {
        const company_id  = 1; 
        const [rows] = await pool.query(`
            SELECT 
                name,
                DATEDIFF(DATE_ADD(purchase_date, INTERVAL 1 YEAR), CURDATE()) AS days_left
            FROM 
                companies
            WHERE 
                company_id = ?
        `, [company_id]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: "Company not found" });
        }
    } catch (err) {
        console.error("Error fetching days left:", err);
        res.status(500).send("Database query failed");
    }
});

app.get('/numberOfEmployees', async (req, res) => {
    try {
        const company_id  = 1; 
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) AS total_employees
            FROM 
                users
            WHERE 
                company_id =? and role = 
        `, [company_id]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: "Company not found" });
        }
    } catch (err) {
        console.error("Error fetching number of employees:", err);
        res.status(500).send("Database query failed");
    }
})

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

app.post('/api/call', async (req, res) => {
    try {
        const userInput = req.body.prompt;

    
        const emocao = detectarEmocao(userInput);
    
        
        const prompt = gerarPromptEmpatico(emocao, userInput);

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1024,
            temperature: 0.8,
        });

        res.send(response.choices[0].message.content);
    } catch (error) {
        console.error("OpenAI API error:", error.response?.data || error.message);
        res.status(500).send({ error: "OpenAI API call failed." });
    }
});



app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
