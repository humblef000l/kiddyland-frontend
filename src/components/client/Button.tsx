import { ISize, IVariants } from '@/types/styleTypes';
import clsx from 'clsx';
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode,
    variant?: IVariants
    size?: ISize
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
                "rounded-[50]",
                "px-4",
                "py-2",
                "focus:outline-none",
                "duration-200",
                "ease-in-out",
                {
                    // variants
                    "bg-primary text-text-primary": variant === "primary",
                    "bg-secondary text-text-secondary": variant === "secondary",
                    "bg-white text-primary border border-primary": variant === "outline",
                    "bg-error text-text-error": variant === "error",

                    // sizes
                    "px-3 py-1 text-sm": size === "sm",
                    "px-4 py-2 text-md": size === "md",
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