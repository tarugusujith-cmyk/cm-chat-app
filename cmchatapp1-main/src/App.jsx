import { Navigate, Route, Routes } from 'react-router-dom';
import { RefreshCw, WifiOff } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';
import { ActiveChatProvider } from './context/ActiveChatContext';
import { PreferencesProvider } from './context/PreferencesContext';
import IconRail from './components/IconRail';
import ChatsPage from './pages/ChatsPage';
import GroupsPage from './pages/GroupsPage';
import CallLogPage from './pages/CallLogPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import UpdatesPage from './pages/UpdatesPage';
import NotificationsPage from './pages/settings/NotificationsPage';
import PrivacyPage from './pages/settings/PrivacyPage';
import PrivacyOptionPage from './pages/settings/PrivacyOptionPage';
import BlockedContactsPage from './pages/settings/BlockedContactsPage';
import SecurityPage from './pages/settings/SecurityPage';
import WallpaperPage from './pages/settings/WallpaperPage';
import AccountInfoPage from './pages/settings/AccountInfoPage';
import HelpPage from './pages/settings/HelpPage';

export default function App() {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <DataProvider>
          <ActiveChatProvider>
            <Shell />
          </ActiveChatProvider>
        </DataProvider>
      </PreferencesProvider>
    </ThemeProvider>
  );
}

function Shell() {
  const { loading, error, reload } = useData();

  if (loading) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-brand-500" />
        <p className="text-sm">Loading conversations…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center gap-3 text-center px-6">
        <WifiOff className="w-8 h-8 text-missed" />
        <p className="font-semibold">Can't reach the API</p>
        <p className="text-sm text-slate-400 max-w-sm">
          {error} Make sure json-server is running — try{' '}
          <code className="bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">npm run dev:all</code>{' '}
          instead of <code className="bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">npm run dev</code>.
        </p>
        <button
          onClick={reload}
          className="bg-brand-500 text-white rounded-xl px-5 py-2 text-sm font-medium mt-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full flex overflow-hidden">
      <IconRail />
      <Routes>
        <Route path="/" element={<Navigate to="/chats" replace />} />
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/chats/:id" element={<ChatsPage />} />
        <Route path="/updates" element={<UpdatesPage />} />
        <Route path="/updates/:id" element={<UpdatesPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/:id" element={<GroupsPage />} />
        <Route path="/calls" element={<CallLogPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/notifications" element={<NotificationsPage />} />
        <Route path="/settings/privacy" element={<PrivacyPage />} />
        <Route path="/settings/privacy/blocked" element={<BlockedContactsPage />} />
        <Route path="/settings/privacy/:field" element={<PrivacyOptionPage />} />
        <Route path="/settings/security" element={<SecurityPage />} />
        <Route path="/settings/wallpaper" element={<WallpaperPage />} />
        <Route path="/settings/account-info" element={<AccountInfoPage />} />
        <Route path="/settings/help" element={<HelpPage />} />
        <Route path="*" element={<Navigate to="/chats" replace />} />
      </Routes>
    </div>
  );
}
