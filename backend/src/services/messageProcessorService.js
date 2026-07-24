import { gerarResposta } from './iaService.js';
import { enviarMensagem } from './whatsappService.js'

export async function processarMensagem({ from, message, type }) {
    try {
        if (type && type !== "text") {
            await enviarMensagem(from, "No momento, consigo responder apenas mensagens de texto...");
            return;
        }
        if (!message) return;

        const respostaIA = await gerarResposta(message,from);
        await enviarMensagem(from, respostaIA);
    } catch (err) {
        console.error("Erro no processamento assíncrono:", err);
    }
}