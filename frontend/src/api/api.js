const API_URL = "https://assistente-virtual-canjica-ve-culos.onrender.com/digiteseuprompt";

export async function sendMessage(prompt, userId) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt, userId })
    });

    if (!res.ok) throw new Error("Erro na API");
    const data = await res.json();
    console.log("Resposta da API:", data);        
    console.log("data.reply:", data.reply);
    return data.reply;
}