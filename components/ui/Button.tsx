import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--secondary) disabled:opacity-50 disabled:cursor-not-allowed",
                    {
                        // Primary (Brown)
                        "bg-(--primary) text-(--primary-foreground) hover:opacity-90 shadow-md shadow-black/5": variant === "primary",

                        // Secondary (Gold/Sand)
                        "bg-(--secondary) text-(--primary) hover:opacity-90": variant === "secondary",

                        // Outline
                        "border border-(--border-strong) bg-transparent hover:bg-[var(--bg-surface-hover)] text-[var(--text-main)]": variant === "outline",

                        // Ghost
                        "bg-transparent hover:bg-[var(--bg-surface-hover)] text-(--text-secondary)": variant === "ghost",

                        // Danger
                        "bg-red-50 text-red-700 hover:bg-red-100": variant === "danger",

                        "px-4 py-2 text-sm": size === "sm",
                        "px-6 py-3 text-base": size === "md",
                        "px-8 py-4 text-lg": size === "lg",
                    },
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
