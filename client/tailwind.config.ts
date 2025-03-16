import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    fontFamily: {
        display: ['Poppins', 'sans-serif'],
    },

    extend: {
        colors:{
            primary: "#05B6D3",
            secondary: "#EF863E", 
        }
    },
  },
  plugins: [],
}

export default config
