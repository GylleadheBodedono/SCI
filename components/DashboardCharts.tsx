"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useState, useEffect } from 'react';

interface DashboardChartsProps {
    topRestaurantes: { nome: string; qtd: number; valor: number }[];
    topMotivos: { nome: string; qtd: number; valor: number }[];
}

// Brand Palette: Elegant Steakhouse (Coffee, Gold, Cocoa, Taupe, Beige)
const COLORS = [
    '#4A3728', // Deep Coffee (Primary)
    '#C5A572', // Muted Gold (Secondary)
    '#8D6E63', // Cocoa
    '#D7CCC8', // Beige
    '#A1887F'  // Taupe
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--bg-surface)] p-3 border border-[var(--border-subtle)] rounded-xl shadow-lg">
                <p className="font-bold text-[var(--text-main)] mb-1">{label}</p>
                <p className="text-sm text-[var(--text-secondary)]">
                    Quantidade: <span className="font-semibold text-[var(--secondary)]">{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function DashboardCharts({ topRestaurantes, topMotivos }: DashboardChartsProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[var(--bg-surface)] p-6 rounded-2xl shadow-sm border border-[var(--border-subtle)] min-h-[400px] animate-pulse flex items-center justify-center text-[var(--text-muted)]">
                    Carregando gráficos...
                </div>
                <div className="bg-[var(--bg-surface)] p-6 rounded-2xl shadow-sm border border-[var(--border-subtle)] min-h-[400px] animate-pulse flex items-center justify-center text-[var(--text-muted)]">
                    Carregando gráficos...
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Restaurants Bar Chart */}
            <div className="bg-[var(--bg-surface)] p-6 rounded-2xl shadow-sm border border-[var(--border-subtle)] min-h-[400px]">
                <h3 className="text-lg font-bold text-[var(--text-main)] mb-6 font-serif">Top Restaurantes (Qtd)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topRestaurantes} layout="vertical" margin={{ left: 10, right: 30 }}>
                            <XAxis type="number" stroke="#A89F91" fontSize={12} hide />
                            <YAxis
                                dataKey="nome"
                                type="category"
                                width={140}
                                stroke="#A89F91"
                                fontSize={12}
                                fontWeight="bold"
                                interval={0}
                                tick={{ fill: '#A89F91' }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="qtd" radius={[0, 4, 4, 0]} barSize={20}>
                                {topRestaurantes.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                <LabelList dataKey="qtd" position="right" fill="#A89F91" fontSize={12} fontWeight="bold" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Reasons Bar Chart */}
            <div className="bg-[var(--bg-surface)] p-6 rounded-2xl shadow-sm border border-[var(--border-subtle)] min-h-[400px]">
                <h3 className="text-lg font-bold text-[var(--text-main)] mb-6 font-serif">Top Motivos</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topMotivos} layout="vertical" margin={{ left: 10, right: 30 }}>
                            <XAxis type="number" stroke="#A89F91" fontSize={12} hide />
                            <YAxis
                                dataKey="nome"
                                type="category"
                                width={140}
                                stroke="#A89F91"
                                fontSize={12}
                                fontWeight="bold"
                                interval={0}
                                tick={{ fill: '#A89F91' }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="qtd" radius={[0, 4, 4, 0]} barSize={20}>
                                {topMotivos.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                <LabelList dataKey="qtd" position="right" fill="#A89F91" fontSize={14} fontWeight="bold" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
