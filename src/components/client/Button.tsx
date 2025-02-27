import clsx from 'clsx';
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode,
    variant?: "primary" | "secondary" | "outline" | "error";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;

}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    className,
    ...rest
}) => {
    return (
        <button
            className={clsx(
                "rounded-md",
                "px-4",
                "py-2",
                "font-semibold",
                "focus:outline-none",
                "duration-200",
                "ease-in-out",
                {
                    // variants
                    "bg-primary text-white": variant === "primary",
                    "bg-secondary text-white": variant === "secondary",
                    "bg-white text-primary border border-primary": variant === "outline",
                    "bg-error text-white": variant === "error",

                    // sizes
                    "px-3 py-1 text-sm": size === "sm",
                    "px-4 py-2 text-base": size === "md",
                    "px-6 py-3 text-lg": size === "lg",

                    // disabled state
                    "opacity-50 cursor-not-allowed": disabled,
                },
                className
            )}
            disabled={disabled}
            aria-disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    )
}

export default Button