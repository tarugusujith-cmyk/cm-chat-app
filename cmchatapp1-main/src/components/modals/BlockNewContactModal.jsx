import { useMemo, useState } from 'react';
import ModalShell from './ModalShell';
import SearchInput from '../SearchInput';
import Avatar from '../Avatar';
import { useData } from '../../context/DataContext';

export default function BlockNewContactModal({ onClose }) {
  const { users, currentUser, chats, startDirectChat, toggleBlock } = useData();
  const [query, setQuery] = useState('');

  const blockedUserIds = useMemo(
    () =>
      new Set(
        chats
          .filter((c) => c.type === 'direct' && c.blocked)
          .map((c) => c.participantIds.find((id) => id !== currentUser?.id))
      ),
    [chats, currentUser]
  );

  const candidates = useMemo(
    () =>
      users.filter(
        (u) =>
          u.id !== currentUser?.id &&
          !blockedUserIds.has(u.id) &&
          u.name.toLowerCase().includes(query.toLowerCase())
      ),
    [users, currentUser, query, blockedUserIds]
  );

  const handleBlock = async (userId) => {
    const chat = await startDirectChat(userId);
    await toggleBlock(chat.id);
    onClose();
  };

  return (
    <ModalShell title="Block New Contact" onClose={onClose} width="max-w-lg">
      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search" autoFocus />
      </div>
      <div className="max-h-96 overflow-y-auto scroll-thin -mx-2">
        {candidates.map((u) => (
          <button
            key={u.id}
            onClick={() => handleBlock(u.id)}
            className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-white/5 text-left"
          >
            <Avatar src={u.avatar} name={u.name} />
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{u.name}</p>
              <p className="text-xs text-slate-400 truncate">{u.about}</p>
            </div>
          </button>
        ))}
        {candidates.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-6">No contacts found.</p>
        )}
      </div>
    </ModalShell>
  );
}
