/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // `accent` é o único acento da identidade. Use `text-accent` / `bg-accent/5`
        // em vez de espalhar `orange-500` ou `#f97316` pelo JSX.
        accent: '#f97316',
        surface: '#09090b',
        panel: '#27272a',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flow: {
          '0%': { strokeDashoffset: '20' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        // `both`, não `forwards`: o atraso (animationDelay no JSX) precisa segurar o
        // keyframe 0% durante a espera. Com `forwards` o elemento aparece em opacidade
        // cheia antes de animar, o que exigia um `opacity-0` no JSX — e um H1 invisível
        // se a animação não rodasse.
        'fade-in': 'fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        flow: 'flow 1s linear infinite',
      },
    },
  },
  plugins: [],
}
