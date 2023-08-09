import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; // Importe o pacote cors

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Use o middleware cors
app.use(express.json());


// Implementa a rota /api/ask para lidar com as requisições do frontend
app.post('/api/ask', async (req, res) => {
    const userQuestion = req.body.question;
    const botResponse = await getBotResponse(userQuestion);
    res.json({ response: botResponse });
});

// Função para obter a resposta do bot usando a API do GPT-3
async function getBotResponse(userQuestion) {
    const url = "https://api.openai.com/v1/engines/davinci-codex/completions";
    const apiKey = "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"; // Substitua pelo sua chave de API
    const prompt = `Usuário: ${userQuestion}\nBot:`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                prompt,
                max_tokens: 150,
                temperature: 0.7,
                stop: "\n"
            })
        });

        if (!response.ok) {
            throw new Error("Erro ao consultar a API do GPT-3.");
        }

        const data = await response.json();
        return data.choices[0].text.trim();
    } catch (error) {
        console.error(error);
        return "Desculpe, ocorreu um erro ao processar sua pergunta.";
    }
}

// Iniciar o servidor na porta especificada
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
