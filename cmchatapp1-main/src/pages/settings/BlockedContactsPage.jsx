import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import ListDetailLayout from '../../components/ListDetailLayout';
import ConversationDetailPane from '../../components/ConversationDetailPane';
import SettingsSubHeader from '../../components/SettingsSubHeader';
import Avatar from '../../components/Avatar';
import BlockNewContactModal from '../../components/modals/BlockNewContactModal';
import { useData } from '../../context/DataContext';

export default function BlockedContactsPage() {
  const { chats, getUser, getMeta, toggleBlock, currentUser } = useData();
  const [showBlockNew, setShowBlockNew] = useState(false);

  const blocked = chats
    .filter((c) => c.type === 'direct' && c.blocked)
    .map((c) => {
      const meta = getMeta(c);
      const other = getUser(c.participantIds.find((id) => id !== currentUser?.id));
      return { ...c, ...meta, about: other?.about };
    });

  const listPanel = (
    <>
      <SettingsSubHeader title="Blocked Contacts" backTo="/settings/privacy" />
      <div className="flex-1 overflow-y-auto scroll-thin px-2">
        <button
          onClick={() => setShowBlockNew(true)}
          className="flex items-center gap-2 px-3 mb-3 text-sm font-medium text-brand-500 hover:text-brand-600"
        >
          Block New Contact
          <Plus className="w-4 h-4" />
        </button>

        {blocked.length === 0 && (
          <p className="text-center text-sm text-slate-400 px-3 py-10">No blocked contacts.</p>
        )}
        {blocked.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-2xl mb-1.5 bg-white dark:bg-white/5"
          >
            <Avatar src={c.avatar} name={c.title} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{c.title}</p>
              <p className="text-xs text-slate-400 truncate">{c.about}</p>
            </div>
            <button
              onClick={() => toggleBlock(c.id)}
              aria-label={`Unblock ${c.title}`}
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      <ListDetailLayout
        listPanel={listPanel}
        detailPanel={<ConversationDetailPane backTo="/settings/privacy/blocked" onStartNew={() => {}} />}
        showDetail={false}
      />
      {showBlockNew && <BlockNewContactModal onClose={() => setShowBlockNew(false)} />}
    </>
  );
}
