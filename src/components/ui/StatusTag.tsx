import React from 'react';

export type StatusType = 'pending' | 'approved' | 'rejected' | 'live' | 'verified';

interface StatusTagProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export function StatusTag({ status, label, className = '' }: StatusTagProps) {
  const getStyles = () => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-[var(--citron,#D8F23C)] text-[var(--ink,#0F1F1A)] border-[var(--citron,#D8F23C)]',
          dot: true,
          defaultLabel: 'Pending review',
        };
      case 'approved':
      case 'verified':
        return {
          bg: 'bg-[#E2F7EE] text-[var(--jade-deep,#0B7A50)] border-[var(--jade-deep,#0B7A50)]',
          dot: false,
          defaultLabel: 'Verified',
        };
      case 'rejected':
        return {
          bg: 'bg-[#FBECE6] text-[var(--folklore,#B8390A)] border-[var(--folklore,#B8390A)]',
          dot: false,
          defaultLabel: 'Changes requested',
        };
      case 'live':
        return {
          bg: 'bg-[var(--sand,#EADFC8)] text-[var(--ink,#0F1F1A)] border-[var(--line,#D8CBB0)]',
          dot: true,
          defaultLabel: 'Live status',
        };
    }
  };

  const style = getStyles();
  const text = label || style.defaultLabel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm,8px)] font-mono-label border text-[11px] font-bold ${style.bg} ${className}`}
    >
      {style.dot && <span className="live-dot" aria-hidden="true" />}
      <span>{text}</span>
    </span>
  );
}
