import React from 'react';
import ThemeConfig from '../theme';

interface EngineeringGridProps {
  theme: ThemeConfig;
}

export const EngineeringGrid: React.FC<EngineeringGridProps> = ({
  theme,
}) => {
  /*
   * Keep the theme in the component API so the engineering grid
   * can integrate with the application's visual system.
   *
   * The current decorative implementation primarily uses CSS
   * geometry, while the supplied theme remains available for
   * theme-dependent styling.
   */
  const gridColor = theme.border;

  const horizontalLines = Array.from({ length: 13 });
  const verticalLines = Array.from({ length: 17 });

  const intersectionNodes = [
    { left: '12.5%', top: '16.66%' },
    { left: '37.5%', top: '16.66%' },
    { left: '62.5%', top: '33.33%' },
    { left: '87.5%', top: '33.33%' },
    { left: '25%', top: '50%' },
    { left: '50%', top: '50%' },
    { left: '75%', top: '66.66%' },
    { left: '12.5%', top: '83.33%' },
    { left: '62.5%', top: '83.33%' },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* ========================================================== */}
      {/* Grid Lines Layer                                            */}
      {/* ========================================================== */}
      <div className="absolute inset-0 opacity-40">
        {/* Vertical Engineering Lines */}
        <div className="absolute inset-0 flex justify-between">
          {verticalLines.map((_, index) => (
            <span
              key={`vertical-${index}`}
              className="h-full w-px"
              style={{
                backgroundColor: gridColor,
                opacity: index % 4 === 0 ? 0.5 : 0.2,
              }}
            />
          ))}
        </div>

        {/* Horizontal Engineering Lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {horizontalLines.map((_, index) => (
            <span
              key={`horizontal-${index}`}
              className="h-px w-full"
              style={{
                backgroundColor: gridColor,
                opacity: index % 3 === 0 ? 0.5 : 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* ========================================================== */}
      {/* Geometric Intersection Nodes Layer                          */}
      {/* ========================================================== */}
      <div className="absolute inset-0">
        {intersectionNodes.map((node, index) => (
          <span
            key={`node-${index}`}
            className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: node.left,
              top: node.top,
              backgroundColor: theme.primary,
              boxShadow: `0 0 10px ${theme.primary}`,
              opacity: 0.65,
            }}
          />
        ))}
      </div>

      {/* Subtle edge fade for readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.18) 75%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
};

export default EngineeringGrid;
```
