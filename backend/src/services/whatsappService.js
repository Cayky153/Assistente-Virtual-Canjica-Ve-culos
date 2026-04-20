import {url,options} from '../config/whatsappConfig.js'

export async function enviarMensagem(to, text) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log("Mensagem enviada:", data);
    } catch (error) {
        console.error("Erro envio WhatsApp:", error);
    }
}