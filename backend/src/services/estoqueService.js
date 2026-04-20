import { sheets, } from '../config/estoqueConfig.js'

let cache = null;
let ultimaAtualizacao = 0;

const TEMPO_CACHE = 60 * 1000;

export async function getEstoque() {
    try {
        const agora = Date.now();

        if (cache && (agora - ultimaAtualizacao) < TEMPO_CACHE) {
            return cache;
        }

        const carros = await sheets.spreadsheets.values.batchGet({
            spreadsheetId: process.env.SPREADSHEET_ID,
            ranges: ['Carros!A:Z'],
            valueRenderOption: 'UNFORMATTED_VALUE',
        });

        const motos = await sheets.spreadsheets.values.batchGet({
            spreadsheetId: process.env.SPREADSHEET_ID,
            ranges: ['Motos!A:Z'],
            valueRenderOption: 'UNFORMATTED_VALUE',
        });

        const estoqueCarros = [];
        const estoqueMotos = [];

        carros.data.valueRanges.forEach((valueRange) => {
            valueRange.values.slice(2).forEach((linhas) => {
                estoqueCarros.push({
                    marca: linhas[0],
                    modelo: linhas[1],
                    cambio: linhas[2],
                    ano: linhas[3],
                    valor: linhas[4],
                    cor: linhas[5],
                    status: linhas[6],
                    kilometragem: linhas[7]
                });
            });
        });

        motos.data.valueRanges.forEach((valueRange) => {
            valueRange.values.slice(2).forEach((linhas) => {
                estoqueMotos.push({
                    marca: linhas[0],
                    modelo: linhas[1],
                    cambio: linhas[2],
                    ano: linhas[3],
                    valor: linhas[4],
                    cor: linhas[5],
                    status: linhas[6],
                    kilometragem: linhas[7]
                });
            });
        });

        cache = {
            carros: estoqueCarros,
            motos: estoqueMotos
        };

        ultimaAtualizacao = agora;

        return cache;

    } catch (err) {
        console.error("Erro no estoque:", err);
        throw new Error("Erro ao buscar estoque");
    }
}