import React from 'react';
import classNames from 'classnames';

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export const TextArea: React.FC<TextAreaProps> = ({ label, error, className, ...props }) => (
  <label className="block space-y-2">
    <span className="text-sm text-gray-300 uppercase tracking-wide">{label}</span>
    <textarea
      {...props}
      className={classNames(
        'w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500',
        error && 'border-pink-500 focus:ring-pink-500',
        className
      )}
    />
    {error && <span className="text-sm text-pink-400">{error}</span>}
  </label>
);
