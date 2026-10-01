import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ListDetailLayout from '../../components/ListDetailLayout';
import ConversationDetailPane from '../../components/ConversationDetailPane';
import SettingsSubHeader from '../../components/SettingsSubHeader';
import Checkbox from '../../components/Checkbox';
import { usePreferences } from '../../context/PreferencesContext';
import { useData } from '../../context/DataContext';

function LinkRow({ to, label, value }) {
  return (
    <NavLink
      to={to}
      className="w-full flex items-center justify-between gap-3 px-5 py-3.5 border-b border-black/5 dark:border-white/5 text-left hover:bg-black/[0.02] dark:hover:bg-white/5"
    >
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{value}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300" />
    </NavLink>
  );
}

export default function PrivacyPage() {
  const { privacy, setPrivacy } = usePreferences();
  const { chats } = useData();
  const navigate = useNavigate();

  const blockedCount = chats.filter((c) => c.blocked).length;

  const listPanel = (
    <>
      <SettingsSubHeader title="Privacy" />
      <div className="flex-1 overflow-y-auto scroll-thin">
        <LinkRow to="/settings/privacy/last-seen" label="Last Seen" value={privacy.lastSeen} />
        <LinkRow to="/settings/privacy/profile-photo" label="Profile Photo" value={privacy.profilePhoto} />
        <LinkRow to="/settings/privacy/about" label="About" value={privacy.about} />

        <div className="flex items-start justify-between gap-3 px-5 py-3.5 border-b border-black/5 dark:border-white/5">
          <div>
            <p className="text-sm font-medium">Read receipts</p>
            <p className="text-xs text-slate-400 mt-0.5">
              If turned off, you won't send or receive read receipts. Read receipts are always sent for
              group chats.
            </p>
          </div>
          <Checkbox
            checked={privacy.readReceipts}
            onChange={(v) => setPrivacy('readReceipts', v)}
            ariaLabel="Read receipts"
          />
        </div>

        <LinkRow to="/settings/privacy/groups" label="Groups" value={privacy.groups} />

        <button
          onClick={() => navigate('/settings/privacy/blocked')}
          className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-black/[0.02] dark:hover:bg-white/5"
        >
          <div>
            <p className="text-sm font-medium">Blocked contacts</p>
            <p className="text-xs text-slate-400 mt-0.5">{blockedCount}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </button>
      </div>
    </>
  );

  return (
    <ListDetailLayout
      listPanel={listPanel}
      detailPanel={<ConversationDetailPane backTo="/settings/privacy" onStartNew={() => {}} />}
      showDetail={false}
    />
  );
}
