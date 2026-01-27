"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[var(--bg-page)] text-[var(--text-main)] font-sans antialiased overflow-hidden transition-colors duration-300">
            {/* Sidebar (Desktop & Mobile Drawer) */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Header */}
                <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto p-4 md:p-8 scroll-smooth">
                    {children}
                </div>
            </main>
        </div>
    );
}
