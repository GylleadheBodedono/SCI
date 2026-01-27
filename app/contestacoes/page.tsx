"use client";

import { useState } from "react";
import { FilePlus, Search } from "lucide-react";
import clsx from "clsx";
import RegisterForm from "./RegisterForm";
import SearchTable from "./SearchTable";

export default function ContestacoesPage() {
    const [activeTab, setActiveTab] = useState<'register' | 'search'>('register');

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-[var(--text-main)] font-serif">Contestações</h2>
                    <p className="text-[var(--text-secondary)] mt-2">Gerencie e registre novas contestações</p>
                </div>
            </div>

            <div className="flex bg-[var(--bg-surface)] p-1 rounded-xl shadow-sm border border-[var(--border-subtle)] w-fit">
                <button
                    onClick={() => setActiveTab('register')}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300",
                        activeTab === 'register'
                            ? "bg-[var(--secondary)] text-[var(--primary)] shadow-md"
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-page)] hover:text-[var(--text-main)]"
                    )}
                >
                    <FilePlus className="w-4 h-4" />
                    Registrar
                </button>
                <button
                    onClick={() => setActiveTab('search')}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300",
                        activeTab === 'search'
                            ? "bg-[var(--secondary)] text-[var(--primary)] shadow-md"
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-page)] hover:text-[var(--text-main)]"
                    )}
                >
                    <Search className="w-4 h-4" />
                    Buscar
                </button>
            </div>

            <div className="transition-all duration-300">
                {activeTab === 'register' ? (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                        <RegisterForm />
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <SearchTable />
                    </div>
                )}
            </div>
        </div>
    );
}
