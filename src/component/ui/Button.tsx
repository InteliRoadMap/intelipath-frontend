import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'icon';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  const baseClasses = "transition-colors font-medium rounded-full flex items-center justify-center";
  
  const variants = {
    primary: "px-5 py-2 bg-[#1E50FF] text-white hover:bg-blue-700",
    outline: "px-5 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50",
    icon: "p-2 border border-gray-200 text-yellow-500 bg-yellow-50"
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
