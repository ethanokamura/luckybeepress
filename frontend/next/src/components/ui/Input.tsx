import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  fullWidth = false,
  className = "",
  ...props
}: InputProps) {
  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <div className={`${widthStyle}`}>
      {label && (
        <label className="block text-sm font-medium text-base-content mb-1.5">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <input
        className={`
          block w-full px-4 py-1
          bg-base-100 
          border ${error ? "border-error" : "border-base-300"}
          rounded-lg
          text-base-content
          placeholder:text-neutral-content
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:bg-base-200 disabled:cursor-not-allowed
          transition-colors duration-200
          ${className}
        `}
        {...props}
      />

      {error && <p className="mt-1.5 text-sm text-error">{error}</p>}

      {helperText && !error && (
        <p className="mt-1.5 text-sm text-neutral-content">{helperText}</p>
      )}
    </div>
  );
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export function Textarea({
  label,
  error,
  helperText,
  fullWidth = false,
  className = "",
  ...props
}: TextareaProps) {
  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <div className={`${widthStyle}`}>
      {label && (
        <label className="block text-sm font-medium text-base-content mb-1.5">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <textarea
        className={`
          block w-full px-4 py-2.5 
          bg-base-100 
          border ${error ? "border-error" : "border-base-300"}
          rounded-lg
          text-base-content
          placeholder:text-neutral-content
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:bg-base-200 disabled:cursor-not-allowed
          transition-colors duration-200
          resize-vertical
          ${className}
        `}
        {...props}
      />

      {error && <p className="mt-1.5 text-sm text-error">{error}</p>}

      {helperText && !error && (
        <p className="mt-1.5 text-sm text-neutral-content">{helperText}</p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
}

export function Select({
  label,
  error,
  helperText,
  fullWidth = false,
  options,
  className = "",
  ...props
}: SelectProps) {
  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <div className={`${widthStyle}`}>
      {label && (
        <label className="block text-sm font-medium text-base-content mb-1.5">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <select
        className={`
          block w-full px-4 py-2.5 
          bg-base-200 
          border ${error ? "border-error" : "border-base-300"}
          rounded-lg
          text-base-content
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:bg-base-200 disabled:cursor-not-allowed
          transition-colors duration-200
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1.5 text-sm text-error">{error}</p>}

      {helperText && !error && (
        <p className="mt-1.5 text-sm text-neutral-content">{helperText}</p>
      )}
    </div>
  );
}
