import { Zap, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function MobileTopBar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="md:hidden flex items-center justify-between px-4 pt-4 pb-1">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-soft">
          <Zap className="w-4 h-4 text-white" fill="white" strokeWidth={1.5} />
        </div>
        <span className="font-bold text-lg">CM Chat</span>
      </div>
      <button
        aria-label="Toggle dark mode"
        onClick={toggleTheme}
        className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  );
}
