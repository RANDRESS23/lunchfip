import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react'
import svgToDataUri from 'mini-svg-data-uri'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter-sans': ['var(--font-inter)']
      },
      colors: {
        'color-primary': '#00aaff',
        'color-secondary': '#ff3366',
        'p-dark': '#ffffffb2',
        'p-light': '#00000095'
      },
      // colors: {
      //   rojo: '#e92a67',
      //   azul: '#2a8af6',
      //   morado: '#a853ba'
      // },
      backgroundImage: {
        'gradient-0': 'linear-gradient(180deg,#ffffff,#cccccc)',
        'gradient-1': 'linear-gradient(90deg,#007cf0,#00dfd8)',
        'gradient-2': 'linear-gradient(90deg,#7928ca,#ff0080)',
        'gradient-3': 'linear-gradient(90deg,#ff4d4d,#f9cb28)',
        'gradient-text-light': 'linear-gradient(180deg,rgba(0,0,0,.8),#000)',
        'gradient-text-dark': 'linear-gradient(180deg,#fff,hsla(0,0%,100%,.75))',
        'grid-white': `url("${svgToDataUri(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#202020"><path d="M0 .5H31.5V32"/></svg>'
        )}")`,
        'grid-black': `url("${svgToDataUri(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#e6e6e6"><path d="M0 .5H31.5V32"/></svg>'
        )}")`
      },
      keyframes: {
        'animation-title-1': {
          '0%': { opacity: '1' },
          '16.667%': { opacity: '1' },
          '33.333%': { opacity: '0' },
          '83.333%': { opacity: '0' },
          '94%': { opacity: '1' }
        },
        'animation-title-2': {
          '0%': { opacity: '0' },
          '16.667%': { opacity: '0' },
          '30%': { opacity: '1' },
          '50%': { opacity: '1' },
          '66.667%': { opacity: '0' },
          '100%': { opacity: '0' }
        },
        'animation-title-3': {
          '0%': { opacity: '0' },
          '50%': { opacity: '0' },
          '60%': { opacity: '1' },
          '83.333%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        // 'animation-title-1': {
        //   '0%': { opacity: '1' },
        //   '16.667%': { opacity: '1' },
        //   '33.333%': { opacity: '0' },
        //   '83.333%': { opacity: '0' },
        //   '100%': { opacity: '1' }
        // },
        // 'animation-title-2': {
        //   '0%': { opacity: '0' },
        //   '16.667%': { opacity: '0' },
        //   '33.333%': { opacity: '1' },
        //   '50%': { opacity: '1' },
        //   '66.667%': { opacity: '0' },
        //   '100%': { opacity: '0' }
        // },
        // 'animation-title-3': {
        //   '0%': { opacity: '0' },
        //   '50%': { opacity: '0' },
        //   '66.667%': { opacity: '1' },
        //   '83.333%': { opacity: '1' },
        //   '100%': { opacity: '0' }
        // },
        'animation-title-4': {
          '0%': { backgroundImage: 'linear-gradient(90deg,#007cf0,#00dfd8)' },
          '16.667%': { backgroundImage: 'linear-gradient(90deg,#007cf0,#00dfd8)' },
          '33.333%': { backgroundImage: 'linear-gradient(90deg,#7928ca,#ff0080)' },
          '50%': { backgroundImage: 'linear-gradient(90deg,#7928ca,#ff0080)' },
          '66.667%': { backgroundImage: 'linear-gradient(90deg,#ff4d4d,#f9cb28)' },
          '83.333%': { backgroundImage: 'linear-gradient(90deg,#ff4d4d,#f9cb28)' },
          '100%': { backgroundImage: 'linear-gradient(90deg,#007cf0,#00dfd8)' }
        },
        'animation-test': {
          '0%': { backgroundImage: 'linear-gradient(90deg,#007cf0,#00dfd8)' },
          '16.667%': { backgroundImage: 'linear-gradient(90deg,#007cf0,#00dfd8)' },
          '29%': { opacity: '1' },
          '30%': { opacity: '0' },
          '32%': { opacity: '1' },
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
        },
        spotlight: {
          '0%': {
            opacity: '0',
            transform: 'translate(-72%, -62%) scale(0.5)'
          },
          '100%': {
            opacity: '1',
            transform: 'translate(-50%,-40%) scale(1)'
          }
        }
      },
      animation: {
        'color-cycle-1': 'animation-title-1 10s ease-in-out infinite',
        'color-cycle-2': 'animation-title-2 10s ease-in-out infinite',
        'color-cycle-3': 'animation-title-3 10s ease-in-out infinite',
        'color-cycle-4': 'animation-button 12s ease-in-out infinite',
        'color-cycle-5': 'animation-title-4 12s ease-in-out infinite',
        'color-test': 'animation-test 12s ease-in-out infinite',
        spotlight: 'spotlight 2s ease .75s 1 forwards'
      }
    }
  },
  darkMode: 'class',
  plugins: [
    nextui()
  ]
}

export default config
