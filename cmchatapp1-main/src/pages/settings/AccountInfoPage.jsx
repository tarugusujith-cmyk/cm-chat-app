import { useState } from 'react';
import { ClipboardList, Check } from 'lucide-react';
import ListDetailLayout from '../../components/ListDetailLayout';
import ConversationDetailPane from '../../components/ConversationDetailPane';
import SettingsSubHeader from '../../components/SettingsSubHeader';
import { useData } from '../../context/DataContext';
import { usePreferences } from '../../context/PreferencesContext';

export default function AccountInfoPage() {
  const { currentUser, chats, calls } = useData();
  const preferences = usePreferences();
  const [done, setDone] = useState(false);

  const handleRequest = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      profile: currentUser,
      chatCount: chats.length,
      callCount: calls.length,
      settings: {
        notifications: preferences.notifications,
        privacy: preferences.privacy,
        wallpaper: preferences.wallpaper,
      },
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cm-chat-account-info.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  };

  const listPanel = (
    <>
      <SettingsSubHeader title="Request Account Info" />
      <div className="flex-1 overflow-y-auto scroll-thin px-6">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
        </div>

        <button
          onClick={handleRequest}
          className="w-full flex items-center justify-between gap-3 py-3.5 border-b border-black/5 dark:border-white/5 text-left"
        >
          <span className="text-sm font-medium">Request Report</span>
          {done && <Check className="w-4 h-4 text-online" />}
        </button>

        <p className="text-sm text-slate-400 mt-4 leading-relaxed">
          Create a report of your CM Chat account information and settings, which you can access or port
          to another app. This report does not include your messages.
        </p>
      </div>
    </>
  );

  return (
    <ListDetailLayout
      listPanel={listPanel}
      detailPanel={<ConversationDetailPane backTo="/settings/account-info" onStartNew={() => {}} />}
      showDetail={false}
    />
  );
}
