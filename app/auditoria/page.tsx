"use client";

import { ShieldCheck, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/Button";

export default function AuditoriaPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [auditResult, setAuditResult] = useState<any>(null);

    const handleAudit = async () => {
        if (!file) return;
        setIsProcessing(true);
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setAuditResult({
            totalPedidos: 1250,
            encontrados: 1238,
            divergencias: 12,
            valorDivergente: 450.50
        });
        setIsProcessing(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-[var(--text-main)] font-serif">Auditoria</h2>
                    <p className="text-[var(--text-secondary)] mt-2">Compare dados do Sistema vs Relatórios Oficiais</p>
                </div>
                {auditResult && (
                    <Button onClick={() => setAuditResult(null)} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Nova Auditoria
                    </Button>
                )}
            </div>

            {!auditResult ? (
                <div className="max-w-xl mx-auto space-y-6 mt-8">
                    <FileDropzone
                        onFileSelect={setFile}
                        label="Upload do Relatório Financeiro (iFood)"
                        subLabel="Arraste o arquivo CSV ou Excel para iniciar a auditoria"
                    />

                    {file && (
                        <Button
                            onClick={handleAudit}
                            className="w-full"
                            size="lg"
                            isLoading={isProcessing}
                            variant="primary"
                        >
                            <ShieldCheck className="w-5 h-5 mr-2" />
                            Iniciar Auditoria
                        </Button>
                    )}
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[var(--bg-surface)] p-6 rounded-2xl shadow-sm border border-[var(--border-subtle)]">
                            <h3 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide">Cobertura</h3>
                            <p className="text-3xl font-bold text-green-600 mt-2 font-serif">
                                {((auditResult.encontrados / auditResult.totalPedidos) * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">{auditResult.encontrados} de {auditResult.totalPedidos} pedidos</p>
                        </div>
                        <div className="bg-[var(--bg-surface)] p-6 rounded-2xl shadow-sm border border-[var(--border-subtle)]">
                            <h3 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide">Divergências</h3>
                            <p className="text-3xl font-bold text-[var(--status-error-text)] mt-2 font-serif">{auditResult.divergencias}</p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Pedidos não encontrados</p>
                        </div>
                        <div className="bg-[var(--bg-surface)] p-6 rounded-2xl shadow-sm border border-[var(--border-subtle)]">
                            <h3 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide">Impacto</h3>
                            <p className="text-3xl font-bold text-[var(--secondary)] mt-2 font-serif">R$ {auditResult.valorDivergente.toFixed(2)}</p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Valor total sob análise</p>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-surface)] rounded-2xl shadow-sm border border-[var(--border-subtle)] p-8 text-center text-[var(--text-muted)]">
                        <AlertTriangle className="w-12 h-12 mx-auto text-[var(--secondary)] mb-4" />
                        <h3 className="text-lg font-semibold text-[var(--text-main)]">Revisão Necessária</h3>
                        <p>Lista detalhada das divergências seria exibida aqui.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
