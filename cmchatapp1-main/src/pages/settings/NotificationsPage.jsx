import ListDetailLayout from '../../components/ListDetailLayout';
import ConversationDetailPane from '../../components/ConversationDetailPane';
import SettingsSubHeader from '../../components/SettingsSubHeader';
import Checkbox from '../../components/Checkbox';
import { usePreferences } from '../../context/PreferencesContext';

const ROWS = [
  { key: 'notifications', label: 'Notifications', desc: 'Show notifications for new messages' },
  { key: 'showPreviews', label: 'Show Previews' },
  { key: 'reactionNotifications', label: 'Show Reaction Notifications' },
  { key: 'incomingCallRingtone', label: 'Incoming call ringtone' },
  { key: 'sounds', label: 'Sounds', desc: 'Play sounds for incoming messages' },
];

export default function NotificationsPage() {
  const { notifications, setNotification } = usePreferences();

  const listPanel = (
    <>
      <SettingsSubHeader title="Notifications" />
      <div className="flex-1 overflow-y-auto scroll-thin">
        {ROWS.map(({ key, label, desc }) => (
          <div
            key={key}
            className="flex items-start justify-between gap-3 px-5 py-3.5 border-b border-black/5 dark:border-white/5"
          >
            <div>
              <p className="text-sm font-medium">{label}</p>
              {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
            </div>
            <Checkbox
              checked={!!notifications[key]}
              onChange={(v) => setNotification(key, v)}
              ariaLabel={label}
            />
          </div>
        ))}
      </div>
    </>
  );

  return (
    <ListDetailLayout
      listPanel={listPanel}
      detailPanel={<ConversationDetailPane backTo="/settings/notifications" onStartNew={() => {}} />}
      showDetail={false}
    />
  );
}
