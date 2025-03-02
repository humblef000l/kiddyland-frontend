import { ISize, IVariants } from '@/types/styleTypes';
import clsx from 'clsx';
import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: Omit<IVariants,'outlined'>;
  inputSize?: ISize;
  fullWidth?: boolean;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  variant = 'primary',
  inputSize = 'md',
  fullWidth = false,
  disabled = false,
  className,
  ...rest
}) => {
  return (
    <input
      className={clsx(
        'rounded-md',
        'border',
        'focus:outline-none',
        'duration-200',
        'ease-in-out',
        'placeholder-gray-400',
        {
          // Variants
          'bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary': variant === 'primary',
          'bg-secondary text-text-secondary border-secondary focus:ring-2 focus:ring-secondary focus:border-secondary': variant === 'secondary',
          'text-text-error border-error focus:ring-2 focus:ring-error focus:border-error placeholder-text-error': variant === 'error',

          // Sizes
          'px-3 py-1 text-sm': inputSize === 'sm',
          'px-4 py-2 text-base': inputSize === 'md',
          'px-5 py-3 text-lg': inputSize === 'lg',
          'px-5 py-3 text-xl': inputSize === 'xl',

          // Full width
          'w-full': fullWidth,

          // Disabled state
          'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400': disabled,
        },
        className
      )}
      disabled={disabled}
      aria-disabled={disabled}
      {...rest}
    />
  );
};

export default Input;
