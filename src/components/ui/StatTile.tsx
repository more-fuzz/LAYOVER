import React from 'react';

interface StatTileProps {
  label: string;
  value: string | number;
  unit?: string;
  variant?: 'default' | 'citron' | 'ink';
  description?: string;
  className?: string;
}

export function StatTile({
  label,
  value,
  unit,
  variant = 'default',
  description,
  className = '',
}: StatTileProps) {
  const styles = {
    default: 'bg-[var(--card,#FFFAF0)] text-[var(--ink,#0F1F1A)] border-[var(--line,#D8CBB0)]',
    citron: 'bg-[var(--citron,#D8F23C)] text-[var(--ink,#0F1F1A)] border-[var(--citron,#D8F23C)] shadow-sm',
    ink: 'bg-[var(--ink,#0F1F1A)] text-[var(--paper,#F6EFE2)] border-[var(--ink-line,#2D4C42)]',
  }[variant];

  const labelColor = variant === 'ink' ? 'text-[var(--sand,#EADFC8)]' : 'text-[var(--muted,#5E675F)]';
  const descColor = variant === 'ink' ? 'text-[var(--line,#D8CBB0)]' : 'text-[var(--muted,#5E675F)]';

  return (
    <div
      className={`p-4 md:p-5 rounded-[var(--radius,14px)] border flex flex-col justify-between ${styles} ${className}`}
    >
      <span className={`font-mono-label text-[11px] ${labelColor}`}>
        {label}
      </span>

      <div className="my-2 flex items-baseline gap-1.5">
        <span className="font-display text-3xl md:text-4xl font-bold tracking-tight tabular-nums">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && (
          <span className="font-mono-label text-xs uppercase font-medium">
            {unit}
          </span>
        )}
      </div>

      {description && (
        <span className={`text-xs ${descColor} leading-snug`}>
          {description}
        </span>
      )}
    </div>
  );
}
