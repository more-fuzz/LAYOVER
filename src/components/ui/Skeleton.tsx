import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const variantStyles = {
    rectangular: 'rounded-[var(--radius,14px)]',
    circular: 'rounded-full',
    text: 'rounded-[var(--radius-sm,8px)] h-4',
  }[variant];

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-[var(--sand,#EADFC8)] animate-pulse ${variantStyles} ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent skeleton-shimmer" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card-field p-4 flex flex-col gap-3 min-h-[280px]">
      <Skeleton className="w-full aspect-[4/3] rounded-[var(--radius,14px)]" />
      <div className="flex items-center justify-between mt-2">
        <Skeleton variant="text" className="w-24 h-3" />
        <Skeleton variant="text" className="w-16 h-3" />
      </div>
      <Skeleton variant="text" className="w-3/4 h-6" />
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--line,#D8CBB0)]">
        <Skeleton variant="text" className="w-20 h-4" />
        <Skeleton className="w-24 h-9" />
      </div>
    </div>
  );
}
