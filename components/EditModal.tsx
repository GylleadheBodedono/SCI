"use client";

import { useState, useEffect } from "react";
import { X, Save, Loader2, Calendar, FileText, DollarSign, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import clsx from "clsx";

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    onSave: () => void;
}

export default function EditModal({ isOpen, onClose, data, onSave }: EditModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        status: 'AGUARDANDO',
        dataResolucao: '',
        resultado: '',
        valorRecuperado: '',
        observacoes: ''
    });

    // Atualiza formData quando data muda (quando abre modal com novo pedido)
    useEffect(() => {
        if (data) {
            setFormData({
                status: data.status || 'AGUARDANDO',
                dataResolucao: data.dataResolucao || '',
                resultado: data.resultado || '',
                valorRecuperado: data.valorRecuperado || '',
                observacoes: data.observacoes || ''
            });
        }
    }, [data]);

    if (!isOpen || !data) return null;

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/contestacoes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: data.id, 
                    rowIndex: data.rowIndex, // Enviar o índice da linha para garantir atualização correta
                    ...formData 
                }),
            });
            const json = await res.json();
            if (json.success) {
                alert('✅ Alterações salvas com sucesso!');
                onSave(); // Refresh table
                onClose();
            } else {
                alert('❌ Erro ao salvar: ' + json.error);
            }
        } catch (error) {
            alert('❌ Erro de conexão');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[var(--bg-surface)] w-full max-w-2xl rounded-2xl shadow-2xl border border-[var(--border-subtle)] max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)] sticky top-0 bg-[var(--bg-surface)] z-10">
                    <h2 className="text-xl font-bold text-[var(--text-main)] font-serif flex items-center gap-2">
                        ✏️ Editar Contestação
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-[var(--bg-surface-hover)] rounded-lg text-[var(--text-secondary)]">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Read-Only Info */}
                    <div className="space-y-4">
                        <div className="bg-[var(--bg-page)] p-4 rounded-xl border border-[var(--border-subtle)] space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">ID</label>
                                    <p className="font-mono text-sm font-semibold">{data.id}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Número do Pedido</label>
                                    <p className="font-medium">{data.numeroPedido}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Restaurante</label>
                                <p className="font-medium">{data.restaurante}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Motivo</label>
                                    <p className="text-sm">{data.motivo}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Valor Contestado</label>
                                    <p className="font-medium text-[var(--status-error-text)]">R$ {Number(data.valor).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Responsável</label>
                                    <p className="text-sm">{data.responsavel}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Motivo Específico</label>
                                    <p className="text-sm">{data.motivoEspecifico}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-[var(--border-subtle)] w-full" />

                    {/* Editable Fields */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Status"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="AGUARDANDO">Aguardando</option>
                                <option value="EM ANÁLISE">Em Análise</option>
                                <option value="FINALIZADO">Finalizado</option>
                                <option value="CANCELADO">Cancelado</option>
                            </Select>

                            <Input
                                label="Data Resolução"
                                type="date"
                                value={formData.dataResolucao} // Should handle format if needed, but standard date input expects YYYY-MM-DD
                                onChange={e => setFormData({ ...formData, dataResolucao: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide text-[11px]">Resultado</label>
                            <textarea
                                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:border-[var(--secondary)] focus:ring-4 focus:ring-[var(--secondary)]/10 transition-all outline-none resize-none h-24"
                                placeholder="Descreva o resultado da contestação..."
                                value={formData.resultado}
                                onChange={e => setFormData({ ...formData, resultado: e.target.value })}
                            />
                        </div>

                        <div>
                            <Input
                                label="Valor Recuperado (R$)"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.valorRecuperado}
                                onChange={e => setFormData({ ...formData, valorRecuperado: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide text-[11px]">Observações</label>
                            <textarea
                                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:border-[var(--secondary)] focus:ring-4 focus:ring-[var(--secondary)]/10 transition-all outline-none resize-none h-20"
                                placeholder="Observações adicionais..."
                                value={formData.observacoes}
                                onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
                            />
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] sticky bottom-0 flex justify-end gap-3 z-10">
                    <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleSave} isLoading={isLoading}>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                    </Button>
                </div>
            </div>
        </div>
    );
}
