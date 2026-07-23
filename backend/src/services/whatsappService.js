import { url, options } from '../config/whatsappConfig.js'

export async function enviarMensagem(to, text) {
    const body =JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
            body: text
        }
    })
    console.log("DEBUG url:", url);
    console.log("DEBUG options:", options);
    console.log("DEBUG body:", body);
    try {
        const response = await fetch(url,{options, body});
        const data = await response.json();
        console.log("Mensagem enviada:", data);
    } catch (error) {
        console.error("Erro envio WhatsApp:", error);
    }
}