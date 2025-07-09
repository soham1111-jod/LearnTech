module.exports = {
  content: ["./index.html", './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
    }
  },
  plugins: []
}

// tailwind.config.js
  // module.exports = {
  //   theme: {
  //     extend: {
  //       animation: {
  //         'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
  //         'star-movement-top': 'star-movement-top linear infinite alternate',
  //       },
  //       keyframes: {
  //         'star-movement-bottom': {
  //           '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
  //           '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
  //         },
  //         'star-movement-top': {
  //           '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
  //           '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
  //         },
  //       },
  //     },
  //   }
  // }