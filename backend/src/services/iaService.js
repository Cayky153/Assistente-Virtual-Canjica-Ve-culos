

import { getHistorico } from './historicoService.js'
import { getEstoque } from './estoqueService.js'
import {iaConfig} from '../config/iaConfig/iaConfig.js'
// Define a function that the model can call to control smart lights


export async function gerarResposta(prompt, userId) {
    const historico = getHistorico(userId)
    while (historico.length > 20) {
        historico.splice(0, 2);
    }
    historico.push({
        role: "user",
        parts: [{ text: prompt }]
    });



    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: historico,
        config: iaConfig
    });
    if (!response) {
        console.error("Resposta não foi devolvida");
        return;
    }
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
    else {
        result = "Tool não suportada";
    }
    historico.push(response.candidates[0].content);

       historico.push({
        role: 'user',
        parts: [{
            functionResponse: {
                name: tool_call.name,
                response: { result },
                id: tool_call.id
            }
        }]
    });
    const final_response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: historico,
        config: iaConfig  
    });

    historico.push(final_response.candidates[0].content);
    return final_response.text;
}
