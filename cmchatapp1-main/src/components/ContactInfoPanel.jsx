import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Video, Phone, ChevronRight, Star, Bell, Shield, Trash2, LogOut, FileText, Archive, Pin } from 'lucide-react';
import Avatar from './Avatar';
import AttachmentsView from './AttachmentsView';
import StarredMessagesView from './StarredMessagesView';
import { useData } from '../context/DataContext';
import { useActiveChat } from '../context/ActiveChatContext';

export default function ContactInfoPanel({ chat, onClose, onCall }) {
  const { getUser, commonGroups, chatMedia, toggleMute, toggleBlock, toggleArchive, togglePin, deleteChat, currentUser } = useData();
  const { setActiveChatId } = useActiveChat();
  const navigate = useNavigate();
  const [subView, setSubView] = useState('info'); // info | attachments | starred

  const isGroup = chat.type === 'group';
  const other = !isGroup ? getUser(chat.participantIds.find((id) => id !== currentUser.id)) : null;
  const media = chatMedia(chat.id);
  const groups = !isGroup ? commonGroups(other?.id) : [];

  const handleDelete = () => {
    const label = isGroup ? 'delete this group' : 'delete this chat';
    if (!window.confirm(`Are you sure you want to ${label}? This can't be undone.`)) return;
    deleteChat(chat.id);
    setActiveChatId(null);
    navigate(isGroup ? '/groups' : '/chats');
  };

  const wrapperClass =
    'fixed inset-0 z-30 md:static md:z-auto flex flex-col h-full w-full md:w-[320px] shrink-0 bg-white dark:bg-[#12162a] md:border-l border-black/5 dark:border-white/5';

  if (subView === 'attachments') {
    return (
      <div className={wrapperClass}>
        <AttachmentsView chatId={chat.id} onBack={() => setSubView('info')} />
      </div>
    );
  }

  if (subView === 'starred') {
    return (
      <div className={wrapperClass}>
        <StarredMessagesView chatId={chat.id} onBack={() => setSubView('info')} />
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <header className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-black/5 dark:border-white/5">
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
        <p className="font-semibold text-sm">{isGroup ? 'Group info' : 'Contact info'}</p>
      </header>

      <div className="flex-1 overflow-y-auto scroll-thin">
        <div className="flex flex-col items-center text-center px-6 pt-8 pb-6">
          <Avatar src={chat.avatar} name={chat.title} size="xl" />
          <p className="font-bold text-lg mt-3">{chat.title}</p>
          {!isGroup && other && <p className="text-sm text-slate-400 mt-0.5">{other.phone}</p>}
          {isGroup && (
            <p className="text-sm text-slate-400 mt-0.5">Group · {chat.participantIds.length} members</p>
          )}

          <div className="flex items-center gap-8 mt-5">
            <button
              onClick={() => onCall('video')}
              className="flex flex-col items-center gap-1.5 text-brand-500"
            >
              <span className="w-11 h-11 rounded-full bg-brand-50 dark:bg-white/10 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Audio</span>
            </button>
            <button
              onClick={() => onCall('audio')}
              className="flex flex-col items-center gap-1.5 text-brand-500"
            >
              <span className="w-11 h-11 rounded-full bg-brand-50 dark:bg-white/10 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Voice</span>
            </button>
          </div>
        </div>

        {!isGroup && other?.about && (
          <div className="px-5 py-4 border-t border-black/5 dark:border-white/5">
            <p className="text-xs text-slate-400 mb-1">About</p>
            <p className="text-sm">{other.about}</p>
          </div>
        )}

        <button
          onClick={() => setSubView('attachments')}
          className="w-full flex items-center gap-3 px-5 py-4 border-t border-black/5 dark:border-white/5 text-left hover:bg-black/[0.02] dark:hover:bg-white/5"
        >
          <span className="flex-1">
            <span className="block text-sm font-medium">Media, links and docs</span>
          </span>
          <span className="text-sm text-slate-400">{media.length}</span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </button>
        {media.length > 0 && (
          <div className="grid grid-cols-3 gap-1.5 px-5 pb-4">
            {media.slice(0, 6).map((m) => (
              <button
                key={m.id}
                onClick={() => setSubView('attachments')}
                className="aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-white/5 flex items-center justify-center"
              >
                {m.type === 'image' ? (
                  <img src={m.fileUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-5 h-5 text-slate-400" />
                )}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setSubView('starred')}
          className="w-full flex items-center gap-3 px-5 py-4 border-t border-black/5 dark:border-white/5 text-left hover:bg-black/[0.02] dark:hover:bg-white/5"
        >
          <Star className="w-[18px] h-[18px] text-slate-400" />
          <span className="flex-1 text-sm font-medium">Starred Messages</span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </button>

        <div className="w-full flex items-center gap-3 px-5 py-4 border-t border-black/5 dark:border-white/5">
          <Bell className="w-[18px] h-[18px] text-slate-400" />
          <span className="flex-1 text-sm font-medium">Mute Notifications</span>
          <button
            onClick={() => toggleMute(chat.id)}
            role="switch"
            aria-checked={!!chat.muted}
            aria-label="Mute notifications"
            className={`relative w-11 h-6 rounded-full transition-colors ${
              chat.muted ? 'bg-brand-500' : 'bg-slate-200 dark:bg-white/20'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                chat.muted ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <button
          onClick={() => togglePin(chat.id)}
          className="w-full flex items-center gap-3 px-5 py-4 border-t border-black/5 dark:border-white/5 text-left hover:bg-black/[0.02] dark:hover:bg-white/5"
        >
          <Pin className="w-[18px] h-[18px] text-slate-400" />
          <span className="flex-1 text-sm font-medium">{chat.pinned ? 'Unpin chat' : 'Pin chat'}</span>
        </button>

        {!isGroup && (
          <button
            onClick={() => toggleArchive(chat.id)}
            className="w-full flex items-center gap-3 px-5 py-4 border-t border-black/5 dark:border-white/5 text-left hover:bg-black/[0.02] dark:hover:bg-white/5"
          >
            <Archive className="w-[18px] h-[18px] text-slate-400" />
            <span className="flex-1 text-sm font-medium">
              {chat.archived ? 'Unarchive chat' : 'Archive chat'}
            </span>
          </button>
        )}

        {isGroup ? (
          <div className="border-t border-black/5 dark:border-white/5">
            <p className="px-5 pt-4 pb-1 text-xs text-slate-400">{chat.participantIds.length} members</p>
            {chat.participantIds.map((id) => {
              const member = id === currentUser.id ? currentUser : getUser(id);
              if (!member) return null;
              return (
                <div key={id} className="flex items-center gap-3 px-5 py-2.5">
                  <Avatar src={member.avatar} name={member.name} size="sm" />
                  <span className="text-sm">{id === currentUser.id ? 'You' : member.name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          groups.length > 0 && (
            <div className="border-t border-black/5 dark:border-white/5">
              <p className="px-5 pt-4 pb-1 text-xs text-slate-400">
                {groups.length} group{groups.length > 1 ? 's' : ''} in common
              </p>
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    setActiveChatId(g.id);
                    navigate(`/groups/${g.id}`);
                  }}
                  className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-black/[0.02] dark:hover:bg-white/5 text-left"
                >
                  <Avatar src={g.avatar} name={g.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{g.name}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {g.participantIds
                        .filter((id) => id !== currentUser.id)
                        .map((id) => getUser(id)?.name)
                        .filter(Boolean)
                        .slice(0, 2)
                        .join(', ')}
                      {g.participantIds.length > 3 ? `, You` : ', You'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )
        )}

        <div className="flex gap-3 px-5 py-6">
          {isGroup ? (
            <button
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center gap-2 border border-missed text-missed font-medium rounded-xl px-4 py-2.5 text-sm hover:bg-missed/5"
            >
              <LogOut className="w-4 h-4" />
              Exit Group
            </button>
          ) : (
            <>
              <button
                onClick={() => toggleBlock(chat.id)}
                className={`flex-1 flex items-center justify-center gap-2 border font-medium rounded-xl px-4 py-2.5 text-sm ${
                  chat.blocked
                    ? 'border-brand-500 text-brand-500 bg-brand-50 dark:bg-white/5'
                    : 'border-brand-300 text-brand-500 hover:bg-brand-50 dark:hover:bg-white/5'
                }`}
              >
                <Shield className="w-4 h-4" />
                {chat.blocked ? 'Unblock' : 'Block'}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-2 border border-missed text-missed font-medium rounded-xl px-4 py-2.5 text-sm hover:bg-missed/5"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
