'use client';

import React, { useId } from 'react';

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 40, className = '' }: LogoMarkProps) {
  const uid = useId().replace(/:/g, '');
  const sId = `ttS_${uid}`;
  const rId = `ttR_${uid}`;

  return (
    <svg
      className={`mark ${className}`}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={sId} cx=".63" cy=".62" r=".62">
          <stop offset="0" stopColor="#FFA24A" />
          <stop offset=".22" stopColor="#A94A17" />
          <stop offset=".6" stopColor="#2C190F" />
          <stop offset="1" stopColor="#15100C" />
        </radialGradient>
        <linearGradient id={rId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A8401A" />
          <stop offset=".5" stopColor="#F7C089" />
          <stop offset="1" stopColor="#CF6D36" />
        </linearGradient>
      </defs>

      {/* Back rings */}
      <g className="r2" style={{ transformOrigin: '20px 20px' }}>
        <ellipse cx="20" cy="20" rx="17" ry="5.6" stroke={`url(#${rId})`} strokeWidth="1.7" />
      </g>
      <g className="r1" style={{ transformOrigin: '20px 20px' }}>
        <ellipse cx="20" cy="20" rx="17.5" ry="5.8" stroke={`url(#${rId})`} strokeWidth="1.7" />
      </g>

      {/* Dark central sphere */}
      <circle cx="20" cy="20" r="10.8" fill={`url(#${sId})`} />

      {/* Interlocking front-half rings */}
      <g className="r2" style={{ transformOrigin: '20px 20px' }}>
        <ellipse
          cx="20"
          cy="20"
          rx="17"
          ry="5.6"
          stroke={`url(#${rId})`}
          strokeWidth="1.7"
          pathLength="1"
          strokeDasharray="0.5 0.5"
        />
      </g>
      <g className="r1" style={{ transformOrigin: '20px 20px' }}>
        <ellipse
          cx="20"
          cy="20"
          rx="17.5"
          ry="5.8"
          stroke={`url(#${rId})`}
          strokeWidth="1.7"
          pathLength="1"
          strokeDasharray="0.5 0.5"
        />
      </g>
    </svg>
  );
}
export default LogoMark;
