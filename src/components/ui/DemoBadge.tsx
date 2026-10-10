import React from 'react';

interface DemoBadgeProps {
  className?: string;
  label?: string;
}

export function DemoBadge({ className = '', label = 'DEMO DATA' }: DemoBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-sm,8px)] font-mono-label text-[10px] font-bold border border-[var(--line,#D8CBB0)] bg-[var(--sand,#EADFC8)] text-[var(--muted,#5E675F)] select-none ${className}`}
      title="Sample data fallback active"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold,#F2C94C)]" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
