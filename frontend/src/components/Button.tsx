import React from 'react';
import classNames from 'classnames';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, children, ...props }) => {
  const styles: Record<'primary' | 'secondary' | 'ghost', string> = {
    primary: 'bg-purple-500 hover:bg-purple-400 text-white',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-purple-200',
    ghost: 'bg-transparent hover:bg-slate-800 text-purple-200',
  };

  return (
    <button
      className={classNames(
        'px-4 py-3 rounded-lg font-semibold uppercase tracking-wide transition shadow-lg shadow-purple-500/20',
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
