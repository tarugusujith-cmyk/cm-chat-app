import { Check } from 'lucide-react';

export default function Checkbox({ checked, onChange, ariaLabel }) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
        checked
          ? 'bg-brand-500 border-brand-500'
          : 'border-slate-300 dark:border-white/25 bg-white dark:bg-transparent'
      }`}
    >
      {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
    </button>
  );
}
