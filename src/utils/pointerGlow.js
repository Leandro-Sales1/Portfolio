/**
 * Escreve as custom properties que alimentam o hover rico — `--mx`/`--my` (posição do
 * spotlight, lidas por `.pointer-glow`) e `--rx`/`--ry`/`--lift` (tilt e elevação,
 * lidos por `.card-tilt`). As duas classes estão em `src/index.css`.
 *
 * Escreve direto no DOM em vez de ir por `useState`: um `setState` a cada
 * `pointermove` re-renderizaria a árvore de cards inteira dezenas de vezes por
 * segundo. Aqui o React não é notificado — de propósito.
 *
 * Não há listener global nem cleanup: vai como `onPointerMove` no próprio elemento.
 * Isso também torna impossível vazar listener, que era o risco do jeito "document"
 * usado no ThreeCanvas.
 *
 * A guarda de toque é `pointerType`, não uma media query: no toque o navegador
 * dispara `pointermove` durante o arrasto, e sem isto o card ficaria tiltado depois
 * do gesto. `(hover: hover)` do CSS cobre o resto do efeito.
 */
export const setPointerGlow = (event) => {
  if (event.pointerType !== "mouse") return;

  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  el.style.setProperty("--mx", `${x}px`);
  el.style.setProperty("--my", `${y}px`);
  // ±2deg: acima disso o texto do card começa a serrilhar em telas comuns.
  el.style.setProperty("--rx", `${((y / rect.height - 0.5) * -4).toFixed(2)}deg`);
  el.style.setProperty("--ry", `${((x / rect.width - 0.5) * 4).toFixed(2)}deg`);
  el.style.setProperty("--lift", "-4px");
};

/**
 * Zera o tilt e a elevação na saída do ponteiro. Sem isto, o card fica torto depois
 * de o mouse sair — o `:hover` do CSS sai, mas as custom properties ficam.
 */
export const clearPointerGlow = (event) => {
  const el = event.currentTarget;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
  el.style.setProperty("--lift", "0px");
};
