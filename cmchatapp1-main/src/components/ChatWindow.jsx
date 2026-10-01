import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronDown, Video, Phone, Search } from 'lucide-react';
import Avatar from './Avatar';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import SearchInput from './SearchInput';
import CallOverlay from './CallOverlay';
import ContactInfoPanel from './ContactInfoPanel';
import { useData } from '../context/DataContext';
import { usePreferences } from '../context/PreferencesContext';
import { dayLabel } from '../utils/time';

export default function ChatWindow({ chat, onBack }) {
  const { messagesByChat, sendMessage, toggleReaction, toggleStar, getUser, markChatRead, logCall, currentUser } =
    useData();
  const { wallpaper } = usePreferences();
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);
  const [activeCall, setActiveCall] = useState(null); // null | 'audio' | 'video'
  const bottomRef = useRef(null);

  const messages = useMemo(() => (chat ? messagesByChat(chat.id) : []), [chat, messagesByChat]);

  const visibleMessages = useMemo(() => {
    if (!query.trim()) return messages;
    return messages.filter(
      (m) => m.type === 'text' && m.text.toLowerCase().includes(query.toLowerCase())
    );
  }, [messages, query]);

  useEffect(() => {
    if (chat) markChatRead(chat.id);
  }, [chat?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length, chat?.id]);

  if (!chat) return null;

  const otherId =
    chat.type === 'direct'
      ? chat.participantIds.find((pid) => pid !== currentUser.id)
      : chat.participantIds[1];
  const otherUser = getUser(otherId);

  const handleSend = (text) => sendMessage(chat.id, { type: 'text', text });
  const handleSendFile = (file) => {
    const isImage = file.type.startsWith('image/');
    if (isImage) {
      const url = URL.createObjectURL(file);
      sendMessage(chat.id, { type: 'image', fileUrl: url });
    } else {
      const sizeKb = (file.size / 1024).toFixed(0);
      sendMessage(chat.id, { type: 'file', fileName: file.name, fileSize: `${sizeKb} KB` });
    }
  };

  const handleHangUp = (seconds) => {
    logCall(otherId, activeCall, seconds > 0 ? 'answered' : 'missed');
    setActiveCall(null);
  };

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      {activeCall && otherUser && (
        <CallOverlay kind={activeCall} caller={currentUser} callee={otherUser} onHangUp={handleHangUp} />
      )}
      <div className={`flex flex-col h-full flex-1 min-w-0 ${infoOpen ? 'hidden md:flex' : 'flex'}`}>
      <header className="flex items-center gap-3 px-4 sm:px-6 py-3.5 border-b border-black/5 dark:border-white/5 bg-surface-panel dark:bg-[#12162a]">
        <button
          onClick={onBack}
          className="md:hidden w-8 h-8 -ml-1 flex items-center justify-center rounded-full text-slate-500 hover:bg-black/5"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setInfoOpen(true)}
          className="flex items-center gap-3 flex-1 min-w-0 text-left"
        >
          <Avatar src={chat.avatar} name={chat.title} online={chat.type === 'direct' && chat.online} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{chat.title}</p>
            <p className="text-xs text-slate-400 truncate">{chat.subtitle}</p>
          </div>
        </button>
        <div className="flex items-center gap-1 sm:gap-2 text-slate-400">
          <button
            onClick={() => setActiveCall('video')}
            aria-label="Video call"
            className="w-9 h-9 hidden sm:flex items-center justify-center rounded-full hover:bg-brand-50 dark:hover:bg-white/5 hover:text-brand-500"
          >
            <Video className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveCall('audio')}
            aria-label="Voice call"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-brand-50 dark:hover:bg-white/5 hover:text-brand-500"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSearch((s) => !s)}
            aria-label="Search in conversation"
            className={`w-9 h-9 flex items-center justify-center rounded-full hover:bg-brand-50 dark:hover:bg-white/5 hover:text-brand-500 ${
              showSearch ? 'bg-brand-50 text-brand-500 dark:bg-white/10' : ''
            }`}
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setInfoOpen((s) => !s)}
            aria-label="More"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-brand-50 dark:hover:bg-white/5 hover:text-brand-500"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${infoOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </header>

      {showSearch && (
        <div className="px-4 sm:px-6 py-2.5 border-b border-black/5 dark:border-white/5 bg-surface-panel dark:bg-[#12162a] animate-fade-in">
          <SearchInput value={query} onChange={setQuery} placeholder="Search in conversation" autoFocus />
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto scroll-thin px-4 sm:px-8 py-5 space-y-4"
        style={
          wallpaper.color
            ? {
                backgroundColor: wallpaper.color,
                backgroundImage: wallpaper.doodle
                  ? 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)'
                  : undefined,
                backgroundSize: wallpaper.doodle ? '18px 18px' : undefined,
              }
            : undefined
        }
      >
        {visibleMessages.length === 0 && (
          <p className="text-center text-sm text-slate-400 mt-10">
            {query ? 'No messages match your search.' : 'No messages yet — say hi 👋'}
          </p>
        )}
        {groupByDay(visibleMessages).map((group) => (
          <div key={group.label} className="space-y-4">
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-black/5 dark:bg-white/10" />
              <span className="text-xs text-slate-400">{group.label}</span>
              <div className="flex-1 h-px bg-black/5 dark:bg-white/10" />
            </div>
            {group.items.map((m, idx) => {
              const isMine = m.senderId === currentUser.id;
              const sender = getUser(m.senderId);
              const prev = group.items[idx - 1];
              const showAvatar = !prev || prev.senderId !== m.senderId;
              return (
                <MessageBubble
                  key={m.id}
                  message={m}
                  isMine={isMine}
                  senderName={sender?.name}
                  senderAvatar={sender?.avatar}
                  showAvatar={showAvatar}
                  onReact={toggleReaction}
                  onToggleStar={toggleStar}
                />
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {chat.blocked ? (
        <div className="px-4 sm:px-6 py-3.5 border-t border-black/5 dark:border-white/5 bg-surface-panel dark:bg-[#12162a] text-center text-sm text-slate-400">
          You blocked this contact
        </div>
      ) : (
        <MessageInput onSend={handleSend} onSendFile={handleSendFile} />
      )}
      </div>

      {infoOpen && (
        <ContactInfoPanel chat={chat} onClose={() => setInfoOpen(false)} onCall={setActiveCall} />
      )}
    </div>
  );
}

function groupByDay(messages) {
  const groups = [];
  for (const m of messages) {
    const label = dayLabel(m.time);
    let group = groups.find((g) => g.label === label);
    if (!group) {
      group = { label, items: [] };
      groups.push(group);
    }
    group.items.push(m);
  }
  return groups;
}
