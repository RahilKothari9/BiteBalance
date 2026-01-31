// tailwind.config.js
// BiteBalance "Vibrant Harvest" Theme

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Colors
      colors: {
        // Backgrounds
        cream: '#FAF7F2',
        sand: '#F0EBE3',

        // Text
        charcoal: '#2D2A26',
        'warm-gray': '#6B6560',
        stone: '#9C9690',

        // Accent Colors
        coral: {
          DEFAULT: '#E85D4C',
          hover: '#D94A39',
          light: '#FDF0EE',
        },
        teal: {
          DEFAULT: '#2A9D8F',
          hover: '#238B7E',
          light: '#EDF7F6',
        },
        gold: {
          DEFAULT: '#E9C46A',
          hover: '#DDB85A',
          light: '#FDF8EC',
        },

        // Semantic (keep defaults but can override)
        success: {
          DEFAULT: '#4CAF50',
          light: '#E8F5E9',
        },
        warning: {
          DEFAULT: '#FF9800',
          light: '#FFF3E0',
        },
        error: {
          DEFAULT: '#D32F2F',
          light: '#FFEBEE',
        },
        info: {
          DEFAULT: '#2196F3',
          light: '#E3F2FD',
        },
      },

      // Typography
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      fontSize: {
        'display-xl': ['3rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-lg': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-lg': ['1.75rem', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-md': ['1.375rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
      },

      // Spacing
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },

      // Border Radius
      borderRadius: {
        'sm': '0.5rem',    // 8px
        'md': '0.75rem',   // 12px
        'lg': '1rem',      // 16px
        'xl': '1.5rem',    // 24px
        '2xl': '2rem',     // 32px
      },

      // Box Shadow
      boxShadow: {
        'sm': '0 1px 2px rgba(45, 42, 38, 0.04)',
        'md': '0 4px 12px rgba(45, 42, 38, 0.08)',
        'lg': '0 8px 24px rgba(45, 42, 38, 0.12)',
        'xl': '0 16px 48px rgba(45, 42, 38, 0.16)',
        'glow-coral': '0 4px 24px rgba(232, 93, 76, 0.25)',
        'glow-teal': '0 4px 24px rgba(42, 157, 143, 0.25)',
        'glow-gold': '0 4px 24px rgba(233, 196, 106, 0.25)',
      },

      // Transitions
      transitionDuration: {
        'instant': '100ms',
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms',
        'slower': '500ms',
      },

      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-expo': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },

      // Animations
      animation: {
        'fade-in-up': 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-down': 'fadeInDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-scale': 'fadeInScale 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-out-right': 'slideOutRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'bounce-gentle': 'bounce 1s cubic-bezier(0.34, 1.56, 0.64, 1) infinite',
        'pulse-gentle': 'pulse 2s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
        'float': 'float 8s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'blob': 'blobMorph 12s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },

      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(10px, -10px) rotate(2deg)' },
          '50%': { transform: 'translate(0, -20px) rotate(0deg)' },
          '75%': { transform: 'translate(-10px, -10px) rotate(-2deg)' },
        },
        blobMorph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '50%': { borderRadius: '50% 60% 30% 60% / 30% 40% 70% 50%' },
          '75%': { borderRadius: '40% 60% 50% 40% / 60% 50% 40% 60%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      // Z-index scale
      zIndex: {
        'dropdown': '100',
        'sticky': '200',
        'navbar': '300',
        'modal-backdrop': '400',
        'modal': '500',
        'toast': '600',
        'tooltip': '700',
      },

      // Container
      maxWidth: {
        'container': '1280px',
      },
    },
  },
  plugins: [],
};
