import React from "react";
import { cn } from "@/lib/utils"; // optional utility; remove if not used

/**
 * Label component
 *
 * Props:
 * - htmlFor?: string
 * - required?: boolean
 * - error?: boolean
 * - children: React.ReactNode
 * - className?: string
 */
const Label = ({
  htmlFor,
  required = false,
  error = false,
  children,
  className,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium transition-colors",
        error ? "text-red-500" : "text-gray-700 dark:text-gray-200",
        className
      )}
    >
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
};

export default Label;
