export async function processarMensagem({ from, message, type }) {
    try {
        if (type && type !== "text") {
            await enviarMensagem(from, "No momento, consigo responder apenas mensagens de texto...");
            return;
        }
        if (!message) return;

        const respostaIA = await gerarResposta(from, message);
        await enviarMensagem(from, respostaIA);
    } catch (err) {
        console.error("Erro no processamento assíncrono:", err);
    }
}