import { useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatDateLabel } from '../utils/time';
import MessageBubble from './MessageBubble';

function groupByDate(items) {
  const groups = [];
  for (const item of items) {
    const label = formatDateLabel(item.time);
    let group = groups.find((g) => g.label === label);
    if (!group) {
      group = { label, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}

export default function StarredMessagesView({ chatId, onBack }) {
  const { messagesByChat, getUser, currentUser, toggleStar } = useData();

  const starred = useMemo(
    () => messagesByChat(chatId).filter((m) => m.starred),
    [messagesByChat, chatId]
  );
  const groups = groupByDate(starred);

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-black/5 dark:border-white/5">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <p className="font-semibold text-sm">Starred Messages</p>
      </header>

      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 space-y-4">
        {starred.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-10">
            Star messages to keep track of important ones.
          </p>
        )}
        {groups.map((group) => (
          <div key={group.label} className="space-y-3">
            <p className="text-xs text-slate-400">{group.label}</p>
            {group.items.map((m) => {
              const isMine = m.senderId === currentUser.id;
              const sender = getUser(m.senderId);
              return (
                <MessageBubble
                  key={m.id}
                  message={m}
                  isMine={isMine}
                  senderName={sender?.name}
                  senderAvatar={sender?.avatar}
                  showAvatar
                  onReact={() => {}}
                  onToggleStar={toggleStar}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
