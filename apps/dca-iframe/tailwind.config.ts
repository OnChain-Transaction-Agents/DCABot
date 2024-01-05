import type { Config } from 'tailwindcss'
const plugin = require('tailwindcss/plugin')

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '460px'
      },
      // backgroundImage: {
      //   'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      //   'gradient-conic':
      //     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      // },
      textShadow: {
        default: '0 0 5px rgba(140, 230, 255, 0.8), 0 0 10px rgba(140, 230, 255, 0.8)',
        md: '0 0 10px rgba(140, 230, 255, 0.9), 0 0 20px rgba(140, 230, 255, 0.9)',
        lg: '0 0 15px rgba(140, 230, 255, 1), 0 0 30px rgba(140, 230, 255, 1)',
      },

    },
  },
  plugins: [
    plugin(function ({ addUtilities, e, theme }:{ addUtilities: any, e: any, theme: any }) {
      const textShadows = theme('textShadow');
      const utilities = Object.entries(textShadows).map(([key, value]) => {
        return {
          [`.${e(`text-shadow-${key}`)}`]: {
            textShadow: value,
          },
        };
      });

      addUtilities(utilities, ['responsive', 'hover']);
    }),
  ],
}
export default config
