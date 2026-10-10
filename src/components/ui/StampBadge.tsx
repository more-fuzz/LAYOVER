import React from 'react';

export type StampVariant = 'history' | 'folklore' | 'verified' | 'demo';

interface StampBadgeProps {
  variant: StampVariant;
  text?: string;
  className?: string;
}

export function StampBadge({ variant, text, className = '' }: StampBadgeProps) {
  const getProps = () => {
    switch (variant) {
      case 'history':
        return {
          label: text || 'Documented History',
          styles: 'border-[1.5px] border-[var(--jade-deep,#0B7A50)] text-[var(--jade-deep,#0B7A50)] bg-transparent',
        };
      case 'folklore':
        return {
          label: text || 'Local Folklore',
          styles: 'border-[1.5px] border-[var(--folklore,#B8390A)] text-[var(--folklore,#B8390A)] bg-transparent',
        };
      case 'verified':
        return {
          label: text || 'Verified Expedition',
          styles: 'border-[1.5px] border-[var(--jade-deep,#0B7A50)] text-[var(--jade-deep,#0B7A50)] bg-[#E2F7EE]',
        };
      case 'demo':
        return {
          label: text || 'DEMO DATA',
          styles: 'border-[1.5px] border-[var(--gold,#F2C94C)] text-[#7D5C06] bg-[#FFF8E6]',
        };
    }
  };

  const { label, styles } = getProps();

  return (
    <span
      className={`inline-block font-mono-label px-2.5 py-1 rounded-[var(--radius-sm,8px)] tracking-wider text-[10px] font-bold select-none transform -rotate-3 hover:rotate-0 transition-transform duration-300 ease-[cubic-bezier(.3,1.5,.5,1)] ${styles} ${className}`}
    >
      {label}
    </span>
  );
}
