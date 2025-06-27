const config = {
    content: [
      './src/**/*.{js,ts,jsx,tsx}',
      './public/**/*.svg',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#3B82F6', // blue-500
            dark: '#2563EB',    // blue-600
          },
          secondary: {
            DEFAULT: '#8B5CF6', // violet-500
            dark: '#7C3AED',    // violet-600
          },
        },
        animation: {
          'fade-in-up': 'fade-in-up 0.8s cubic-bezier(0.4,0,0.2,1) both',
        },
        keyframes: {
          'fade-in-up': {
            '0%': { opacity: '0', transform: 'translateY(40px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
        },
        backdropBlur: {
          'xs': '2px',
        },
      },
    },
    plugins: [],
  };
  
  export default config;