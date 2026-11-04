import React from 'react';
import { DocumentMargin } from '../types/document';

interface RulerBarProps {
  marginPreset: DocumentMargin;
  isLandscape?: boolean;
}

export const RulerBar: React.FC<RulerBarProps> = ({ marginPreset, isLandscape = false }) => {
  const totalInches = isLandscape ? 11 : 8;

  let marginInches = 1.0;
  if (marginPreset === 'narrow') marginInches = 0.5;
  if (marginPreset === 'moderate') marginInches = 0.75;
  if (marginPreset === 'wide') marginInches = 1.5;

  const leftMarginPercent = (marginInches / totalInches) * 100;
  const rightMarginPercent = 100 - (marginInches / totalInches) * 100;

  return (
    <div className="no-print w-full flex flex-col items-center select-none py-1 overflow-hidden">
      <div
        className="h-6 bg-white border border-neutral-300 relative rounded-t-sm shadow-xs transition-all flex items-end"
        style={{
          width: isLandscape ? '1020px' : '800px',
          maxWidth: '100%',
        }}
      >
        {/* Shaded Left Margin Area */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-neutral-200/90 border-r border-neutral-400"
          style={{ width: `${leftMarginPercent}%` }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-1.5 flex flex-col justify-between items-center py-0.5">
            <div
              className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-black"
              title={`Left Margin: ${marginInches}"`}
            />
          </div>
        </div>

        {/* Shaded Right Margin Area */}
        <div
          className="absolute right-0 top-0 bottom-0 bg-neutral-200/90 border-l border-neutral-400"
          style={{ width: `${100 - rightMarginPercent}%` }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5 flex flex-col justify-between items-center py-0.5">
            <div
              className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-black"
              title={`Right Margin: ${marginInches}"`}
            />
          </div>
        </div>

        {/* Ruler Inch & Half-Inch Graduations */}
        <div className="w-full flex justify-between relative px-2 text-[9px] font-mono text-black">
          {Array.from({ length: totalInches + 1 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center relative"
              style={{ width: `${100 / totalInches}%` }}
            >
              {/* Major Inch Tick */}
              <div className="h-3 w-px bg-black absolute bottom-0 left-0" />
              {index > 0 && index < totalInches && (
                <span className="absolute bottom-3 left-0 -translate-x-1/2 text-[10px] select-none font-bold text-black">
                  {index}
                </span>
              )}
              {/* Half-inch Tick */}
              <div className="h-2 w-px bg-neutral-600 absolute bottom-0 left-1/2" />
              {/* Quarter-inch Ticks */}
              <div className="h-1.5 w-px bg-neutral-400 absolute bottom-0 left-1/4" />
              <div className="h-1.5 w-px bg-neutral-400 absolute bottom-0 left-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
