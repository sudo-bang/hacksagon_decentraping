/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      './app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#3B82F6', // blue-500
            dark: '#2563EB',    // blue-600
            light: '#60A5FA',   // blue-400
          },
          secondary: {
            DEFAULT: '#22C55E', // green-500
            dark: '#16A34A',    // green-600
            light: '#4ADE80',   // green-400
          },
          accent: {
            DEFAULT: '#EF4444', // red-500
            dark: '#DC2626',    // red-600
            light: '#F87171',   // red-400
            warning: '#F59E0B', // amber-500
          },
          background: {
            DEFAULT: '#0F1629', // main background
            light: '#1E293B',   // lighter section bg
            card: '#334155',    // cards and surfaces
          },
          surface: {
            DEFAULT: '#334155',
            light: '#475569',
            darker: '#1E293B',
          },
          text: {
            DEFAULT: '#FFFFFF',
            muted: '#94A3B8',
            disabled: '#64748B',
          },
          border: {
            DEFAULT: '#475569',
            light: '#64748B',
            dark: '#334155',
          },
          status: {
            success: '#22C55E',
            warning: '#F59E0B',
            error: '#EF4444',
            paused: '#EAB308',
          },
        },
      },
    },
    plugins: [],
  };
  
  
export default config;