import React from 'react';

/**
 * Card Component
 *
 * Base card with optional gradient blob background.
 * Supports hover lift animation.
 */

const blobColors = {
  coral: 'from-coral to-orange-400',
  teal: 'from-teal to-emerald-400',
  gold: 'from-gold to-yellow-300',
  none: '',
};

const Card = React.forwardRef(({
  children,
  className = '',
  blob = 'none',
  blobPosition = 'top-right',
  hover = true,
  padding = 'md',
  onClick,
  ...props
}, ref) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const blobPositionClasses = {
    'top-right': '-top-10 -right-10',
    'top-left': '-top-10 -left-10',
    'bottom-right': '-bottom-10 -right-10',
    'bottom-left': '-bottom-10 -left-10',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`
        relative
        bg-white
        rounded-xl
        shadow-md
        overflow-hidden
        transition-all duration-normal ease-out-expo
        ${hover ? 'hover:-translate-y-1 hover:shadow-xl cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
      {...props}
    >
      {/* Gradient Blob */}
      {blob !== 'none' && (
        <div
          className={`
            absolute
            w-32 h-32
            bg-gradient-to-br ${blobColors[blob]}
            rounded-full
            blur-3xl
            opacity-50
            pointer-events-none
            transition-all duration-slow ease-out-expo
            group-hover:scale-110 group-hover:opacity-60
            ${blobPositionClasses[blobPosition]}
          `}
        />
      )}

      {/* Card Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});

Card.displayName = 'Card';

// Card Header
const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

// Card Title
const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-heading-md font-display font-bold text-charcoal ${className}`}>
    {children}
  </h3>
);

// Card Description
const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-warm-gray mt-1 ${className}`}>
    {children}
  </p>
);

// Card Content
const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

// Card Footer
const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-sand ${className}`}>
    {children}
  </div>
);

export default Card;
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
