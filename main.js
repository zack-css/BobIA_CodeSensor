const express = require("express");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const PORTA_SERVIDOR = process.env.PORT || 3000;

const chatIA = new GoogleGenerativeAI(process.env.MINHA_CHAVE);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
});

app.post("/perguntar", async (req, res) => {
    const pergunta = req.body.pergunta;
    console.log("Recebida a pergunta: ", pergunta);

    try {
        const resultado = await gerarResposta(pergunta);
        res.json({ resultado });
    } catch (error) {
        console.error("Erro ao gerar resposta:", error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

async function gerarResposta(mensagem) {
    try {
        const modeloIA = chatIA.getGenerativeModel({ model: "gemini-pro" });
        console.log("Modelo de IA obtido:", modeloIA);

        const resultado = await modeloIA.generateContent(`Em um parágrafo responda: ${mensagem}`);
        console.log("Resultado da geração de conteúdo:", resultado);

        const resposta = await resultado.response.text();
        console.log("Resposta gerada:", resposta);

        return resposta;
    } catch (error) {
        console.error("Erro ao chamar a API de IA:", error);
        throw error;
    }
}

app.listen(PORTA_SERVIDOR, () => {
    console.info(`
        ######                ###    #    
        #     #  ####  #####   #    # #   
        #     # #    # #    #  #   #   #  
        ######  #    # #####   #  #     # 
        #     # #    # #    #  #  ####### 
        #     # #    # #    #  #  #     # 
        ######   ####  #####  ### #     # 
    `);
    console.info(`A API BobIA iniciada, acesse http://localhost:${PORTA_SERVIDOR}`);
});
