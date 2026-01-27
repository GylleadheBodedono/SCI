import { getSheetData } from "@/lib/googleSheets";
import { Users, DollarSign, AlertCircle, TrendingUp, TrendingDown, Calendar, BarChart2 } from "lucide-react";
import clsx from "clsx";
import DashboardCharts from "@/components/DashboardCharts";

// Helper to deduce brand from restaurant name
const getBrandFromName = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("burguer")) return "Burguer do Nô";
    if (n.includes("italiano")) return "Italiano Pizzas";
    if (n.includes("bode")) return "Bode do Nô";
    return "Outros";
};

async function getDashboardData() {
    try {
        const rawData = await getSheetData('Contestações iFood!A3:O');
        const contestacoes = rawData.map((row) => ({
            dataAbertura: row[1],
            valor: parseFloat(row[6]?.replace('R$', '').trim().replace(',', '.') || '0'),
            valorRecuperado: parseFloat(row[10]?.replace('R$', '').trim().replace(',', '.') || '0'),
            status: row[7] || 'AGUARDANDO',
            motivo: row[4] || 'Outros',
            restaurante: row[3] || 'Desconhecido',
        }));

        const total = contestacoes.length;
        const valorTotal = contestacoes.reduce((acc, curr) => acc + curr.valor, 0);
        const valorRecuperado = contestacoes.reduce((acc, curr) => acc + curr.valorRecuperado, 0);
        const valorPerdido = valorTotal - valorRecuperado;
        const recoveryRate = valorTotal > 0 ? (valorRecuperado / valorTotal) * 100 : 0;

        // Calculate Ticket Médio
        const ticketMedio = total > 0 ? valorTotal / total : 0;

        // Group by Brand
        const brands: Record<string, { qtd: number, valor: number, recuperado: number }> = {
            "Burguer do Nô": { qtd: 0, valor: 0, recuperado: 0 },
            "Italiano Pizzas": { qtd: 0, valor: 0, recuperado: 0 },
            "Bode do Nô": { qtd: 0, valor: 0, recuperado: 0 },
            "Outros": { qtd: 0, valor: 0, recuperado: 0 },
        };

        contestacoes.forEach(c => {
            const brand = getBrandFromName(c.restaurante);
            if (!brands[brand]) brands[brand] = { qtd: 0, valor: 0, recuperado: 0 };
            brands[brand].qtd++;
            brands[brand].valor += c.valor;
            brands[brand].recuperado += c.valorRecuperado;
        });

        // Top Restaurants (Top 10)
        const restaurantes: Record<string, { qtd: number, valor: number }> = {};
        const motivos: Record<string, { qtd: number, valor: number }> = {};

        contestacoes.forEach(c => {
            if (!restaurantes[c.restaurante]) restaurantes[c.restaurante] = { qtd: 0, valor: 0 };
            restaurantes[c.restaurante].qtd++;
            restaurantes[c.restaurante].valor += c.valor;

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

        return {
            total,
            valorTotal,
            valorRecuperado,
            valorPerdido,
            recoveryRate,
            ticketMedio,
            brands,
            topRestaurantes,
            topMotivos,
        };
    } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        return null;
    }
}

export default async function DashboardPage() {
    const data = await getDashboardData();

    if (!data) {
        return <div className="p-8 text-[var(--status-error-text)] bg-[var(--status-error-bg)] rounded-xl">Erro ao carregar dados do Dashboard. Verifique a conexão com a planilha.</div>;
    }

    return (
        <div className="space-y-8">
            {/* Top KPIs Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-[var(--primary)] text-[var(--primary-foreground)] p-4 md:p-6 rounded-xl shadow-lg relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] md:text-xs uppercase font-medium opacity-80 mb-1">Total Contestado</p>
                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-serif truncate">
                            R$ {data.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="w-16 md:w-24 h-16 md:h-24" />
                    </div>
                </div>

                <div className="bg-[var(--bg-surface)] p-4 md:p-6 rounded-xl shadow-sm border border-l-4 border-l-[var(--status-success-text)] border-[var(--border-subtle)]">
                    <p className="text-[10px] md:text-xs uppercase font-bold text-[var(--status-success-text)] mb-1">Recuperado</p>
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[var(--status-success-text)] font-serif truncate">
                        R$ {data.valorRecuperado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h3>
                </div>

                <div className="bg-[var(--bg-surface)] p-4 md:p-6 rounded-xl shadow-sm border border-l-4 border-l-[var(--status-error-text)] border-[var(--border-subtle)]">
                    <p className="text-[10px] md:text-xs uppercase font-bold text-[var(--status-error-text)] mb-1">Perdido</p>
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[var(--status-error-text)] font-serif truncate">
                        R$ {data.valorPerdido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h3>
                </div>

                <div className="bg-[var(--bg-surface)] p-4 md:p-6 rounded-xl shadow-sm border border-l-4 border-l-[var(--primary)] border-[var(--border-subtle)]">
                    <p className="text-[10px] md:text-xs uppercase font-bold text-[var(--text-main)] mb-1">Ticket Medio</p>
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[var(--text-main)] font-serif truncate">
                        R$ {data.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h3>
                </div>
            </div>

            {/* Strategic Projections Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-[var(--bg-surface)] p-4 md:p-6 rounded-xl shadow-sm border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2 mb-3 md:mb-4 text-[var(--text-secondary)]">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm font-bold uppercase">Perda Mensal</span>
                    </div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[var(--status-error-text)] font-serif truncate">
                        R$ {data.valorPerdido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h3>
                    <p className="text-[10px] md:text-xs text-[var(--text-muted)] mt-1">Valor acumulado no periodo</p>
                </div>

                <div className="bg-[var(--bg-surface)] p-4 md:p-6 rounded-xl shadow-sm border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2 mb-3 md:mb-4 text-[var(--text-secondary)]">
                        <BarChart2 className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm font-bold uppercase">Perda Anual (Proj.)</span>
                    </div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[var(--status-error-text)] font-serif truncate">
                        R$ {(data.valorPerdido * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h3>
                    <p className="text-[10px] md:text-xs text-[var(--text-muted)] mt-1">Estimativa linear baseada no total</p>
                </div>

                <div className="bg-[var(--bg-surface)] p-4 md:p-6 rounded-xl shadow-sm border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2 mb-3 md:mb-4 text-[var(--text-secondary)]">
                        <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm font-bold uppercase">Taxa de Sucesso</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--status-success-text)] font-serif">
                        {data.recoveryRate.toFixed(1)}%
                    </h3>
                    <p className="text-[10px] md:text-xs text-[var(--text-muted)] mt-1">Recuperacao sobre o total contestado</p>
                </div>
            </div>

            {/* Brand Performance Table */}
            <div className="bg-[var(--bg-surface)] rounded-xl shadow-sm border border-[var(--border-subtle)] overflow-hidden">
                <div className="p-4 bg-[var(--bg-page)] border-b border-[var(--border-subtle)] flex items-center gap-2">
                    <div className="p-1 bg-[var(--secondary)] rounded">
                        <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-bold text-[var(--text-main)]">Performance por Marca</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-[var(--bg-surface-hover)] p-2">
                        <tr>
                            <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase">Marca</th>
                            <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase text-right">Qtd</th>
                            <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase text-right">Valor</th>
                            <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase text-right">Recuperado</th>
                            <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase text-right">Taxa</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                        {Object.entries(data.brands).map(([brand, stats]) => {
                            if (stats.qtd === 0) return null;
                            const rate = stats.valor > 0 ? (stats.recuperado / stats.valor) * 100 : 0;
                            return (
                                <tr key={brand}>
                                    <td className="p-4 text-sm font-bold text-[var(--text-main)]">{brand}</td>
                                    <td className="p-4 text-sm text-[var(--text-secondary)] text-right">{stats.qtd}</td>
                                    <td className="p-4 text-sm text-[var(--text-secondary)] text-right">R$ {stats.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                    <td className="p-4 text-sm text-[var(--text-secondary)] text-right">R$ {stats.recuperado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                    <td className="p-4 text-sm font-bold text-[var(--text-main)] text-right">{rate.toFixed(1)}%</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Charts */}
            <DashboardCharts topRestaurantes={data.topRestaurantes || []} topMotivos={data.topMotivos || []} />
        </div>
    );
}
