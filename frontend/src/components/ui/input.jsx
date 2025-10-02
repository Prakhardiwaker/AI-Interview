// src/components/ui/input.jsx
import React from "react";

const Input = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
    />
  );
};

export default Input;
