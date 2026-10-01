import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Bell,
  Lock,
  KeyRound,
  Palette,
  Image as ImageIcon,
  ClipboardList,
  AlignLeft,
  CircleHelp,
} from 'lucide-react';
import ListDetailLayout from '../components/ListDetailLayout';
import ConversationDetailPane from '../components/ConversationDetailPane';
import Avatar from '../components/Avatar';
import ThemeModal from '../components/modals/ThemeModal';
import KeyboardShortcutsModal from '../components/modals/KeyboardShortcutsModal';
import { useData } from '../context/DataContext';

export default function SettingsPage() {
  const { currentUser } = useData();
  const navigate = useNavigate();
  const [showTheme, setShowTheme] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const ROWS = [
    { icon: Bell, label: 'Notifications', to: '/settings/notifications' },
    { icon: Lock, label: 'Privacy', to: '/settings/privacy' },
    { icon: KeyRound, label: 'Security', to: '/settings/security' },
    { icon: Palette, label: 'Theme', onClick: () => setShowTheme(true) },
    { icon: ImageIcon, label: 'Chat Wallpaper', to: '/settings/wallpaper' },
    { icon: ClipboardList, label: 'Request Account Info', to: '/settings/account-info' },
    { icon: AlignLeft, label: 'Keyboard shortcuts', onClick: () => setShowShortcuts(true) },
    { icon: CircleHelp, label: 'Help', to: '/settings/help' },
  ];

  const listPanel = (
    <>
      <div className="px-5 pt-3 pb-4">
        <h1 className="text-[26px] font-bold">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin pb-6">
        <button
          onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-3 px-5 py-3 mb-2 text-left hover:bg-black/[0.02] dark:hover:bg-white/5"
        >
          <Avatar src={currentUser?.avatar} name={currentUser?.name} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{currentUser?.name}</p>
            <p className="text-sm text-slate-400 truncate">{currentUser?.about || 'Exploring'}</p>
          </div>
        </button>

        <div className="divide-y divide-black/5 dark:divide-white/10">
          {ROWS.map(({ icon: Icon, label, to, onClick }) =>
            to ? (
              <NavLink
                key={label}
                to={to}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-black/[0.02] dark:hover:bg-white/5"
              >
                <Icon className="w-[18px] h-[18px] text-slate-400" />
                <span className="flex-1 text-sm font-medium">{label}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </NavLink>
            ) : (
              <button
                key={label}
                onClick={onClick}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-black/[0.02] dark:hover:bg-white/5"
              >
                <Icon className="w-[18px] h-[18px] text-slate-400" />
                <span className="flex-1 text-sm font-medium">{label}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
            )
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">CM Chat · v1.0.0</p>
      </div>
    </>
  );

  return (
    <>
      <ListDetailLayout
        listPanel={listPanel}
        detailPanel={<ConversationDetailPane backTo="/settings" onStartNew={() => {}} />}
        showDetail={false}
      />
      {showTheme && <ThemeModal onClose={() => setShowTheme(false)} />}
      {showShortcuts && <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </>
  );
}
