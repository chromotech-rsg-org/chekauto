import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  label: string;
  completed: boolean;
  active: boolean;
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, className }) => {
  return (
    <div className={cn("flex items-center justify-between w-full max-w-4xl mx-auto px-4", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center flex-1">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                step.completed
                  ? "bg-white text-brand-yellow"
                  : step.active
                  ? "bg-brand-yellow text-black"
                  : "bg-gray-700 text-gray-400"
              )}
            >
              {step.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">
                  {index + 1}
                </span>
              )}
            </div>
            <span className={cn(
              "text-xs mt-2 text-center font-medium",
              step.active || step.completed ? "text-white" : "text-gray-500"
            )}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              "h-0.5 flex-1 mx-2 mt-[-20px]",
              step.completed ? "bg-white" : "bg-gray-700"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
