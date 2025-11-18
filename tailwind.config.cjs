module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2B6CB0',
          secondary: '#1A202C',
          text: '#4A5568',
          bg: '#EDF2F7',
          accent: '#38B2AC',
          warn: '#F6AD55'
        }
      },
      fontFamily: {
        header: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        brand: '0.5rem'
      }
    }
  },
  plugins: []
};
