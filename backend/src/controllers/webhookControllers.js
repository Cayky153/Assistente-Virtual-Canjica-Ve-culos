import { processedMessages } from '../services/messageTrackerService.js'
import { getHistorico } from '../services/historicoService.js'
import { gerarResposta } from '../services/iaService.js';
import { enviarMensagem } from '../services/whatsappService.js'

export async function webhookController(req, res) {
    try {
        const hub_mode = req.query['hub.mode']
        const hub_challenge = req.query['hub.challenge']
        const hub_token = req.query['hub.verify_token']
        console.log(hub_token)
        console.log(process.env.VERIFY_TOKEN)
        console.log(hub_mode)
        console.log(hub_challenge)
        console.log(hub_token)
        if (hub_token === process.env.VERIFY_TOKEN && hub_mode === 'subscribe') {
            return res.status(200).send(hub_challenge)
        }
        else {
            return res.sendStatus(400)
        }
    } catch (err) {
        console.error("Erro no controller:", err);
        return res.status(500).json({ message: "Erro interno" });
    }
}

export async function webhookControllerPost(req, res) {
    try {
        const entry = req.body.entry?.[0];
        const change = entry?.changes?.[0];
        const value = change?.value;

        const messageObj = value?.messages?.[0];
        const message = messageObj?.text?.body;
        const from = messageObj?.from;
        const type = messageObj?.type;
        const messageId = messageObj?.id;

        if (type && type !== "text") {
            await enviarMensagem(from,
                "No momento, consigo responder apenas mensagens de texto. \nPode me enviar sua dúvida por escrito que eu te ajudo!"
            );
            return res.sendStatus(200);
        }


        if (!message || !from || !messageId) {
            return res.sendStatus(200);
        }
        if (processedMessages.has(messageId)) {
            return res.sendStatus(200);
        }
        processedMessages.add(messageId);

        const respostaIA = await gerarResposta(from, message);

        await enviarMensagem(from, respostaIA);

        return res.sendStatus(200);

    } catch (err) {
        console.error("Webhook error:", err);
        return res.sendStatus(200);
    }
}