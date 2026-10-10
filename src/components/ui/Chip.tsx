'use client';

import React from 'react';
import { Icon, IconName } from './Icon';

interface ChipProps {
  label: string;
  active?: boolean;
  onClick: () => void;
  icon?: IconName;
  count?: number;
  className?: string;
  'aria-controls'?: string;
}

export function Chip({
  label,
  active = false,
  onClick,
  icon,
  count,
  className = '',
  'aria-controls': ariaControls,
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-controls={ariaControls}
      className={`chip-field ${active ? 'active' : ''} ${className}`}
    >
      {icon && <Icon name={icon} size={14} aria-hidden="true" />}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
            active ? 'bg-[var(--citron,#D8F23C)] text-[var(--ink,#0F1F1A)]' : 'bg-[var(--sand,#EADFC8)] text-[var(--muted,#5E675F)]'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
