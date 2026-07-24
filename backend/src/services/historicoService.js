const historicoPorUsuario = {};
const ultimaAtividade = {};

export function getHistorico(userId) {
    if (!historicoPorUsuario[userId]) {
        historicoPorUsuario[userId] = [];
    }
    ultimaAtividade[userId] = Date.now();
    return historicoPorUsuario[userId];
}
setInterval(() => {
    const agora = Date.now();
    const LIMITE = 24 * 60 * 60 * 1000;
   if (agora - ultimaAtividade[userId] > LIMITE) {
            delete historicoPorUsuario[userId];
            delete ultimaAtividade[userId];
        }
}, 60 * 60 * 1000); // 24 horas