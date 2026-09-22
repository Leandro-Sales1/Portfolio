/* eslint-disable react/prop-types */
import { FiSettings } from "react-icons/fi";

/**
 * Painel de calibração em tempo real do fundo 3D. Controlado: recebe `params` e
 * devolve o objeto inteiro em `onChange` — o Hero é o dono do estado, o
 * ThreeCanvas recebe as 5 props.
 *
 * EXCEÇÃO DELIBERADA DE I18N: os labels abaixo ficam em inglês e hardcoded. São
 * readouts de instrumento, não prosa — em ferramenta real são idênticos nos dois
 * idiomas, e traduzir faria o painel parecer traduzido. Não "conserte" isto sem
 * falar com o dono do projeto. (Ver CLAUDE.md.)
 */
const SLIDERS = [
  { key: "distortion", label: "Flux Dynamics", min: 0, max: 2.0, step: 0.1, showValue: true },
  { key: "detail", label: "Processing Threads", min: 0.1, max: 2.0, step: 0.1, showValue: true },
  { key: "speed", label: "Clock Rate", min: 0, max: 0.5, step: 0.01, showValue: false },
  { key: "opacity", label: "Density", min: 0.1, max: 1.0, step: 0.05, showValue: false },
];

const SWATCHES = [
  { value: "#f97316", label: "Orange" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#10b981", label: "Green" },
];

const RangeControl = ({ control, value, onChange }) => {
  const inputId = `calib-${control.key}`;
  return (
    <div className="space-y-3">
      <div className="flex justify-between font-mono text-xs text-zinc-500">
        <label htmlFor={inputId}>{control.label}</label>
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

const HeroCalibration = ({ params, onChange, className = "" }) => {
  const setKey = (key) => (event) =>
    onChange({ ...params, [key]: parseFloat(event.target.value) });

  return (
    <div
      role="group"
      aria-label="System Calibration"
      className={`tech-glass w-[280px] items-center rounded-xl border-white/10 ${className}`}
    >
      <div className="flex items-center justify-between rounded-t-xl border-b border-white/5 bg-white/[0.02] px-5 py-3">
        <span className="font-mono text-xs text-zinc-200">System Calibration</span>
        <FiSettings strokeWidth={1.5} className="text-zinc-500" />
      </div>

      <div className="space-y-6 p-5">
        <RangeControl
          control={SLIDERS[0]}
          value={params.distortion}
          onChange={setKey("distortion")}
        />
        <RangeControl control={SLIDERS[1]} value={params.detail} onChange={setKey("detail")} />

        <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-3">
          <RangeControl control={SLIDERS[2]} value={params.speed} onChange={setKey("speed")} />
          <RangeControl control={SLIDERS[3]} value={params.opacity} onChange={setKey("opacity")} />
        </div>

        <div className="flex items-center justify-between pt-4">
          <span className="font-mono text-xs text-zinc-500">Energy Profile</span>
          <div role="group" aria-label="Energy Profile" className="flex gap-2">
            {SWATCHES.map((swatch) => {
              const isActive = params.color === swatch.value;
              return (
                <button
                  key={swatch.value}
                  type="button"
                  onClick={() => onChange({ ...params, color: swatch.value })}
                  aria-label={swatch.label}
                  aria-pressed={isActive}
                  style={{ backgroundColor: swatch.value }}
                  className={`h-3.5 w-3.5 rounded-full transition-all ${
                    isActive
                      ? "ring-1 ring-white/50 ring-offset-2 ring-offset-[#09090b]"
                      : "hover:ring-1 hover:ring-white/50 hover:ring-offset-2 hover:ring-offset-[#09090b]"
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
