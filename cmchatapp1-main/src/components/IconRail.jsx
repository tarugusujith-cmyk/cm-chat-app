import { NavLink } from 'react-router-dom';
import { MessageCircle, Users, Phone, Settings, Zap, CircleDashed } from 'lucide-react';
import Avatar from './Avatar';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

const navItems = [
  { to: '/chats', icon: MessageCircle, label: 'Chats' },
  { to: '/updates', icon: CircleDashed, label: 'Updates' },
  { to: '/groups', icon: Users, label: 'Groups' },
  { to: '/calls', icon: Phone, label: 'Call log' },
];

export default function IconRail() {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useData();

  return (
    <nav className="hidden md:flex w-[76px] shrink-0 flex-col items-center bg-surface-rail dark:bg-[#161a2c] border-r border-black/5 dark:border-white/5 py-5">
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-soft mb-6">
        <Zap className="w-5 h-5 text-white" fill="white" strokeWidth={1.5} />
      </div>

      <div className="flex flex-col gap-2 w-full items-center">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            title={label}
            className={({ isActive }) =>
              `w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                isActive
                  ? 'bg-brand-500 text-white shadow-soft'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-brand-100/70 dark:hover:bg-white/5'
              }`
            }
          >
            <Icon className="w-5 h-5" strokeWidth={1.9} />
          </NavLink>
        ))}
      </div>

      <div className="w-8 border-t border-black/10 dark:border-white/10 my-4" />

      <NavLink
        to="/settings"
        aria-label="Settings"
        title="Settings"
        className={({ isActive }) =>
          `w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
            isActive
              ? 'bg-brand-500 text-white shadow-soft'
              : 'text-slate-500 dark:text-slate-400 hover:bg-brand-100/70 dark:hover:bg-white/5'
          }`
        }
      >
        <Settings className="w-5 h-5" strokeWidth={1.9} />
      </NavLink>

      <div className="flex-1" />

      <button
        role="switch"
        aria-checked={theme === 'dark'}
        aria-label="Toggle dark mode"
        onClick={toggleTheme}
        className={`relative w-11 h-6 rounded-full transition-colors mb-5 ${
          theme === 'dark' ? 'bg-brand-500' : 'bg-brand-200'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            theme === 'dark' ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>

      <NavLink to="/profile" aria-label="Your profile" title="Your profile">
        <Avatar src={currentUser?.avatar} name={currentUser?.name} size="md" />
      </NavLink>
    </nav>
  );
}
