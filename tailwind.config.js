/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
				'auth-gradient': 'linear-gradient(107deg, #1F177C 1.73%, #3BADB7 100.96%, #FFF 279.65%, #A2E5ED 279.65%)'
			},
      colors: {
        light: {
          10: '#616161',
          20: 'D4D4D4',
        },
        blue: {
          10: '#1414A0'
        },
        danger: '#EA5455',
        gray: {
          10: '#A3A3A3',
          20: '#DBDBDE',
          30: '#5A5B5E'
        },
        'background-main': '#D4D4D4',
        'body-text': '#5A5B5E',
        'primery-700': '#243c5a',
      }
    },
  },
  plugins: [],
  corePlugins: {
		preflight: false,
	},
}

