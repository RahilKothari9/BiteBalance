import React, { useState } from 'react';

/**
 * Input Component
 *
 * Text input with focus glow animation.
 * Supports error state, icons, and labels.
 */

const Input = React.forwardRef(({
  label,
  error,
  hint,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;
  const hasIcon = !!Icon;

  return (
    <div className={`w-full ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-charcoal mb-2">
          {label}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative">
        {/* Icon Left */}
        {hasIcon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className={`w-5 h-5 transition-colors duration-fast ${
              isFocused ? 'text-coral' : hasError ? 'text-error' : 'text-stone'
            }`} />
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full
            h-12
            px-4
            ${hasIcon && iconPosition === 'left' ? 'pl-12' : ''}
            ${hasIcon && iconPosition === 'right' ? 'pr-12' : ''}
            bg-white
            border
            rounded-lg
            font-body
            text-charcoal
            placeholder:text-stone
            transition-all duration-fast ease-out-expo
            focus:outline-none
            ${hasError
              ? 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(211,47,47,0.15)]'
              : 'border-stone/30 focus:border-coral focus:shadow-[0_0_0_3px_rgba(232,93,76,0.15)]'
            }
            disabled:bg-sand disabled:cursor-not-allowed disabled:opacity-60
            ${className}
          `}
          {...props}
        />

        {/* Icon Right */}
        {hasIcon && iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className={`w-5 h-5 transition-colors duration-fast ${
              isFocused ? 'text-coral' : hasError ? 'text-error' : 'text-stone'
            }`} />
          </div>
        )}
      </div>

      {/* Error Message */}
      {hasError && (
        <p className="mt-2 text-sm text-error flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* Hint Text */}
      {hint && !hasError && (
        <p className="mt-2 text-sm text-stone">
          {hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
