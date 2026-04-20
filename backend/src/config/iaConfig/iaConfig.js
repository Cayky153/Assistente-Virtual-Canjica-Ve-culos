import { GoogleGenAI } from "@google/genai";
import { Type } from '@google/genai';
import {instrucoes} from './systemInstructions.js'
export const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
 const estoqueDeclaration = {
    name: 'estoque',
    description: 'Consulta o estoque completo de carros e motos na planilha.',
    parameters: {
        type: Type.OBJECT,
        properties: {},
        required: [],
    },
};

export const iaConfig ={
            temperature: 0.1,
            maxOutputTokens: 1500,
            systemInstruction: instrucoes,
            tools: [{
                functionDeclarations: [estoqueDeclaration]
            }]
        }
// Define a function that the model can call to control smart lights

