export const url = 'https://graph.facebook.com/v19.0/1028050930402437/messages';

export const options = {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
            body: text
        }
    })
};