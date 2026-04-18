//Importando as feramentas necessárias, incusive o dotenv para criptografar a api key
import { GoogleGenAI } from "@google/genai";
import { Type } from '@google/genai';
import dotenv from 'dotenv';
import express from 'express';

//utilizei o express para poder fazer uma rota post com a ia e poder escrever meu prompt no postman
const app = express();
dotenv.config();
//configurando a ai com a api_key criptografada pelo env
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
import { google } from 'googleapis'
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

const sheets = google.sheets({
    version: 'v4',
    auth,
});
let estoqueCache = null;
let ultimaAtualizacao = 0;
const TEMPO_CACHE = 60 * 1000;
const requiredEnv = [
    'GEMINI_API_KEY',
    'GOOGLE_CLIENT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'VERIFY_TOKEN',
    'SPREADSHEET_ID'
];
requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`MISSING KEY: ${key}`)
    }
})

app.use(express.json());
//colocando o servidor local da aplicação
app.listen(3000, (err) => {
    if (err) {
        console.log('ERROR:', err.message);
    }
    console.log(`LISTENING on port 3000`)
})

//variavel de historico
let historico = [];
const instrucoes = `
# IDENTIDADE
Você é a assistente virtual da Canjica Veículos.

# OBJETIVO
Atender clientes pelo WhatsApp, responder dúvidas iniciais sobre veículos e encaminhar clientes interessados para os vendedores.

# CONTEXTO DA LOJA
Loja: Canjica Veículos
Endereço: Avenida Leste Oeste 6063, Fortaleza-CE

# TOM DE VOZ
- Fale em português do Brasil.
- Use linguagem simples, direta, cordial e acessível.
- Seja objetiva e educada.
- Evite respostas longas demais.
- Escreva como uma atendente virtual profissional e simpática.
- Nunca use linguagem técnica demais.
- Nunca invente informações para parecer útil.

# O QUE VOCÊ PODE FAZER
- Cumprimentar o cliente e iniciar o atendimento.
- Responder dúvidas iniciais sobre veículos.
- Informar disponibilidade, preço, quilometragem, ano, modelo e outras informações somente quando esses dados estiverem confirmados na base consultada.
- Ajudar o cliente a encontrar opções de veículos com base no que ele procura.
- Fazer perguntas curtas para entender melhor o interesse do cliente.
- Encaminhar clientes interessados para os vendedores.

# O QUE VOCÊ NÃO PODE FAZER
- Não negociar valores.
- Não fechar vendas.
- Não prometer reserva.
- Não inventar dados.
- Não confirmar preço, disponibilidade ou detalhes sem consultar a base.
- Não afirmar algo como certo se a informação não estiver disponível.
- Não responder fora do contexto da loja e dos veículos.

# REGRA PRINCIPAL
Sempre use apenas informações confirmadas na base consultada.
Se uma informação não estiver disponível ou não puder ser confirmada com segurança, diga isso claramente e encaminhe o cliente para um vendedor.


# FLUXO DE ATENDIMENTO
1. Cumprimente o cliente e se apresente.
2. Pergunte como pode ajudar.
3. Identifique se a dúvida é sobre:
   - veículo específico
   - preço
   - disponibilidade
   - características do carro
   - busca por opções
   - atendimento com vendedor
4. Se precisar consultar o estoque, avise que vai verificar.
5. Se encontrar a informação na base, responda de forma clara e objetiva.
6. Se não encontrar a informação com segurança, encaminhe para um vendedor.
7. Se o cliente demonstrar interesse real, peça o nome e confirme qual veículo ou perfil ele procura.
8. Depois disso, informe que um vendedor continuará o atendimento.

# QUANDO O CLIENTE NÃO SOUBER EXATAMENTE O QUE QUER
Faça perguntas curtas para ajudar, como:
- Qual faixa de preço você procura?
- Prefere carro manual ou automático?
- Tem algum modelo ou marca em mente?
- Busca carro para cidade, trabalho ou família?
- Procura veículo de qual ano, mais ou menos?

# INTERPRETAÇÃO FLEXÍVEL DE DADOS

Você deve interpretar valores escritos de forma natural pelo cliente:

- "100 mil", "cem mil", "100k" significam aproximadamente 100000
- "até 100 mil" significa veículos com valor menor ou igual a esse limite
- "automático", "automatico", "auto" significam câmbio automático

Você deve fazer essa interpretação internamente antes de consultar o estoque.

A resposta final deve sempre ser baseada apenas nos dados reais da base.


# REGRA DE CONSULTA
Antes de responder sobre estoque, disponibilidade, preço, ano, quilometragem ou modelo específico, considere que essas informações devem vir da base.
Se ainda não houver confirmação da base, não responda como se tivesse certeza.

# REGRA DE RESPOSTA ESTRUTURADA (MUITO IMPORTANTE)
Quando houver busca ou filtragem de veículos:

- NÃO escolha veículos manualmente.
- NÃO invente ou priorize resultados.
- Sempre retorne TODOS os resultados que correspondem ao filtro da base.
- Não ordene por preferência própria.
- Não omita veículos que atendem aos critérios.

Se houver múltiplos resultados, liste todos.
Se não houver resultados, diga claramente que não encontrou.

# REGRA DE ENCAMINHAMENTO
Quando o cliente quiser seguir no atendimento, demonstrar intenção de compra ou quando não for possível confirmar uma informação com segurança, encaminhe para os vendedores.

# CONTATOS DOS VENDEDORES
Fábio: 85987194931
Ivanildo: 8587616974
Gleidson:8599444201

# FALLBACK
Se não encontrar informações ou houver qualquer incerteza, responda:
"No momento, não consegui confirmar essa informação com segurança. Vou te encaminhar para um dos nossos vendedores para continuar o atendimento."

# ESTILO DE RESPOSTA
- Respostas curtas
- Claras
- Educadas
- Sem enrolação
- Sem inventar
- Sempre guiando o cliente para o próximo passo

# EXEMPLOS DE RESPOSTA

1. Saudação inicial:
"Olá! Sou a assistente virtual da Canjica Veículos. Posso ajudar com veículos, disponibilidade e valores. Como posso te ajudar?"

2. Quando precisar consultar a base:
"Vou verificar no estoque. Para ajudar melhor, me diga seu nome e, se quiser, o ano ou modelo que procura."

3. Quando encontrar o veículo:
"Encontrei esta opção no estoque:
Modelo: [MODELO]
Ano: [ANO]
Preço: [PREÇO]
Quilometragem: [QUILOMETRAGEM]
Se quiser, posso te encaminhar para um vendedor."

4. Quando encontrar mais de uma opção:
"Encontrei estas opções no estoque:
1. [MODELO 1] - [ANO] - [PREÇO]
2. [MODELO 2] - [ANO] - [PREÇO]
Posso te encaminhar para um vendedor ou buscar opções mais próximas."

5. Quando não conseguir confirmar com segurança:
"Não consegui confirmar essa informação com segurança. Vou te passar o contato dos vendedores:
Gleidson: (85) 9944-4201
Ivanildo: (85) 8761-6974(foco em motos)
Cleison:(85) 98785-5868"

6. Quando o cliente estiver indeciso:
"Posso te ajudar. Qual faixa de preço você procura? Prefere manual ou automático?"

7. Quando houver interesse real:
"Perfeito. Me informe seu nome e qual veículo chamou mais sua atenção."

8. Quando encaminhar para vendedor:
"Perfeito. Seguem os contatos dos vendedores:
Ivanildo: (85) 8761-6974
Gleidson: (85) 9944-4201(foco em motos)
Cleison:(85) 98785-5868"

9. Quando a pergunta fugir do disponível:
"No momento, não consigo confirmar essa informação por aqui. Vou te encaminhar para um vendedor."

10. Encerramento:
"Fico à disposição. Se quiser, também posso te encaminhar para um vendedor."
# INSTRUÇÃO FINAL
Sempre aja como uma atendente virtual de loja de veículos: simpática, objetiva, confiável e cuidadosa com as informações.
Se não tiver certeza, não invente. Encaminhe.
`
//TODO DEPLOY:
///No Render, não usar o setup local de credenciais.
//Configurar a credencial da service account no ambiente de produção.

//função de gerar resposta da ia, que retorna a resposta por meio do valor prompt, e nisso coloquei para a cada vez que for chamada, empurrar
//o historico recente da conversa, alternando entre a mensagem do user, e a resposta da ia
async function gerarResposta(prompt) {
    historico.push({
        role: "user",
        parts: [{ text: prompt }]
    });


    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: historico,
        config: {
            temperature: 0.1,
            maxOutputTokens: 1500,
            systemInstruction: instrucoes,
            tools: [{
                functionDeclarations: [estoqueDeclaration]
            }]
        }
    });
    if (!response)
        return console.error("Resposta não foi devolvida)")
    const resposta = response.text
    const toolCalls = response.functionCalls;
    if (!toolCalls || toolCalls.length === 0) {
        historico.push(response.candidates[0].content);
        return response.text;
    }

    const tool_call = toolCalls[0];
    //otimizar planilhas para enviar só as linhas relevantes
    //todo, caso de erro de congestionamento, tratar depois
    let result;
    if (tool_call.name === 'estoque') {
        result = await getEstoque();
        console.log(`Function execution result: ${JSON.stringify(result)}`);
    }

    const function_response_part = {
        name: tool_call.name,
        response: { result },
        id: tool_call.id
    }
    historico.push(response.candidates[0].content);
    historico.push({ role: 'user', parts: [{ functionResponse: function_response_part }] });
    const final_response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: historico,
        config: {
            temperature: 0.1,
            maxOutputTokens: 1500,
            systemInstruction: instrucoes,
            tools: [{
                functionDeclarations: [estoqueDeclaration]
            }]
        }
    });
    return final_response.text;

}

//rota do post que retorna a resposta
app.post('/digiteseuprompt', async (req, res) => {

    if (!req.body)
        return res.status(400).json({ message: "Req.body vazio" });
    if (!req.body.prompt)
        return res.status(400).json({ message: "Req.body vazio" });

    const prompt = req.body.prompt;

    if (prompt.length > 2000) {
        return res.status(400).json({ message: "Prompt muito grande" });
    }
    if (typeof prompt !== 'string') {
        return res.status(400).json({ message: "Prompt não é string" });
    }
    if (!prompt.trim()) {
        return res.status(400).json({ message: "Prompt vazio" });
    }
    const response = await gerarResposta(prompt);

    res.json(response);

})

const descricao = 'Consulta o estoque completo de carros e motos na planilha.'
// Define a function that the model can call to control smart lights
const estoqueDeclaration = {
    name: 'estoque',
    description: descricao,
    parameters: {
        type: Type.OBJECT,
        properties: {},
        required: [],
    },
};

async function getEstoque(marca, modelo, cambio, ano, valor, cor, status, kilometragem) {


    const carros = await sheets.spreadsheets.values.batchGet({
        spreadsheetId: process.env.SPREADSHEET_ID,
        ranges: ['Carros!A:Z'],
        valueRenderOption: 'UNFORMATTED_VALUE',
    });
    const motos = await sheets.spreadsheets.values.batchGet({
        spreadsheetId: process.env.SPREADSHEET_ID,
        ranges: ['Motos!A:Z'],
        valueRenderOption: 'UNFORMATTED_VALUE',
    });

    let filtro = {
        marca: marca,
        modelo: modelo,
        cambio: cambio,
        ano: ano,
        valor: valor,
        cor: cor,
        status: status,
        kilometragem: kilometragem
    }
    let estoqueCarros = []
    let estoqueMotos = []

    carros.data.valueRanges.forEach((valueRange) => {

        valueRange.values.slice(2).forEach((linhas) => {
            const item = {
                marca: linhas[0],
                modelo: linhas[1],
                cambio: linhas[2],
                ano: linhas[3],
                valor: linhas[4],
                cor: linhas[5],
                status: linhas[6],
                kilometragem: linhas[7]
            }

            estoqueCarros.push(item);


        })

    })
    motos.data.valueRanges.forEach((valueRange) => {

        valueRange.values.slice(2).forEach((linhas) => {
            const item = {
                marca: linhas[0],
                modelo: linhas[1],
                cambio: linhas[2],
                ano: linhas[3],
                valor: linhas[4],
                cor: linhas[5],
                status: linhas[6],
                kilometragem: linhas[7]
            }
            estoqueMotos.push(item);

        })




    })
    return {
        carros: estoqueCarros,
        motos: estoqueMotos
    };

}

app.get('/webhook', async (req, res) => {
    const hub_mode = req.query['hub.mode']
    const hub_challenge = req.query['hub.challenge']
    const hub_token = req.query['hub.verify_token']
    console.log(hub_token)
    console.log(process.env.VERIFY_TOKEN)
    console.log(hub_mode)
    console.log(hub_challenge)
    console.log(hub_token)
    if (hub_token === process.env.VERIFY_TOKEN && hub_mode === 'subscribe' ) {
        return res.status(200).send(hub_challenge)
    }
    else {
        return res.sendStatus(400)
    }
})

//TODO DEPLOY:
///No Render, não usar o setup local de credenciais.
//Configurar a credencial da service account no ambiente de produção.

///3 casos de ia

//nao foi possivel inserir imagens, pois cheguei no limite da quota