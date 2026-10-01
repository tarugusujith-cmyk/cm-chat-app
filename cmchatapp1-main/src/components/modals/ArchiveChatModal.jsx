import { useMemo, useState } from 'react';
import { Archive } from 'lucide-react';
import ModalShell from './ModalShell';
import SearchInput from '../SearchInput';
import Avatar from '../Avatar';
import { useData } from '../../context/DataContext';

export default function ArchiveChatModal({ onClose }) {
  const { chatsWithPreview, toggleArchive } = useData();
  const [query, setQuery] = useState('');

  // Direct chats that are not archived yet
  const candidates = useMemo(
    () =>
      chatsWithPreview
        .filter((c) => c.type === 'direct' && !c.archived)
        .filter((c) => c.title.toLowerCase().includes(query.toLowerCase())),
    [chatsWithPreview, query]
  );

  const handleSelect = async (chatId) => {
    await toggleArchive(chatId);
    onClose();
  };

  return (
    <ModalShell title="Archive a chat" onClose={onClose} width="max-w-lg">
      <SearchInput value={query} onChange={setQuery} placeholder="Search" autoFocus />
      <div className="mt-4 max-h-80 overflow-y-auto scroll-thin -mx-2">
        {candidates.map((c) => (
          <button
            key={c.id}
            onClick={() => handleSelect(c.id)}
            className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-white/5 text-left"
          >
            <Avatar src={c.avatar} name={c.title} online={c.online} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{c.title}</p>
              <p className="text-xs text-slate-400 truncate">{c.lastMessage}</p>
            </div>
            <Archive className="w-4 h-4 text-slate-300 shrink-0" />
          </button>
        ))}
        {candidates.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-6">
            {query ? 'No chats match your search.' : 'All your chats are already archived.'}
          </p>
        )}
      </div>
    </ModalShell>
  );
}
