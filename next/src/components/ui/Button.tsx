import React from 'react';

type Variant = 'primary' | 'secondary' | 'outline';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
};

const variantClasses: Record<Variant, string> = {
  primary: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-400',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-400',
  outline: 'bg-transparent border border-rose-600 text-rose-600 hover:bg-rose-50 active:bg-rose-100 focus:ring-rose-400',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  ...props
}) => (
  <button
    {...props}
    className={`
      rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${props.className ?? ''}
    `}
  >
    {children}
  </button>
);

export default Button;