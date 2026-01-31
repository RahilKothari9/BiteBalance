import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * FeatureCard Component
 *
 * Specialized card for home page features.
 * Features gradient blob, icon, title, description.
 * Animated on hover.
 */

const gradients = {
  coral: {
    blob: 'from-coral to-orange-400',
    icon: 'text-coral',
    glow: 'group-hover:shadow-glow-coral',
  },
  teal: {
    blob: 'from-teal to-emerald-400',
    icon: 'text-teal',
    glow: 'group-hover:shadow-glow-teal',
  },
  gold: {
    blob: 'from-gold to-yellow-300',
    icon: 'text-gold',
    glow: 'group-hover:shadow-glow-gold',
  },
};

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  page,
  gradient = 'coral',
  className = '',
}) => {
  const navigate = useNavigate();
  const colors = gradients[gradient];

  const handleClick = () => {
    if (page) {
      navigate(`/${page}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group
        relative
        bg-white
        rounded-2xl
        p-8
        shadow-md
        overflow-hidden
        cursor-pointer
        transition-all duration-normal ease-out-expo
        hover:-translate-y-2
        hover:shadow-xl
        ${colors.glow}
        ${className}
      `}
    >
      {/* Animated Gradient Blob */}
      <div
        className={`
          absolute
          -top-16 -right-16
          w-40 h-40
          bg-gradient-to-br ${colors.blob}
          rounded-full
          blur-3xl
          opacity-40
          transition-all duration-slow ease-out-expo
          group-hover:scale-125
          group-hover:opacity-60
          group-hover:rotate-12
        `}
      />

      {/* Secondary Blob */}
      <div
        className={`
          absolute
          -bottom-20 -left-20
          w-32 h-32
          bg-gradient-to-br ${colors.blob}
          rounded-full
          blur-3xl
          opacity-20
          transition-all duration-slower ease-out-expo
          group-hover:scale-110
          group-hover:opacity-30
        `}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className={`
            w-14 h-14
            flex items-center justify-center
            rounded-xl
            bg-gradient-to-br ${colors.blob}
            mb-6
            transition-transform duration-normal ease-bounce
            group-hover:scale-110
            group-hover:rotate-3
          `}
        >
          {Icon && <Icon className="w-7 h-7 text-white" />}
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-xl text-charcoal mb-2 group-hover:text-charcoal/90 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-warm-gray text-sm leading-relaxed">
          {description}
        </p>

        {/* Arrow indicator */}
        <div className="mt-6 flex items-center text-sm font-medium text-coral opacity-0 translate-x-0 transition-all duration-normal group-hover:opacity-100 group-hover:translate-x-1">
          <span>Get started</span>
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
