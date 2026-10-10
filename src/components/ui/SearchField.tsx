'use client';

import React, { useId } from 'react';
import { Icon } from './Icon';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  id?: string;
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search trails, activities, folklore...',
  label = 'Search adventures',
  className = '',
  id,
}: SearchFieldProps) {
  const generatedId = useId();
  const inputId = id || `search-${generatedId}`;

  return (
    <div className={`relative flex flex-col w-full ${className}`}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-[var(--muted,#5E675F)]" aria-hidden="true">
          <Icon name="search" size={20} />
        </div>
        <input
          id={inputId}
          type="search"
          role="searchbox"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-[52px] pl-12 pr-12 bg-[var(--card,#FFFAF0)] text-[var(--text,#1A241F)] placeholder-[var(--muted,#5E675F)] border-[1.5px] border-[var(--ink,#0F1F1A)] rounded-[var(--radius,14px)] text-sm font-medium focus:border-[var(--flame,#FF5A1F)] transition-colors"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="absolute right-3 w-8 h-8 flex items-center justify-center rounded-full text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)] hover:bg-[var(--sand,#EADFC8)] transition-colors"
          >
            <Icon name="close" size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
