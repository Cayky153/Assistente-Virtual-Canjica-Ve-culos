import { gerarResposta } from '../services/iaService.js';

export async function promptController(req, res) {
    try {
        if (!req.body)
            return res.status(400).json({ message: "Req.body vazio" });

        const { conversationId, prompt } = req.body;

        if (!conversationId)
            return res.status(400).json({ message: "conversationId obrigatório" });

        if (typeof prompt !== 'string')
            return res.status(400).json({ message: "Prompt não é string" });

        if (!prompt.trim())
            return res.status(400).json({ message: "Prompt vazio" });

        if (prompt.length > 2000)
            return res.status(400).json({ message: "Prompt muito grande" });

        const response = await gerarResposta({
            conversationId,
            prompt
        });

        return res.json(response);

    } catch (err) {
        console.error("Erro no controller:", err);
        return res.status(500).json({ message: "Erro interno" });
    }
}