"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Loader2, Wrench, RefreshCw, Trash2, CheckCircle, AlertTriangle, ArrowRight, FileX } from "lucide-react";
import clsx from "clsx";

interface LinhaVazia {
    linha: number;
    conteudo: string;
}

interface NormalizarAnalise {
    total: number;
    aNormalizar: { linha: number; atual: string; normalizado: string }[];
    jaCorretos: number;
}

interface DuplicataRegistro {
    id: string;
    linha: number;
    restauranteOriginal: string;
    data: string;
    valor: string;
    valorRecuperado: string;
    status: string;
}

interface DuplicataGrupo {
    chave: string;
    numeroPedido: string;
    restaurante: string;
    registros: DuplicataRegistro[];
}

export default function ManutencaoPage() {
    // Normalização
    const [normalizarLoading, setNormalizarLoading] = useState(false);
    const [normalizarAnalise, setNormalizarAnalise] = useState<NormalizarAnalise | null>(null);
    const [normalizarExecutado, setNormalizarExecutado] = useState(false);

    // Duplicatas
    const [duplicatasLoading, setDuplicatasLoading] = useState(false);
    const [duplicatas, setDuplicatas] = useState<DuplicataGrupo[]>([]);
    const [selectedDuplicatas, setSelectedDuplicatas] = useState<Set<string>>(new Set());
    const [removendoDuplicatas, setRemovendoDuplicatas] = useState(false);

    // Linhas Vazias
    const [linhasVaziasLoading, setLinhasVaziasLoading] = useState(false);
    const [linhasVazias, setLinhasVazias] = useState<LinhaVazia[]>([]);
    const [removendoLinhasVazias, setRemovendoLinhasVazias] = useState(false);

    // ==================== NORMALIZAÇÃO ====================
    const analisarNormalizacao = async () => {
        setNormalizarLoading(true);
        setNormalizarAnalise(null);
        setNormalizarExecutado(false);
        
        try {
            const res = await fetch('/api/manutencao/normalizar');
            const json = await res.json();
            
            if (json.success) {
                setNormalizarAnalise(json.analise);
            } else {
                alert('Erro: ' + json.error);
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão');
        } finally {
            setNormalizarLoading(false);
        }
    };

    const executarNormalizacao = async () => {
        if (!confirm('Confirma a normalização de todos os nomes de restaurantes?')) return;
        
        setNormalizarLoading(true);
        
        try {
            const res = await fetch('/api/manutencao/normalizar', { method: 'POST' });
            const json = await res.json();
            
            if (json.success) {
                alert(json.message);
                setNormalizarExecutado(true);
                setNormalizarAnalise(null);
            } else {
                alert('Erro: ' + json.error);
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão');
        } finally {
            setNormalizarLoading(false);
        }
    };

    // ==================== LINHAS VAZIAS ====================
    const buscarLinhasVazias = async () => {
        setLinhasVaziasLoading(true);
        setLinhasVazias([]);
        
        try {
            const res = await fetch('/api/manutencao/linhas-vazias');
            const json = await res.json();
            
            if (json.success) {
                setLinhasVazias(json.detalhes || []);
                if (json.linhasVazias === 0) {
                    alert('Nenhuma linha vazia encontrada!');
                }
            } else {
                alert('Erro: ' + json.error);
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão');
        } finally {
            setLinhasVaziasLoading(false);
        }
    };

    const removerLinhasVazias = async () => {
        if (linhasVazias.length === 0) {
            alert('Nenhuma linha vazia para remover');
            return;
        }

        if (!confirm(`Confirma a remoção de ${linhasVazias.length} linha(s) vazia(s)?`)) return;

        setRemovendoLinhasVazias(true);
        
        try {
            const res = await fetch('/api/manutencao/linhas-vazias', { method: 'POST' });
            const json = await res.json();
            
            if (json.success) {
                alert(json.message);
                setLinhasVazias([]);
            } else {
                alert('Erro: ' + json.error);
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão');
        } finally {
            setRemovendoLinhasVazias(false);
        }
    };

    // ==================== DUPLICATAS ====================
    const buscarDuplicatas = async () => {
        setDuplicatasLoading(true);
        setDuplicatas([]);
        setSelectedDuplicatas(new Set());
        
        try {
            const res = await fetch('/api/manutencao/duplicatas');
            const json = await res.json();
            
            if (json.success) {
                setDuplicatas(json.duplicatas || []);
                if (json.duplicatas?.length === 0) {
                    alert('Nenhuma duplicata encontrada!');
                }
            } else {
                alert('Erro: ' + json.error);
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão');
        } finally {
            setDuplicatasLoading(false);
        }
    };

    // Usamos o número da linha como identificador único (mais confiável que ID)
    const toggleDuplicataSelection = (linha: number) => {
        setSelectedDuplicatas(prev => {
            const newSet = new Set(prev);
            const key = String(linha);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const selecionarDuplicatasAutomatico = () => {
        // Para cada grupo, seleciona todos EXCETO o primeiro (que geralmente é o mais antigo)
        const toSelect = new Set<string>();
        duplicatas.forEach(grupo => {
            // Mantém o primeiro, seleciona os demais para remoção
            grupo.registros.slice(1).forEach(reg => {
                toSelect.add(String(reg.linha));
            });
        });
        setSelectedDuplicatas(toSelect);
    };

    const removerDuplicatasSelecionadas = async () => {
        if (selectedDuplicatas.size === 0) {
            alert('Selecione as duplicatas que deseja remover');
            return;
        }

        if (!confirm(`Confirma a remoção de ${selectedDuplicatas.size} registro(s) duplicado(s)?`)) return;

        setRemovendoDuplicatas(true);
        
        try {
            // Enviar números de linha diretamente
            const linhas = Array.from(selectedDuplicatas).map(s => parseInt(s, 10));
            const res = await fetch('/api/manutencao/duplicatas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ linhasParaRemover: linhas }),
            });
            const json = await res.json();
            
            if (json.success) {
                alert(json.message);
                // Recarregar duplicatas
                buscarDuplicatas();
            } else {
                alert('Erro: ' + json.error);
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão');
        } finally {
            setRemovendoDuplicatas(false);
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex items-center gap-3 mb-6">
                <Wrench className="w-8 h-8 text-[var(--secondary)]" />
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-main)]">
                    Ferramentas de Manutenção
                </h1>
            </div>

            {/* Card: Normalização de Nomes */}
            <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
                <div className="p-4 md:p-6 border-b border-[var(--border-subtle)]">
                    <h2 className="text-lg font-semibold text-[var(--text-main)] flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-[var(--secondary)]" />
                        Normalizar Nomes de Restaurantes
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Padroniza os nomes dos restaurantes (ex: "Bode do Nô (Af)" → "Bode do Nô Afogados")
                    </p>
                </div>
                
                <div className="p-4 md:p-6 space-y-4">
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={analisarNormalizacao} disabled={normalizarLoading}>
                            {normalizarLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4 mr-2" />
                            )}
                            Analisar
                        </Button>
                        
                        {normalizarAnalise && normalizarAnalise.aNormalizar.length > 0 && (
                            <Button onClick={executarNormalizacao} variant="primary" disabled={normalizarLoading}>
                                {normalizarLoading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                )}
                                Normalizar {normalizarAnalise.aNormalizar.length} registro(s)
                            </Button>
                        )}
                    </div>

                    {normalizarExecutado && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                            <CheckCircle className="w-5 h-5" />
                            <span>Normalização concluída com sucesso!</span>
                        </div>
                    )}

                    {normalizarAnalise && (
                        <div className="space-y-3">
                            <div className="flex gap-4 text-sm">
                                <span className="text-[var(--text-muted)]">
                                    Total: <strong>{normalizarAnalise.total}</strong>
                                </span>
                                <span className="text-green-600">
                                    Corretos: <strong>{normalizarAnalise.jaCorretos}</strong>
                                </span>
                                <span className="text-amber-600">
                                    A normalizar: <strong>{normalizarAnalise.aNormalizar.length}</strong>
                                </span>
                            </div>

                            {normalizarAnalise.aNormalizar.length > 0 && (
                                <div className="max-h-64 overflow-y-auto border border-[var(--border-subtle)] rounded-lg">
                                    <table className="w-full text-sm">
                                        <thead className="bg-[var(--bg-page)] sticky top-0">
                                            <tr>
                                                <th className="p-2 text-left text-[var(--text-muted)]">Linha</th>
                                                <th className="p-2 text-left text-[var(--text-muted)]">Atual</th>
                                                <th className="p-2 text-center text-[var(--text-muted)]"></th>
                                                <th className="p-2 text-left text-[var(--text-muted)]">Normalizado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--border-subtle)]">
                                            {normalizarAnalise.aNormalizar.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-[var(--bg-surface-hover)]">
                                                    <td className="p-2 text-[var(--text-secondary)]">{item.linha}</td>
                                                    <td className="p-2 text-red-600">{item.atual}</td>
                                                    <td className="p-2 text-center">
                                                        <ArrowRight className="w-4 h-4 text-[var(--text-muted)] inline" />
                                                    </td>
                                                    <td className="p-2 text-green-600 font-medium">{item.normalizado}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Card: Linhas Vazias */}
            <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
                <div className="p-4 md:p-6 border-b border-[var(--border-subtle)]">
                    <h2 className="text-lg font-semibold text-[var(--text-main)] flex items-center gap-2">
                        <FileX className="w-5 h-5 text-red-500" />
                        Remover Linhas Vazias
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Remove linhas sem dados (sem ID, sem pedido, sem restaurante)
                    </p>
                </div>
                
                <div className="p-4 md:p-6 space-y-4">
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={buscarLinhasVazias} disabled={linhasVaziasLoading}>
                            {linhasVaziasLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4 mr-2" />
                            )}
                            Buscar Linhas Vazias
                        </Button>
                        
                        {linhasVazias.length > 0 && (
                            <Button 
                                onClick={removerLinhasVazias} 
                                variant="outline"
                                className="bg-red-500 text-white border-red-500 hover:bg-red-600"
                                disabled={removendoLinhasVazias}
                            >
                                {removendoLinhasVazias ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4 mr-2" />
                                )}
                                Remover {linhasVazias.length} linha(s) vazia(s)
                            </Button>
                        )}
                    </div>

                    {linhasVazias.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-sm text-red-600">
                                Encontradas {linhasVazias.length} linha(s) vazia(s)
                            </p>
                            
                            <div className="max-h-48 overflow-y-auto border border-[var(--border-subtle)] rounded-lg">
                                <table className="w-full text-sm">
                                    <thead className="bg-[var(--bg-page)] sticky top-0">
                                        <tr>
                                            <th className="p-2 text-left text-[var(--text-muted)]">Linha</th>
                                            <th className="p-2 text-left text-[var(--text-muted)]">Conteúdo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-subtle)]">
                                        {linhasVazias.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-[var(--bg-surface-hover)]">
                                                <td className="p-2 text-[var(--text-secondary)] font-mono">{item.linha}</td>
                                                <td className="p-2 text-[var(--text-muted)] text-xs truncate max-w-xs">
                                                    {item.conteudo || '(vazio)'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Card: Duplicatas */}
            <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
                <div className="p-4 md:p-6 border-b border-[var(--border-subtle)]">
                    <h2 className="text-lg font-semibold text-[var(--text-main)] flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Detectar e Remover Duplicatas
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Encontra pedidos duplicados (mesmo número + mesmo restaurante)
                    </p>
                </div>
                
                <div className="p-4 md:p-6 space-y-4">
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={buscarDuplicatas} disabled={duplicatasLoading}>
                            {duplicatasLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4 mr-2" />
                            )}
                            Buscar Duplicatas
                        </Button>
                        
                        {duplicatas.length > 0 && (
                            <>
                                <Button onClick={selecionarDuplicatasAutomatico} variant="outline">
                                    Selecionar automaticamente
                                </Button>
                                
                                {selectedDuplicatas.size > 0 && (
                                    <Button 
                                        onClick={removerDuplicatasSelecionadas} 
                                        variant="outline"
                                        className="bg-red-500 text-white border-red-500 hover:bg-red-600"
                                        disabled={removendoDuplicatas}
                                    >
                                        {removendoDuplicatas ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4 mr-2" />
                                        )}
                                        Remover {selectedDuplicatas.size} selecionado(s)
                                    </Button>
                                )}
                            </>
                        )}
                    </div>

                    {duplicatas.length > 0 && (
                        <div className="space-y-4">
                            <p className="text-sm text-amber-600">
                                Encontrados {duplicatas.length} grupo(s) com duplicatas
                            </p>

                            {duplicatas.map((grupo, gIdx) => (
                                <div key={gIdx} className="border border-[var(--border-subtle)] rounded-lg overflow-hidden">
                                    <div className="bg-[var(--bg-page)] p-3 flex items-center justify-between">
                                        <div>
                                            <span className="font-semibold text-[var(--text-main)]">
                                                Pedido #{grupo.numeroPedido}
                                            </span>
                                            <span className="text-[var(--text-muted)] ml-2">
                                                - {grupo.restaurante}
                                            </span>
                                        </div>
                                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                            {grupo.registros.length} registros
                                        </span>
                                    </div>
                                    
                                    <div className="divide-y divide-[var(--border-subtle)]">
                                        {grupo.registros.map((reg, rIdx) => (
                                            <div 
                                                key={reg.linha}
                                                className={clsx(
                                                    "p-3 flex items-center gap-3 cursor-pointer hover:bg-[var(--bg-surface-hover)]",
                                                    selectedDuplicatas.has(String(reg.linha)) && "bg-red-50",
                                                    rIdx === 0 && "bg-green-50"
                                                )}
                                                onClick={() => toggleDuplicataSelection(reg.linha)}
                                            >
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedDuplicatas.has(String(reg.linha))}
                                                    onChange={() => {}}
                                                    className="w-4 h-4"
                                                />
                                                <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-[var(--text-muted)]">ID:</span>{' '}
                                                        <span className="font-medium">{reg.id}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[var(--text-muted)]">Data:</span>{' '}
                                                        <span>{reg.data}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[var(--text-muted)]">Valor:</span>{' '}
                                                        <span>{reg.valor}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[var(--text-muted)]">Recuperado:</span>{' '}
                                                        <span className="text-green-600">{reg.valorRecuperado || '-'}</span>
                                                    </div>
                                                    <div>
                                                        <span className={clsx(
                                                            "px-2 py-0.5 rounded text-xs font-medium",
                                                            reg.status === 'FINALIZADO' && "bg-green-100 text-green-700",
                                                            reg.status === 'AGUARDANDO' && "bg-blue-100 text-blue-700"
                                                        )}>
                                                            {reg.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                {rIdx === 0 && (
                                                    <span className="text-xs text-green-600 font-medium">
                                                        (manter)
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
