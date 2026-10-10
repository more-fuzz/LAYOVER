import React from 'react';

interface DifficultyDotsProps {
  difficulty?: string;
  className?: string;
}

export function DifficultyDots({ difficulty = 'easy', className = '' }: DifficultyDotsProps) {
  const norm = difficulty.toLowerCase();
  let filledCount = 1;
  let label = 'Easy';

  if (norm.includes('mod') || norm.includes('medium')) {
    filledCount = 2;
    label = 'Moderate';
  } else if (norm.includes('hard') || norm.includes('chal') || norm.includes('expert')) {
    filledCount = 3;
    label = 'Challenging';
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      role="img"
      aria-label={`Difficulty: ${label} (${filledCount} of 3)`}
      title={`Difficulty: ${label}`}
    >
      {[1, 2, 3].map((dotIndex) => {
        const isFilled = dotIndex <= filledCount;
        return (
          <span
            key={dotIndex}
            className={`w-2 h-2 rounded-full transition-colors ${
              isFilled ? 'bg-[var(--flame,#FF5A1F)]' : 'bg-[var(--line,#D8CBB0)]'
            }`}
            aria-hidden="true"
          />
        );
      })}
      <span className="font-mono-label text-[10px] text-[var(--muted,#5E675F)] ml-1 capitalize">
        {label}
      </span>
    </div>
  );
}
