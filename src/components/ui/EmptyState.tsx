import React from 'react';
import { Button } from './Button';
import { Icon, IconName } from './Icon';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: IconName;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon = 'compass',
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`p-8 md:p-12 text-center rounded-[var(--radius-lg,22px)] border border-[var(--line,#D8CBB0)] bg-[var(--card,#FFFAF0)] flex flex-col items-center justify-center max-w-xl mx-auto my-8 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[var(--sand,#EADFC8)] text-[var(--ink,#0F1F1A)] flex items-center justify-center mb-4">
        <Icon name={icon} size={24} aria-hidden="true" />
      </div>
      <h3 className="font-display text-xl md:text-2xl font-bold text-[var(--ink,#0F1F1A)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--muted,#5E675F)] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <Button
          variant="ink"
          href={actionHref}
          onClick={onAction}
          hasArrow
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Trail unavailable',
  message = "We can't reach the trail right now. Check your connection and try again.",
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`p-6 md:p-8 rounded-[var(--radius,14px)] border border-[var(--folklore,#B8390A)]/30 bg-[#FBF3F0] text-center max-w-lg mx-auto my-6 flex flex-col items-center ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-[var(--folklore,#B8390A)]/10 text-[var(--folklore,#B8390A)] flex items-center justify-center mb-3">
        <Icon name="compass" size={20} aria-hidden="true" />
      </div>
      <h3 className="font-display text-lg font-bold text-[var(--ink,#0F1F1A)] mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-[var(--muted,#5E675F)] max-w-sm mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
