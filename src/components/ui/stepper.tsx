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
                "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all",
                step.completed
                  ? "bg-chekauto-yellow border-chekauto-yellow"
                  : step.active
                  ? "bg-white border-chekauto-yellow"
                  : "bg-white border-gray-300"
              )}
            >
              {step.completed ? (
                <Check className="w-6 h-6 text-black" />
              ) : (
                <span className={cn(
                  "text-sm font-semibold",
                  step.active ? "text-chekauto-yellow" : "text-gray-400"
                )}>
                  {index + 1}
                </span>
              )}
            </div>
            <span className={cn(
              "text-xs mt-2 text-center font-medium",
              step.active ? "text-black" : "text-gray-500"
            )}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              "h-0.5 flex-1 mx-2 mt-[-20px]",
              step.completed ? "bg-chekauto-yellow" : "bg-gray-300"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
