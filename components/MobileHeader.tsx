"use client";

import { Menu, ChefHat } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image"

interface MobileHeaderProps {
    onMenuClick: () => void;
}


export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {

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
        <header className="md:hidden flex items-center justify-between p-4 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] sticky top-0 z-20">
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[var(--text-main)] tracking-wide font-serif">
                   {isDark ? (
                                               <Image src="/Logotipo.png" className="rounded-xl" alt="Banner" width={200} height={100} />
                                           ) : (
                                               <Image src="/Logotipo2.png" className="rounded-xl" alt="Banner" width={200} height={100} />
                                           )}
                </h1>         
            </div>
            <button
                onClick={onMenuClick}
                className="p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] rounded-lg transition-colors"
            >
                <Menu className="w-6 h-6" />
            </button>
        </header>
    );
}
