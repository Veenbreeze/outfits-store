import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: { colors: { ink: '#141414', cream: '#ece6dc', paper: '#f7f4ef', accent: '#24324f', sale: '#9a4a32' } } },
  plugins: [],
} satisfies Config;
