import React from 'react';
import { Icon } from './Icon';

interface Step {
  title: string;
  description?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number; // 0-indexed
  className?: string;
}

export function ProgressSteps({ steps, currentStep, className = '' }: ProgressStepsProps) {
  return (
    <div className={`w-full ${className}`}>
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li
              key={step.title}
              className={`flex-1 flex items-center ${
                index < steps.length - 1 ? "after:content-[''] after:w-full after:h-0.5 after:border-b after:border-[var(--line,#D8CBB0)] after:mx-2 md:after:mx-4" : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                    isDone
                      ? 'bg-[var(--jade-deep,#0B7A50)] text-white'
                      : isCurrent
                      ? 'bg-[var(--flame,#FF5A1F)] text-[var(--ink,#0F1F1A)]'
                      : 'bg-[var(--sand,#EADFC8)] text-[var(--muted,#5E675F)]'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isDone ? (
                    <Icon name="check" size={14} aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={`text-xs md:text-sm font-semibold truncate ${
                    isCurrent
                      ? 'text-[var(--ink,#0F1F1A)]'
                      : isDone
                      ? 'text-[var(--jade-deep,#0B7A50)]'
                      : 'text-[var(--muted,#5E675F)]'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
