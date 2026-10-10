'use client';

import React, { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  aspectRatio?: '4/3' | '16/9' | '1/1' | 'auto';
  containerClassName?: string;
}

export default function SafeImage({
  src,
  alt = 'Expedition Record',
  fallbackTitle,
  aspectRatio = '4/3',
  containerClassName = '',
  className = '',
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const aspectClass =
    aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : '';

  if (error || !src) {
    return (
      <div
        className={`w-full ${aspectClass} bg-[#EAE1D3] border border-[#D6CCBC] flex flex-col items-center justify-center p-4 text-center select-none ${containerClassName}`}
      >
        <div className="w-8 h-8 rounded border border-[#BDB19C] bg-[#FFFDF8] flex items-center justify-center text-[#777A53] mb-1.5 text-xs font-mono">
          IMG
        </div>
        <span className="text-[11px] font-bold text-[#6D685C] uppercase tracking-wider font-mono">
          {fallbackTitle || alt || 'Field Record Photo'}
        </span>
        <span className="text-[10px] text-[#8E8675] mt-0.5">
          Archived Journal Visual
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden ${aspectClass} ${containerClassName} bg-[#EAE1D3]`}>
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
