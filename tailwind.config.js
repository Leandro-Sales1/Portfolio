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
      // A curva do `fade-in` promovida a token, para os hovers pararem de usar o
      // `ease` default do navegador. Vira `ease-out-expo`.
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
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
  plugins: [
    // GUARDA DE TOQUE — sobrescreve o variant core `hover` para exigir ponteiro real.
    //
    // Sem isto, `hover:` casa também em telas touch: no toque o navegador aplica o
    // estado `:hover` e ele fica GRUDADO até o próximo toque em outro lugar. O caso
    // ruim era `group-hover:scale-*` na imagem do card de projeto (card travado
    // ampliado) e `group-hover:translate-x-*` no ícone do botão.
    //
    // Sobrescrever aqui, e não com `md:hover:` em 16 lugares, porque `md:` é largura —
    // um tablet de 1024px com toque continuaria quebrando. `pointer: fine` é a
    // capacidade real que o efeito exige. Mesmo critério que o ThreeCanvas já usa
    // (`matchMedia("(hover: none)")`, ThreeCanvas.jsx:227).
    //
    // Consequência a ter em conta: em notebook com tela touch, o `pointer: fine` do
    // mouse primário mantém os hovers funcionando.
    //
    // `group-hover` é um variant core SEPARADO e precisa da mesma sobrescrita — sem
    // ela, `group-hover:scale-*` na imagem do card de projeto continua grudando no
    // toque, que é justamente o pior caso. Confirmado no CSS gerado: o `hover` sozinho
    // guarda 15 regras e deixa as 4 de `group-hover` para trás.
    ({ addVariant }) => {
      const pointer = "@media (hover: hover) and (pointer: fine)";
      addVariant("hover", `${pointer} { &:hover }`);
      addVariant("group-hover", `${pointer} { .group:hover & }`);
    },
  ],
}
