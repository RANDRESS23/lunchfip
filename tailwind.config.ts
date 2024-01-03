import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-0': 'linear-gradient(180deg,#ffffff,#cccccc)',
        'gradient-1': 'linear-gradient(90deg,#007cf0,#00dfd8)',
        'gradient-2': 'linear-gradient(90deg,#7928ca,#ff0080)',
        'gradient-3': 'linear-gradient(90deg,#ff4d4d,#f9cb28)',
        'gradient-text-light': 'linear-gradient(180deg,rgba(0,0,0,.8),#000)',
        'gradient-text-dark': 'linear-gradient(180deg,#fff,hsla(0,0%,100%,.75))'
      },
      keyframes: {
        'animation-title-1': {
          '0%': { opacity: '1' },
          '16.667%': { opacity: '1' },
          '33.333%': { opacity: '0' },
          '83.333%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'animation-title-2': {
          '0%': { opacity: '0' },
          '16.667%': { opacity: '0' },
          '33.333%': { opacity: '1' },
          '50%': { opacity: '1' },
          '66.667%': { opacity: '0' },
          '100%': { opacity: '0' }
        },
        'animation-title-3': {
          '0%': { opacity: '0' },
          '50%': { opacity: '0' },
          '66.667%': { opacity: '1' },
          '83.333%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'animation-title-4': {
          '0%': { backgroundImage: 'linear-gradient(90deg,#007cf0,#00dfd8)' },
          '16.667%': { backgroundImage: 'linear-gradient(90deg,#007cf0,#00dfd8)' },
          '33.333%': { backgroundImage: 'linear-gradient(90deg,#7928ca,#ff0080)' },
          '50%': { backgroundImage: 'linear-gradient(90deg,#7928ca,#ff0080)' },
          '66.667%': { backgroundImage: 'linear-gradient(90deg,#ff4d4d,#f9cb28)' },
          '83.333%': { backgroundImage: 'linear-gradient(90deg,#ff4d4d,#f9cb28)' },
          '100%': { backgroundImage: 'linear-gradient(90deg,#007cf0,#00dfd8)' }
        },
        'animation-button': {
          '0%': {
            backgroundImage: 'linear-gradient(90deg,#007cf0,#00dfd8)',
            boxShadow: '0px 0px 20px 2px rgba(0, 223, 216, 0.8)'
          },
          '16.667%': {
            backgroundImage: 'linear-gradient(90deg,#007cf0,#00dfd8)',
            boxShadow: '0px 0px 20px 2px rgba(0, 223, 216, 0.8)'
          },
          '33.333%': {
            backgroundImage: 'linear-gradient(90deg,#7928ca,#ff0080)',
            boxShadow: '0px 0px 20px 2px rgba(255, 0, 128, 0.8)'
          },
          '50%': {
            backgroundImage: 'linear-gradient(90deg,#7928ca,#ff0080)',
            boxShadow: '0px 0px 20px 2px rgba(255, 0, 128, 0.8)'
          },
          '66.667%': {
            backgroundImage: 'linear-gradient(90deg,#ff4d4d,#f9cb28)',
            boxShadow: '0px 0px 20px 2px rgba(249, 203, 40, 0.8)'
          },
          '83.333%': {
            backgroundImage: 'linear-gradient(90deg,#ff4d4d,#f9cb28)',
            boxShadow: '0px 0px 20px 2px rgba(249, 203, 40, 0.8)'
          },
          '100%': {
            backgroundImage: 'linear-gradient(90deg,#007cf0,#00dfd8)',
            boxShadow: '0px 0px 20px 2px rgba(0, 223, 216, 0.8)'
          }
        }
      },
      animation: {
        'color-cycle-1': 'animation-title-1 8s ease-in-out infinite',
        'color-cycle-2': 'animation-title-2 8s ease-in-out infinite',
        'color-cycle-3': 'animation-title-3 8s ease-in-out infinite',
        'color-cycle-4': 'animation-button 12s ease-in-out infinite',
        'color-cycle-5': 'animation-title-4 12s ease-in-out infinite'
      }
    }
  },
  darkMode: 'class',
  plugins: [nextui()]
}
export default config
