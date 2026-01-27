"use client";

import { Upload, FileSpreadsheet } from "lucide-react";
import { useState, useRef } from "react";
import { clsx } from "clsx";

interface FileDropzoneProps {
    onFileSelect: (file: File) => void;
    label?: string;
    subLabel?: string;
}

export default function FileDropzone({ onFileSelect, label, subLabel }: FileDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    };

    return (
        <div
            className={clsx(
                "bg-[var(--bg-surface)] rounded-2xl shadow-sm border-2 p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer group w-full",
                isDragging ? "border-[var(--secondary)] bg-[var(--bg-page)]" : "border-[var(--border-subtle)] border-dashed hover:border-[var(--secondary)]"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
            />

            <div className="p-4 bg-[var(--bg-page)] rounded-full group-hover:bg-[var(--secondary)]/10 transition-colors mb-4">
                {selectedFile ? <FileSpreadsheet className="w-8 h-8 text-green-600" /> : <Upload className="w-8 h-8 text-[var(--text-muted)] group-hover:text-[var(--primary)]" />}
            </div>

            {selectedFile ? (
                <div>
                    <h3 className="text-lg font-semibold text-[var(--text-main)]">{selectedFile.name}</h3>
                    <p className="text-[var(--text-muted)] mt-1">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
            ) : (
                <div>
                    <h3 className="text-lg font-semibold text-[var(--text-main)] font-serif">{label || "Arraste e solte o arquivo Excel aqui"}</h3>
                    <p className="text-[var(--text-muted)] mt-1">{subLabel || "ou clique para selecionar"}</p>
                </div>
            )}
        </div>
    );
}
