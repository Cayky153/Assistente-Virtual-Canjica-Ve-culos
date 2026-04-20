import { estoqueCache, ultimaAtualizacao, TEMPO_CACHE, sheets, } from '../config/estoqueConfig.js'

export async function getEstoque() {
    try {
        const agora = Date.now();

        if (estoqueCache && (agora - ultimaAtualizacao) < TEMPO_CACHE) {
            return estoqueCache;
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


        let estoqueCarros = []
        let estoqueMotos = []

        carros.data.valueRanges.forEach((valueRange) => {

            valueRange.values.slice(2).forEach((linhas) => {
                const item = {
                    marca: linhas[0],
                    modelo: linhas[1],
                    cambio: linhas[2],
                    ano: linhas[3],
                    valor: linhas[4],
                    cor: linhas[5],
                    status: linhas[6],
                    kilometragem: linhas[7]
                }

                estoqueCarros.push(item);


            })

        })
        motos.data.valueRanges.forEach((valueRange) => {

            valueRange.values.slice(2).forEach((linhas) => {
                const item = {
                    marca: linhas[0],
                    modelo: linhas[1],
                    cambio: linhas[2],
                    ano: linhas[3],
                    valor: linhas[4],
                    cor: linhas[5],
                    status: linhas[6],
                    kilometragem: linhas[7]
                }
                estoqueMotos.push(item);

            })




        })
        estoqueCache = {
            carros: estoqueCarros,
            motos: estoqueMotos
        };
        ultimaAtualizacao = agora;

        return estoqueCache;
    } catch (err) {
        console.err("Erro no estoque")
        return res.status(500).json({ message: "Erro interno" });
    }
}