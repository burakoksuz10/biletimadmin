/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Violet/Pink palette (using CSS variables for dark mode)
        primary: {
          DEFAULT: 'var(--color-primary, #6b38d4)',
          light: 'var(--color-primary-light, #8a4ee8)',
          dark: 'var(--color-primary-dark, #5828b3)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #b4136d)',
          light: 'var(--color-secondary-light, #d9177f)',
          dark: 'var(--color-secondary-dark, #8f0e56)',
        },

        // Surface Hierarchy - Glassmorphism layers (using CSS variables for dark mode)
        surface: {
          DEFAULT: 'var(--color-surface, #fef7ff)',
          low: 'var(--color-surface-low, #f8f1fe)',
          lower: 'var(--color-surface-lower, #ffffff)',
          high: 'var(--color-surface-high, #ede5f3)',
          higher: 'var(--color-surface-higher, #e5dcf0)',
          highest: 'var(--color-surface-highest, #ddd3eb)',
        },

        // On Surface Colors - Text hierarchy (using CSS variables for dark mode support)
        'on-surface': 'var(--color-on-surface, #1d1a23)',
        'on-surface-variant': 'var(--color-on-surface-variant, #494454)',
        'on-primary': 'var(--color-on-primary, #ffffff)',
        'on-secondary': 'var(--color-on-secondary, #ffffff)',

        // Outline Colors (using CSS variables for dark mode)
        outline: {
          DEFAULT: 'var(--color-outline, #cbc3d7)',
          variant: 'var(--color-outline-variant, #cbc3d7)',
        },

        // Status Colors with violet tint (using CSS variables for dark mode)
        success: {
          DEFAULT: 'var(--color-success, #00c853)',
          container: 'var(--color-success-container, #e8f5e9)',
          on: '#ffffff',
        },
        warning: {
          DEFAULT: 'var(--color-warning, #ffa726)',
          container: 'var(--color-warning-container, #fff3e0)',
          on: '#ffffff',
        },
        danger: {
          DEFAULT: 'var(--color-danger, #ef5350)',
          container: 'var(--color-danger-container, #ffebee)',
          on: '#ffffff',
        },
        info: {
          DEFAULT: 'var(--color-info, #42a5f5)',
          container: 'var(--color-info-container, #e3f2fd)',
          on: '#ffffff',
        },
      },

      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        // Display scales - for hero/event titles
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-md': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-sm': ['32px', { lineHeight: '40px', letterSpacing: '-0.015em', fontWeight: '600' }],

        // Headline scales - for category headers
        'headline-lg': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-md': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-sm': ['18px', { lineHeight: '24px', fontWeight: '600' }],

        // Title scales - for card titles
        'title-lg': ['18px', { lineHeight: '24px', fontWeight: '500' }],
        'title-md': ['16px', { lineHeight: '22px', fontWeight: '500' }],
        'title-sm': ['14px', { lineHeight: '20px', fontWeight: '500' }],

        // Body scales
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],

        // Label scales - all caps utility text
        'label-lg': ['14px', { lineHeight: '20px', fontWeight: '600', letterSpacing: '0.05em' }],
        'label-md': ['12px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '0.05em' }],
        'label-sm': ['10px', { lineHeight: '14px', fontWeight: '600', letterSpacing: '0.05em' }],
      },

      borderRadius: {
        // "The Ethereal Stage" - Everything is fluid
        DEFAULT: '1rem', // 16px
        lg: '1.5rem', // 24px - for cards
        xl: '2rem', // 32px
        '2xl': '2.5rem', // 40px
        '3xl': '3rem', // 48px
        full: '9999px', // Fully rounded - for buttons
      },

      boxShadow: {
        // Shadow Glow - for floating elements
        'glow': '0 10px 30px -5px rgba(107, 56, 212, 0.15)',
        'glow-lg': '0 15px 40px -5px rgba(107, 56, 212, 0.25)',
        'glow-sm': '0 5px 20px -3px rgba(107, 56, 212, 0.1)',

        // Ambient glow for secondary color
        'glow-secondary': '0 10px 30px -5px rgba(180, 19, 109, 0.15)',
      },

      backgroundImage: {
        // Signature gradient for CTAs (using CSS variables for dark mode)
        'gradient-primary': 'linear-gradient(135deg, var(--color-primary, #6b38d4) 0%, var(--color-secondary, #b4136d) 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, var(--color-primary-dark, #5828b3) 0%, var(--color-secondary-dark, #8f0e56) 100%)',

        // Mesh gradient backgrounds
        'mesh-gradient': 'radial-gradient(at 0% 0%, rgba(107, 56, 212, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(180, 19, 109, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(107, 56, 212, 0.1) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(180, 19, 109, 0.1) 0px, transparent 50%)',
      },

      backdropBlur: {
        // For glassmorphism effects
        glass: '20px',
        'glass-lg': '30px',
      },

      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },

      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },

      spacing: {
        // Layout-specific spacing
        'sidebar': '300px',
        'sidebar-collapsed': '80px',
        'header': '72px',
      },
    },
  },
};
