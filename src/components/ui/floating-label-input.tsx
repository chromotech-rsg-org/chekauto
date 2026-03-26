import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps extends React.ComponentProps<"input"> {
  label: string;
  containerClassName?: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, label, containerClassName, id, ...props }, ref) => {
    return (
      <div className={cn("relative", containerClassName)}>
        <label
          htmlFor={id}
          className="absolute -top-2.5 left-3 bg-white px-1.5 text-[11px] font-medium text-gray-500 z-10"
        >
          {label}
        </label>
        <input
          id={id}
          className={cn(
            "flex h-10 w-full rounded-md border-2 border-gray-200 bg-white px-3 py-2 text-base text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-0 focus-visible:border-brand-yellow disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
FloatingLabelInput.displayName = "FloatingLabelInput";

interface FloatingLabelWrapperProps {
  label: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

const FloatingLabelWrapper: React.FC<FloatingLabelWrapperProps> = ({
  label,
  htmlFor,
  className,
  children,
}) => {
  return (
    <div className={cn("relative", className)}>
      <label
        htmlFor={htmlFor}
        className="absolute -top-2.5 left-3 bg-white px-1.5 text-[11px] font-medium text-gray-500 z-10"
      >
        {label}
      </label>
      {children}
    </div>
  );
};

export { FloatingLabelInput, FloatingLabelWrapper };
