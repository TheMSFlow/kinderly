"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const baseStyles =
  'flex flex-row py-2 px-4 justify-center items-center rounded-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-b-border focus-visible:ring-offset-2 text-sm lg:text-base ';

const variants = {
  primary: 'bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover gap-2',
  secondary: 'bg-transparent border border-btn-secondary-border hover:bg-btn-secondary-hover text-btn-secondary-text',
  tertiary: 'bg-transparent border border-btn-tertiary-border hover:bg-btn-tertiary-hover text-btn-tertiary-text',
  warning: 'bg-transparent border border-btn-warning-border hover:bg-btn-warning-hover text-btn-warning-text',
  underline: 'bg-transparent text-btn-ghost hover:text-btn-ghost-hover underline',
  ghost: 'bg-transparent text-btn-ghost hover:text-btn-ghost-hover',
  wide: 'bg-btn-wide hover:bg-btn-wide-hover text-white w-full',
  event: 'bg-slate-800 text-white hover:bg-slate-900 gap-2',
};

const Button = ({
  children,
  className,
  onClick,
  disabled = false,
  type = 'button',
  variant = 'primary',
  iconLeft: IconLeft,
  iconRight: IconRight,
  to,
}) => {
  const router = useRouter();

  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);
    if (to) router.push(to);
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {IconLeft && <IconLeft className="w-4 h-4 text-current" />}
      {children}
      {IconRight && <IconRight className="w-4 h-4 text-current" />}
    </button>
  );
};

export default Button;
