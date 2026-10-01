import { NavLink } from 'react-router-dom';
import { MessageCircle, Users, Phone, Settings, CircleDashed } from 'lucide-react';

const navItems = [
  { to: '/chats', icon: MessageCircle, label: 'Chats' },
  { to: '/updates', icon: CircleDashed, label: 'Updates' },
  { to: '/groups', icon: Users, label: 'Groups' },
  { to: '/calls', icon: Phone, label: 'Calls' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function MobileTabBar() {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-[#161a2c]/95 backdrop-blur border-t border-black/5 dark:border-white/10 flex items-stretch"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium ${
              isActive ? 'text-brand-500' : 'text-slate-400 dark:text-slate-500'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.9} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
