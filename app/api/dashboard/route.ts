import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';
import { normalizarNomeRestaurante } from '@/utils/mappings';

export async function GET() {
    try {
        const rawData = await getSheetData('Contestações iFood!A3:O');

        // Process data for dashboard
        const contestacoes = rawData.map((row) => ({
            valor: parseFloat(row[6]?.replace('R$', '').trim().replace(',', '.') || '0'),
            valorRecuperado: parseFloat(row[10]?.replace('R$', '').trim().replace(',', '.') || '0'),
            status: row[7] || 'AGUARDANDO',
            motivo: row[4] || 'Outros',
            restaurante: normalizarNomeRestaurante(row[3] || 'Desconhecido'),
        }));

        const total = contestacoes.length;
        const valorTotal = contestacoes.reduce((acc, curr) => acc + curr.valor, 0);
        const valorRecuperado = contestacoes.reduce((acc, curr) => acc + curr.valorRecuperado, 0);
        const valorPerdido = valorTotal - valorRecuperado;
        const recoveryRate = valorTotal > 0 ? (valorRecuperado / valorTotal) * 100 : 0;

        // Top Restaurants
        const restaurantes: Record<string, { qtd: number, valor: number }> = {};
        const motivos: Record<string, { qtd: number, valor: number }> = {};

        contestacoes.forEach(c => {
            // Restaurants
            if (!restaurantes[c.restaurante]) restaurantes[c.restaurante] = { qtd: 0, valor: 0 };
            restaurantes[c.restaurante].qtd++;
            restaurantes[c.restaurante].valor += c.valor;

            // Reasons
            if (!motivos[c.motivo]) motivos[c.motivo] = { qtd: 0, valor: 0 };
            motivos[c.motivo].qtd++;
            motivos[c.motivo].valor += c.valor;
        });

        const topRestaurantes = Object.entries(restaurantes)
            .map(([nome, data]) => ({ nome, ...data }))
            .sort((a, b) => b.qtd - a.qtd)
            .slice(0, 5);

        const topMotivos = Object.entries(motivos)
            .map(([nome, data]) => ({ nome, ...data }))
            .sort((a, b) => b.qtd - a.qtd)
            .slice(0, 5);

        return NextResponse.json({
            success: true,
            data: {
                total,
                valorTotal,
                valorRecuperado,
                valorPerdido,
                recoveryRate,
                topRestaurantes,
                topMotivos
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
