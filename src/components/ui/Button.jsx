import React from 'react';

/**
 * Button Component
 *
 * Variants: primary (coral), secondary, ghost, teal, gold
 * Sizes: sm, md, lg
 * States: default, hover, active, disabled, loading
 */

const variants = {
  primary: `
    bg-coral text-white
    hover:bg-coral-hover hover:shadow-glow-coral
    active:bg-coral
  `,
  secondary: `
    bg-white text-charcoal border border-stone/30
    hover:border-charcoal/30 hover:shadow-md
    active:bg-sand
  `,
  ghost: `
    bg-transparent text-coral
    hover:bg-coral-light
    active:bg-coral-light
  `,
  teal: `
    bg-teal text-white
    hover:bg-teal-hover hover:shadow-glow-teal
    active:bg-teal
  `,
  gold: `
    bg-gold text-charcoal
    hover:bg-gold-hover hover:shadow-glow-gold
    active:bg-gold
  `,
  danger: `
    bg-error text-white
    hover:bg-red-700
    active:bg-error
  `,
};

const sizes = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-6 text-base gap-2',
  lg: 'h-13 px-8 text-lg gap-2.5',
};

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        font-semibold font-body
        rounded-lg
        transition-all duration-fast ease-out-expo
        focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        hover:-translate-y-0.5
        active:translate-y-0 active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Icon Left */}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="w-4 h-4" />
      )}

      {/* Children */}
      {!loading && children}
      {loading && <span className="ml-2">Loading...</span>}

      {/* Icon Right */}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4" />
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
