import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Search', autoFocus, rightSlot }) {
  return (
    <div className="flex items-center gap-2 bg-brand-50 dark:bg-white/5 rounded-xl px-3.5 py-2.5">
      <Search className="w-4 h-4 text-brand-400 shrink-0" />
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none text-sm w-full placeholder:text-brand-400 text-slate-700 dark:text-slate-100"
      />
      {rightSlot}
    </div>
  );
}
