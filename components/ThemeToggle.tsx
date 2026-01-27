"use client";

import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        // Check if dark mode is active from the start
        if (savedTheme === "dark" || (!savedTheme && systemDark)) {
            setIsDark(true);
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            setIsDark(false);
            document.documentElement.setAttribute("data-theme", "light");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);

        if (newTheme) {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        }

        // Emitir evento customizado para notificar outros componentes
        window.dispatchEvent(new Event("theme-change"));
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--primary)] transition-all bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
            title={isDark ? "Mudar para Claro" : "Mudar para Escuro"}
        >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
    );
}
