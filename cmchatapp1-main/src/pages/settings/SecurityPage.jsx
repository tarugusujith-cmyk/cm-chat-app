import { Lock, MessageCircle, Phone, Link2, MapPin, CircleDashed } from 'lucide-react';
import ListDetailLayout from '../../components/ListDetailLayout';
import ConversationDetailPane from '../../components/ConversationDetailPane';
import SettingsSubHeader from '../../components/SettingsSubHeader';

const ITEMS = [
  { icon: MessageCircle, label: 'Text and voice messages' },
  { icon: Phone, label: 'Audio & Video Calls' },
  { icon: Link2, label: 'Photos, videos & documents' },
  { icon: MapPin, label: 'Location Sharing' },
  { icon: CircleDashed, label: 'Status Updates' },
];

export default function SecurityPage() {
  const listPanel = (
    <>
      <SettingsSubHeader title="Security" />
      <div className="flex-1 overflow-y-auto scroll-thin px-6">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>

        <h2 className="text-center font-semibold mb-2">Your Chats and calls are private</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8 leading-relaxed">
          End-to-end encryption keeps your personal messages &amp; calls between you and the person you
          choose to communicate with. Not even CM Chat can read or listen to them. This includes your
        </p>

        <div className="space-y-5">
          {ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <ListDetailLayout
      listPanel={listPanel}
      detailPanel={<ConversationDetailPane backTo="/settings/security" onStartNew={() => {}} />}
      showDetail={false}
    />
  );
}
