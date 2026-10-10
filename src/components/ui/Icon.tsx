'use client';

import React from 'react';

export type IconName =
  | 'compass'
  | 'mountain'
  | 'shield-check'
  | 'star'
  | 'book'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'arrow-left'
  | 'bookmark'
  | 'ghost'
  | 'ticket'
  | 'search'
  | 'copy'
  | 'check'
  | 'trophy'
  | 'pin'
  | 'route'
  | 'clock'
  | 'user'
  | 'close';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  className?: string;
  label?: string;
}

export function Icon({ name, size = 20, className = '', label, ...props }: IconProps) {
  const isDecorative = !label;

  const renderPath = () => {
    switch (name) {
      case 'compass':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <polygon points="15.5 8.5 13 13 8.5 15.5 11 11 15.5 8.5" fill="none" />
          </>
        );
      case 'mountain':
        return (
          <>
            <path d="M2.5 19.5L9.5 8l4.5 7 2.5-3.5L21.5 19.5z" />
            <path d="M9.5 8l2.5 3.5-2 1.5" />
          </>
        );
      case 'shield-check':
        return (
          <>
            <path d="M12 3.5l7 3v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10v-5z" />
            <path d="M9 12l2 2 4-4" />
          </>
        );
      case 'star':
        return (
          <polygon points="12 3.5 14.5 9 20.5 9.5 16 13.5 17.5 19.5 12 16.5 6.5 19.5 8 13.5 3.5 9.5 9.5 9 12 3.5" />
        );
      case 'book':
        return (
          <>
            <path d="M4 19.5v-13A2.5 2.5 0 0 1 6.5 4H19a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 0 4 19.5z" />
            <path d="M4 15h16" />
          </>
        );
      case 'arrow-right':
        return (
          <>
            <path d="M4 12h16" />
            <path d="M14 6l6 6-6 6" />
          </>
        );
      case 'arrow-up-right':
        return (
          <>
            <path d="M6 18L18 6" />
            <path d="M9 6h9v9" />
          </>
        );
      case 'arrow-left':
        return (
          <>
            <path d="M20 12H4" />
            <path d="M10 18l-6-6 6-6" />
          </>
        );
      case 'bookmark':
        return <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z" />;
      case 'ghost':
        return (
          <>
            <path d="M4 19V9a8 8 0 0 1 16 0v10l-2.5-1.5L15 19l-3-1.5L9 19l-2.5-1.5L4 19z" />
            <circle cx="9.5" cy="10" r="1.2" fill="currentColor" />
            <circle cx="14.5" cy="10" r="1.2" fill="currentColor" />
          </>
        );
      case 'ticket':
        return (
          <>
            <path d="M3.5 8.5a2.5 2.5 0 0 0 0 5V18a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5v-4.5a2.5 2.5 0 0 0 0-5V6A1.5 1.5 0 0 0 19 4.5H5A1.5 1.5 0 0 0 3.5 6z" />
            <path d="M13 4.5v15" strokeDasharray="2 2" />
          </>
        );
      case 'search':
        return (
          <>
            <circle cx="11" cy="11" r="7" />
            <path d="M16 16l4.5 4.5" />
          </>
        );
      case 'copy':
        return (
          <>
            <rect x="8" y="8" width="12" height="12" rx="2" />
            <path d="M5 16H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
          </>
        );
      case 'check':
        return <path d="M5 12.5l4.5 4.5 9.5-10" />;
      case 'trophy':
        return (
          <>
            <path d="M6 4h12v6a6 6 0 0 1-12 0V4z" />
            <path d="M18 6h3a2 2 0 0 1 2 2v1a3 3 0 0 1-3 3h-2" />
            <path d="M6 6H3a2 2 0 0 0-2 2v1a3 3 0 0 0 3 3h2" />
            <path d="M12 16v3" />
            <path d="M8 20h8" />
          </>
        );
      case 'pin':
        return (
          <>
            <path d="M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10z" />
            <circle cx="12" cy="11" r="2.2" />
          </>
        );
      case 'route':
        return (
          <>
            <circle cx="6" cy="18" r="2.5" />
            <circle cx="18" cy="6" r="2.5" />
            <path d="M8.5 18H14a4 4 0 0 0 4-4V8.5" strokeDasharray="3 2" />
          </>
        );
      case 'clock':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5l3 2" />
          </>
        );
      case 'user':
        return (
          <>
            <circle cx="12" cy="8" r="4" />
            <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
          </>
        );
      case 'close':
        return (
          <>
            <path d="M6 6l12 12" />
            <path d="M18 6l-12 12" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={isDecorative ? 'true' : undefined}
      aria-label={label}
      {...props}
    >
      {renderPath()}
    </svg>
  );
}
