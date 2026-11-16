"use client";

interface StepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** What one unit is called, for the button labels ("mesa"). */
  unit: string;
  id?: string;
}

export function Stepper({ value, onChange, min = 0, max = 999, step = 1, unit, id }: StepperProps) {
  const btn =
    "grid h-11 w-11 place-items-center rounded-full border border-line bg-ground text-xl leading-none transition-[transform,border-color,background-color] duration-150 hover:border-ink active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line";
  return (
    <div className="flex items-center gap-1.5" role="group" aria-labelledby={id}>
      <button type="button" className={btn} disabled={value <= min} onClick={() => onChange(Math.max(min, value - step))} aria-label={`Quitar ${step === 1 ? "una" : step} ${unit}`}>
        <span aria-hidden="true">−</span>
      </button>
      <output className="tabular min-w-[3.2ch] text-center text-lg font-medium" aria-live="polite">
        {value}
      </output>
      <button type="button" className={btn} disabled={value >= max} onClick={() => onChange(Math.min(max, value + step))} aria-label={`Agregar ${step === 1 ? "una" : step} ${unit}`}>
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}
