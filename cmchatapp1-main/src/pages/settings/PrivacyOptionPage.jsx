import { useParams } from 'react-router-dom';
import ListDetailLayout from '../../components/ListDetailLayout';
import ConversationDetailPane from '../../components/ConversationDetailPane';
import SettingsSubHeader from '../../components/SettingsSubHeader';
import RadioOption from '../../components/RadioOption';
import { usePreferences } from '../../context/PreferencesContext';

const OPTIONS = ['Everyone', 'My Contacts', 'Nobody'];

const CONFIG = {
  'last-seen': {
    title: 'Last Seen',
    caption: "If you don't share your Last Seen, you won't be able to see other people's Last Seen",
    prefKey: 'lastSeen',
  },
  'profile-photo': {
    title: 'Profile Photo',
    caption: 'Who can see my profile photo',
    prefKey: 'profilePhoto',
  },
  about: {
    title: 'About',
    caption: 'Who can see my about',
    prefKey: 'about',
  },
  groups: {
    title: 'Groups',
    caption: 'Who can add me to groups',
    prefKey: 'groups',
  },
};

export default function PrivacyOptionPage() {
  const { field } = useParams();
  const { privacy, setPrivacy } = usePreferences();
  const config = CONFIG[field];

  if (!config) {
    return (
      <ListDetailLayout
        listPanel={
          <>
            <SettingsSubHeader title="Privacy" backTo="/settings/privacy" />
            <p className="px-5 text-sm text-slate-400">Unknown setting.</p>
          </>
        }
        detailPanel={<ConversationDetailPane backTo="/settings/privacy" onStartNew={() => {}} />}
        showDetail={false}
      />
    );
  }

  const listPanel = (
    <>
      <SettingsSubHeader title={config.title} backTo="/settings/privacy" />
      <div className="flex-1 overflow-y-auto scroll-thin px-5">
        <p className="text-sm text-brand-500 mb-5 leading-relaxed">{config.caption}</p>
        <div className="divide-y divide-black/5 dark:divide-white/10">
          {OPTIONS.map((opt) => (
            <RadioOption
              key={opt}
              name={field}
              value={opt}
              label={opt}
              checked={privacy[config.prefKey] === opt}
              onChange={(v) => setPrivacy(config.prefKey, v)}
            />
          ))}
        </div>
      </div>
    </>
  );

  return (
    <ListDetailLayout
      listPanel={listPanel}
      detailPanel={<ConversationDetailPane backTo={`/settings/privacy/${field}`} onStartNew={() => {}} />}
      showDetail={false}
    />
  );
}
