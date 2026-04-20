
import { ai, iaConfig } from '../config/iaConfig/iaConfig.js'
import {getHistorico} from './historicoService.js'
import {getEstoque} from './estoqueService.js'

export async function gerarResposta(userId, prompt) {
    const historico = getHistorico(userId);
    historico.push({
        role: "user",
        parts: [{ text: prompt }]
    });
    if (historico.length > 20) {
        historico.splice(0, 10);
    }

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: historico,
        config: iaConfig
    });

    if (!response) {
        console.error("Resposta não foi devolvida");
        return;
    }

    const toolCalls = response.functionCalls;

    if (!toolCalls || toolCalls.length === 0) {
        historico.push(response.candidates[0].content);
        return response.text;
    }

    const tool_call = toolCalls[0];

    let result;

    if (tool_call.name === 'estoque') {
        result = await getEstoque();
    } else {
        result = "Tool não suportada";
    }

    const function_response_part = {
        name: tool_call.name,
        response: { result },
        id: tool_call.id
    };

    historico.push(response.candidates[0].content);
    historico.push({
        role: 'user',
        parts: [{ functionResponse: function_response_part }]
    });

    const final_response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: historico,
        config: iaConfig
    });

    return final_response.text;
}