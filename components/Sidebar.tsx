"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, FilePlus, Upload, BookCopy, ShieldCheck, Wrench, ExternalLink } from "lucide-react";
import clsx from "clsx";
import { ThemeToggle } from "./ThemeToggle";

const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Registrar / Buscar", href: "/contestacoes", icon: FilePlus },
    { name: "Importação", href: "/importacao", icon: Upload },
    { name: "Auditoria", href: "/auditoria", icon: ShieldCheck },
    { name: "Manutenção", href: "/manutencao", icon: Wrench },
];

// Link externo da planilha - usa variavel de ambiente
const PLANILHA_URL = process.env.NEXT_PUBLIC_PLANILHA_URL;


interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Função para verificar o tema atual
        const checkTheme = () => {
            const theme = localStorage.getItem("theme") ||
                         document.documentElement.getAttribute("data-theme");
            setIsDark(theme === "dark");
        };

        // Verificar tema inicial
        checkTheme();

        // Escutar mudanças no tema
        window.addEventListener("storage", checkTheme);
        window.addEventListener("theme-change", checkTheme);

        return () => {
            window.removeEventListener("storage", checkTheme);
            window.removeEventListener("theme-change", checkTheme);
        };
    }, []);

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={clsx(
                    "bg-[var(--bg-surface)] flex flex-col h-full shadow-2xl border-r border-[var(--border-subtle)]",
                    "fixed md:static inset-y-0 left-0 z-40 w-72 transition-transform duration-300 ease-in-out md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-2 border-b border-[var(--border-subtle)] flex items-center">
                    <div className="flex items-center gap-3">
                        {isDark ? (
                            <Image src="/Logotipo.png" className="rounded-xl" alt="Banner" width={11200} height={100} />
                        ) : (
                            <Image src="/Logotipo2.png" className="rounded-xl" alt="Banner" width={11200} height={100} />
                        )}
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium text-sm",
                                    isActive
                                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg shadow-[var(--primary)]/20"
                                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-main)]"
                                )}
                            >
                                <Icon className={clsx("w-5 h-5", isActive ? "text-[var(--text-inverse)]" : "text-[var(--text-main)] group-hover:text-[var(--primary)]")} />
                                {item.name}
                            </Link>
                        );
                    })}
                    
                    {/* Link externo para a planilha */}
                    {PLANILHA_URL && (
                        <a
                            href={PLANILHA_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClose}
                            className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-main)]"
                        >
                            <BookCopy className="w-5 h-5 text-[var(--text-main)] group-hover:text-[var(--primary)]" />
                            Ver Planilha
                            <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                        </a>
                    )}
                </nav>

                <div className="p-6 border-t border-[var(--border-subtle)] space-y-4">
                    <div className="flex items-center justify-between p-3 bg-[var(--bg-page)] rounded-xl border border-[var(--border-subtle)]">
                        <span className="text-xs font-semibold text-[var(--text-secondary)]">Aparência</span>
                        <ThemeToggle />
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] justify-center opacity-60">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <span>SCI BDN v2.1.0</span>
                    </div>
                </div>
            </aside>
        </>
    );
}
