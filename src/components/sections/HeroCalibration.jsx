/* eslint-disable react/prop-types */
import { FiSettings } from "react-icons/fi";

/**
 * Painel de calibração em tempo real do fundo 3D. Controlado: recebe `params` e
 * devolve o objeto inteiro em `onChange` — o Hero é o dono do estado, o
 * ThreeCanvas recebe as 5 props. Recebe também `text` (o objeto de locale) e os
 * labels saem de lá.
 *
 * I18N: os labels eram em inglês hardcoded ("readouts de instrumento, não prosa") até
 * 2026-09-23, quando o dono pediu a tradução — não é mais uma exceção deliberada, e o
 * CLAUDE.md acompanhou. Os labels agora vivem em `pt.json`/`en.json` (chaves `calib*`);
 * aqui ficam só os números dos controles, que são neutros de idioma. Ao mexer num
 * label, mexa nos DOIS arquivos de locale — chave em um só renderiza vazio, sem erro.
 */
const SLIDERS = [
  // O topo do "Flux Dynamics" já foi 2,0 e caiu para 1,0 (2026-09-23) e depois para 0,8. Não é
  // gosto: é a parcela do contrato com o shader que fecha o pior caso da nuvem em 6,6 de mundo
  // (`5,4` do raio-base + `0,4` do empurrão do cursor + este topo), que é o que a guarda
  // `radiusWithinGap` reserva — e o teto dela é `folga / (cloudRatio − 1)`, então baixar este
  // número é o que torna a folga barata e deixa as ÓRBITAS maiores. Ver `CLOUD_BASE_RADIUS`,
  // `CURSOR_PUSH` e `SLIDER_MAX_DISTORTION` no ThreeCanvas.jsx — os três andam juntos, e o
  // padrão 0,6 fica a 75% da pista (mexer aqui mexe nos três).
  { key: "distortion", min: 0, max: 0.8, step: 0.1, showValue: true },
  { key: "detail", min: 0.1, max: 2.0, step: 0.1, showValue: true },
  { key: "speed", min: 0, max: 0.5, step: 0.01, showValue: false },
  { key: "opacity", min: 0.1, max: 1.0, step: 0.05, showValue: false },
];

const RangeControl = ({ control, label, value, onChange }) => {
  const inputId = `calib-${control.key}`;
  return (
    <div className="space-y-3">
      <div className="flex justify-between font-mono text-xs text-zinc-500">
        <label htmlFor={inputId}>{label}</label>
        {control.showValue ? <span className="text-zinc-300">{value}</span> : null}
      </div>
      <input
        id={inputId}
        type="range"
        min={control.min}
        max={control.max}
        step={control.step}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

const HeroCalibration = ({ params, onChange, text, className = "" }) => {
  const setKey = (key) => (event) =>
    onChange({ ...params, [key]: parseFloat(event.target.value) });

  // Os rótulos das bolinhas são só `aria-label` (a cor não é texto), mas são texto do
  // painel como os outros: vêm do locale.
  const swatches = [
    { value: "#f97316", label: text.calibColorOrange },
    { value: "#3b82f6", label: text.calibColorBlue },
    { value: "#10b981", label: text.calibColorGreen },
  ];

  return (
    // `flex flex-col` — a direção é CORREÇÃO DE BUG, não estilo. O template ligava o
    // painel com `lg:flex` sem direção declarada, e a partir de 1024px ele virava
    // `flex-direction: row`: barra de título e corpo lado a lado dentro da caixa de
    // 280px, transbordando a moldura de vidro e sendo cortado pelo `overflow-hidden`
    // do Hero. (flowforge-saas-1/src/components/Hero.jsx:75, onde o `lg:flex` estava
    // num wrapper de 3 filhos e a direção row fazia sentido.)
    //
    // O `display` agora é declarado aqui, sem `hidden`: quem esconde o painel abaixo de
    // lg é o wrapper no Hero, que carrega `data-hero-occupied` e por isso precisa medir
    // 0×0 nessa faixa. Aqui dentro `hidden` e `flex` brigariam por ordem no CSS gerado.
    <div
      role="group"
      aria-label={text.calibTitle}
      className={`tech-glass flex w-[280px] flex-col rounded-xl border-white/10 ${className}`}
    >
      <div className="flex items-center justify-between rounded-t-xl border-b border-white/5 bg-white/[0.02] px-5 py-3">
        <span className="font-mono text-xs text-zinc-200">{text.calibTitle}</span>
        <FiSettings strokeWidth={1.5} className="text-zinc-500" />
      </div>

      <div className="space-y-6 p-5">
        <RangeControl
          control={SLIDERS[0]}
          label={text.calibDistortion}
          value={params.distortion}
          onChange={setKey("distortion")}
        />
        <RangeControl
          control={SLIDERS[1]}
          label={text.calibThreads}
          value={params.detail}
          onChange={setKey("detail")}
        />

        <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-3">
          <RangeControl
            control={SLIDERS[2]}
            label={text.calibClock}
            value={params.speed}
            onChange={setKey("speed")}
          />
          <RangeControl
            control={SLIDERS[3]}
            label={text.calibDensity}
            value={params.opacity}
            onChange={setKey("opacity")}
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <span className="font-mono text-xs text-zinc-500">{text.calibEnergy}</span>
          <div role="group" aria-label={text.calibEnergy} className="flex gap-2">
            {swatches.map((swatch) => {
              const isActive = params.color === swatch.value;
              return (
                <button
                  key={swatch.value}
                  type="button"
                  onClick={() => onChange({ ...params, color: swatch.value })}
                  aria-label={swatch.label}
                  aria-pressed={isActive}
                  style={{ backgroundColor: swatch.value }}
                  className={`h-3.5 w-3.5 cursor-pointer rounded-full transition-[box-shadow,transform] duration-200 ease-out-expo focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b] ${
                    isActive
                      ? "ring-1 ring-white/50 ring-offset-2 ring-offset-[#09090b]"
                      : "hover:scale-110 hover:ring-1 hover:ring-white/50 hover:ring-offset-2 hover:ring-offset-[#09090b]"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCalibration;
