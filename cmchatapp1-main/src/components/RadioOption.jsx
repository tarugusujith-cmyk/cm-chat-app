export default function RadioOption({ name, value, label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 py-3.5 cursor-pointer">
      <span className="relative w-5 h-5 shrink-0">
        <input
          type="radio"
          name={name}
          checked={checked}
          onChange={() => onChange(value)}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full border-2 border-slate-300 dark:border-white/25 peer-checked:border-brand-500" />
        <span
          className={`absolute inset-[4px] rounded-full transition-colors ${
            checked ? 'bg-brand-500' : 'bg-transparent'
          }`}
        />
      </span>
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}
