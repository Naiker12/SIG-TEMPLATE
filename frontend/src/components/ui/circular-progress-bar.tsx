
'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressBarProps {
  progress: number;
  message?: string;
  className?: string;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  progress,
  message = "Cargando...",
  className,
}) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            className="text-gray-300"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          {/* Progress circle */}
          <circle
            className="text-primary transition-all duration-300 ease-out"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
        </div>
      </div>
      {message && <p className="text-lg text-muted-foreground">{message}</p>}
    </div>
  );
};

export { CircularProgressBar };
