import React from 'react';
import { ThemeConfig } from '../theme';

interface EngineeringGridProps {
  theme: ThemeConfig;
}

export const EngineeringGrid: React.FC<EngineeringGridProps> = ({ theme }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="grid-pattern"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {/* Grid Lines */}
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke={theme.gridLineColor}
              strokeWidth="0.8"
            />
            {/* Geometric Intersection Nodes */}
            <circle cx="0" cy="0" r="1.5" fill={theme.gridDotColor} />
            <circle cx="80" cy="0" r="1.5" fill={theme.gridDotColor} />
            <circle cx="0" cy="80" r="1.5" fill={theme.gridDotColor} />
            <circle cx="80" cy="80" r="1.5" fill={theme.gridDotColor} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>
  );
};
