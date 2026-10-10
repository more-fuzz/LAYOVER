'use client';

import React, { useState } from 'react';
import { Skeleton } from './Skeleton';

interface ImageTileProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  aspectRatio?: '4/3' | '16/9' | '1/1';
  className?: string;
  containerClassName?: string;
}

export function ImageTile({
  src,
  alt,
  aspectRatio = '4/3',
  className = '',
  containerClassName = '',
  ...props
}: ImageTileProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const aspectClass = {
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-[16/9]',
    '1/1': 'aspect-square',
  }[aspectRatio];

  if (!src || error) {
    return (
      <div
        className={`relative w-full ${aspectClass} bg-[var(--sand,#EADFC8)] border border-[var(--line,#D8CBB0)] rounded-[var(--radius,14px)] overflow-hidden flex flex-col items-center justify-center p-4 text-center select-none ${containerClassName}`}
        role="img"
        aria-label={`${alt} (Illustrative map contour rendering)`}
      >
        {/* Faint contour line pattern SVG */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          viewBox="0 0 200 150"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M-20,40 Q40,10 100,50 T220,30 M-20,70 Q50,40 110,80 T220,60 M-20,100 Q60,70 120,110 T220,90 M-20,130 Q70,100 130,140 T220,120"
            fill="none"
            stroke="var(--ink,#0F1F1A)"
            strokeWidth="1.2"
          />
        </svg>

        <span className="relative z-10 font-mono-label text-[10px] tracking-widest text-[var(--muted,#5E675F)] px-2.5 py-1 rounded bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)]">
          Illustrative
        </span>
        <span className="relative z-10 text-xs font-medium text-[var(--ink,#0F1F1A)] mt-2 line-clamp-1 max-w-[85%]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspectClass} bg-[var(--sand,#EADFC8)] rounded-[var(--radius,14px)] overflow-hidden border border-[var(--line,#D8CBB0)] ${containerClassName}`}
    >
      {!loaded && <Skeleton className="absolute inset-0 w-full h-full rounded-none" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
    </div>
  );
}
