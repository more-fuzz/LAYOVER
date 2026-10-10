'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { Icon, IconName } from './Icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'flame' | 'ink' | 'outline' | 'citron' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  isLoading?: boolean;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  hasArrow?: boolean;
  hasExternalArrow?: boolean;
  href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'ink',
    size = 'default',
    isLoading = false,
    disabled = false,
    icon,
    iconPosition = 'left',
    hasArrow = false,
    hasExternalArrow = false,
    href,
    children,
    className = '',
    ...props
  },
  ref
) {
  const variantClass = {
    flame: 'btn-flame',
    ink: 'btn-ink',
    outline: 'btn-outline',
    citron: 'btn-citron',
    ghost: 'btn-ghost',
  }[variant];

  const sizeClass = {
    sm: 'text-xs px-3 py-1.5 min-h-[38px]',
    default: 'text-sm px-4 py-2.5 min-h-[44px]',
    lg: 'text-base px-6 py-3.5 min-h-[50px]',
  }[size];

  const content = (
    <>
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      ) : icon && iconPosition === 'left' ? (
        <Icon name={icon} size={16} aria-hidden="true" />
      ) : null}

      <span className="truncate">{children}</span>

      {!isLoading && icon && iconPosition === 'right' && (
        <Icon name={icon} size={16} aria-hidden="true" />
      )}

      {!isLoading && hasArrow && (
        <Icon name="arrow-right" size={16} className="btn-arrow" aria-hidden="true" />
      )}

      {!isLoading && hasExternalArrow && (
        <Icon name="arrow-up-right" size={16} className="btn-arrow-diag" aria-hidden="true" />
      )}
    </>
  );

  const baseClasses = `btn-field ${variantClass} ${sizeClass} ${className}`;

  if (href && !disabled && !isLoading) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={baseClasses}
      {...props}
    >
      {content}
    </button>
  );
});
