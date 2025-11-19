import React from 'react';

interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number; // 0 to 100
  color: string;
  icon?: React.ReactNode;
  label?: string;
  subLabel?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ 
  radius, 
  stroke, 
  progress, 
  color,
  icon,
  label,
  subLabel
}) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center group">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="rotate-[-90deg] transition-all duration-500"
        >
          <circle
            className="stroke-slate-200 dark:stroke-slate-800 transition-colors duration-300"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out drop-shadow-sm"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-slate-700 dark:text-slate-200">
          {icon ? icon : <span className="text-xl font-bold">{progress}%</span>}
        </div>
      </div>
      {label && <div className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</div>}
      {subLabel && <div className="text-xs text-slate-500 dark:text-slate-500">{subLabel}</div>}
    </div>
  );
};