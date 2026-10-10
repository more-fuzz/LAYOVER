'use client';

import React, { useEffect } from 'react';
import { Icon } from './Icon';

interface ToastProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose: () => void;
  durationMs?: number;
}

export function Toast({
  message,
  type = 'info',
  onClose,
  durationMs = 4000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, durationMs);
    return () => clearTimeout(timer);
  }, [onClose, durationMs]);

  const styles = {
    info: 'bg-[var(--ink,#0F1F1A)] text-[var(--paper,#F6EFE2)] border-[var(--ink-line,#2D4C42)]',
    success: 'bg-[#E2F7EE] text-[var(--jade-deep,#0B7A50)] border-[var(--jade-deep,#0B7A50)]',
    warning: 'bg-[#FFF8E6] text-[#7D5C06] border-[var(--gold,#F2C94C)]',
    error: 'bg-[#FBF3F0] text-[var(--folklore,#B8390A)] border-[var(--folklore,#B8390A)]',
  }[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-[var(--radius,14px)] border shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-300 ${styles}`}
    >
      <span className="truncate max-w-sm">{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss message"
        className="ml-2 w-6 h-6 flex items-center justify-center rounded hover:opacity-75 transition-opacity"
      >
        <Icon name="close" size={14} />
      </button>
    </div>
  );
}
