import { Fingerprint } from 'lucide-react';
import ListDetailLayout from '../../components/ListDetailLayout';
import ConversationDetailPane from '../../components/ConversationDetailPane';
import SettingsSubHeader from '../../components/SettingsSubHeader';

const LINKS = ['Help Center', 'Contact Us', 'Licenses', 'Terms and Privacy Policy'];

export default function HelpPage() {
  const listPanel = (
    <>
      <SettingsSubHeader title="Help" />
      <div className="flex-1 overflow-y-auto scroll-thin px-6">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-brand-500 flex items-center justify-center">
            <Fingerprint className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
        </div>

        <div className="divide-y divide-black/5 dark:divide-white/5">
          {LINKS.map((label) => (
            <button
              key={label}
              className="w-full text-left py-3.5 text-sm font-medium hover:text-brand-500"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <ListDetailLayout
      listPanel={listPanel}
      detailPanel={<ConversationDetailPane backTo="/settings/help" onStartNew={() => {}} />}
      showDetail={false}
    />
  );
}
