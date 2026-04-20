const historicoPorUsuario = {};

export function getHistorico(userId) {
    if (!historicoPorUsuario[userId]) {
        historicoPorUsuario[userId] = [];
    }
    return historicoPorUsuario[userId];
}
setInterval(() => {
    console.log("Limpando históricos...");
    for (const userId in historicoPorUsuario) {
        delete historicoPorUsuario[userId];
    }
}, 24 * 60 * 60 * 1000); // 24 horas