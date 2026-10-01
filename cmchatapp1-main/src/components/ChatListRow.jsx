import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import Avatar from './Avatar';
import { shortListTime } from '../utils/time';

export default function ChatListRow({ to, chat, active, menu }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [flipUp, setFlipUp] = useState(false);

  const hasMenu = menu && menu.length > 0;

  const openMenu = (target) => {
    // Flip the dropdown upward when there isn't room below (e.g. last rows in the list)
    const rect = target.getBoundingClientRect();
    setFlipUp(rect.bottom + 130 > window.innerHeight);
    setMenuOpen(true);
  };

  return (
    <div className="relative group">
      <NavLink
        to={to}
        onContextMenu={(e) => {
          if (!hasMenu) return;
          e.preventDefault();
          openMenu(e.currentTarget);
        }}
        className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-2xl transition-colors ${
          active
            ? 'bg-brand-500 text-white'
            : 'hover:bg-white dark:hover:bg-white/5 text-slate-700 dark:text-slate-200'
        }`}
      >
        <Avatar src={chat.avatar} name={chat.title} online={chat.type === 'direct' && chat.online} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm truncate">{chat.title}</p>
            <span className={`text-xs shrink-0 ${hasMenu ? 'mr-6' : ''} ${active ? 'text-white/80' : 'text-slate-400'}`}>
              {shortListTime(chat.lastTime)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className={`text-xs truncate ${active ? 'text-white/85' : 'text-slate-500 dark:text-slate-400'}`}>
              {chat.lastMessage}
            </p>
            {!!chat.unread && (
              <span
                className={`shrink-0 text-[11px] font-semibold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center ${
                  active ? 'bg-white text-brand-600' : 'bg-brand-500 text-white'
                }`}
              >
                {chat.unread}
              </span>
            )}
          </div>
        </div>
      </NavLink>

      {hasMenu && (
        <div className="absolute right-3 top-3">
          {/* Always visible on touch/small screens; hover-revealed on desktop */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (menuOpen) setMenuOpen(false);
              else openMenu(e.currentTarget);
            }}
            aria-label="More options"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-opacity md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 ${
              menuOpen ? 'md:opacity-100' : ''
            } ${
              active ? 'text-white hover:bg-white/20' : 'text-slate-400 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                role="menu"
                className={`absolute right-0 z-20 w-44 bg-white dark:bg-[#20263f] shadow-modal rounded-xl border border-black/5 dark:border-white/10 py-1.5 animate-fade-in ${
                  flipUp ? 'bottom-8' : 'top-8'
                }`}
              >
                {menu.map((item) => (
                  <button
                    key={item.label}
                    role="menuitem"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      item.onClick();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-sm hover:bg-brand-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
