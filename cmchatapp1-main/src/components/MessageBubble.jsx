import { FileImage, Download, Smile, Star, Link2, FileText, FileSpreadsheet } from 'lucide-react';
import { formatClock } from '../utils/time';
import Avatar from './Avatar';

export default function MessageBubble({
  message,
  isMine,
  senderName,
  senderAvatar,
  showAvatar,
  onReact,
  onToggleStar,
}) {
  return (
    <div className={`flex items-end gap-2 group ${isMine ? 'justify-end' : 'justify-start'}`}>
      {!isMine && (
        <div className="w-7 shrink-0">
          {showAvatar && <Avatar src={senderAvatar} name={senderName} size="sm" />}
        </div>
      )}

      <div className={`flex flex-col max-w-[78%] sm:max-w-[60%] ${isMine ? 'items-end' : 'items-start'}`}>
        <Bubble message={message} isMine={isMine} onReact={onReact} />
        <div className={`flex items-center gap-1.5 mt-1 px-1 ${isMine ? 'flex-row-reverse' : ''}`}>
          <span className="text-[11px] text-slate-400">{formatClock(message.time)}</span>
          {message.syncFailed && <span className="text-[11px] text-missed">not sent</span>}
          {onToggleStar && (
            <button
              onClick={() => onToggleStar(message.id)}
              aria-label={message.starred ? 'Unstar message' : 'Star message'}
              className={`w-4 h-4 flex items-center justify-center transition-opacity ${
                message.starred ? 'opacity-100 text-amber-400' : 'opacity-0 group-hover:opacity-100 text-slate-300'
              }`}
            >
              <Star className="w-3 h-3" fill={message.starred ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Bubble({ message, isMine, onReact }) {
  const base = 'rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm relative';
  const mineStyle = 'bg-brand-500 text-white rounded-br-md';
  const theirStyle =
    'bg-white dark:bg-[#1c2138] text-slate-700 dark:text-slate-100 rounded-bl-md border border-black/5 dark:border-white/5';

  if (message.type === 'image') {
    return (
      <div className="relative">
        <img
          src={message.fileUrl}
          alt="attachment"
          className="rounded-2xl max-w-[240px] sm:max-w-[280px] max-h-64 object-cover shadow-sm"
        />
        <ReactionRow message={message} onReact={onReact} isMine={isMine} floating />
      </div>
    );
  }

  if (message.type === 'file') {
    const Icon = fileIcon(message.fileKind || message.fileName);
    return (
      <div
        className={`flex items-center gap-3 rounded-2xl px-4 py-3 min-w-[220px] ${
          isMine ? mineStyle : theirStyle
        }`}
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isMine ? 'bg-white/20' : 'bg-brand-100 dark:bg-white/10'
          }`}
        >
          <Icon className={`w-4 h-4 ${isMine ? 'text-white' : 'text-brand-500'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{message.fileName}</p>
          {message.fileSize && (
            <p className={`text-xs ${isMine ? 'text-white/70' : 'text-slate-400'}`}>{message.fileSize}</p>
          )}
        </div>
        <Download className={`w-4 h-4 shrink-0 ${isMine ? 'text-white' : 'text-slate-400'}`} />
      </div>
    );
  }

  if (message.type === 'link') {
    return (
      <div className={`rounded-2xl overflow-hidden min-w-[220px] ${isMine ? mineStyle : theirStyle}`}>
        {message.text && <div className="px-4 pt-2.5 text-sm">{message.text}</div>}
        <a
          href={message.linkUrl}
          target="_blank"
          rel="noreferrer"
          className={`flex items-center gap-3 px-4 py-3 ${message.text ? 'pt-2' : ''}`}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isMine ? 'bg-white/20' : 'bg-brand-100 dark:bg-white/10'
            }`}
          >
            <Link2 className={`w-4 h-4 ${isMine ? 'text-white' : 'text-brand-500'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate underline underline-offset-2">{message.linkUrl}</p>
            <p className={`text-xs ${isMine ? 'text-white/70' : 'text-brand-500'}`}>{message.linkDomain}</p>
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className={`${base} ${isMine ? mineStyle : theirStyle}`}>
      {message.text}
      <ReactionRow message={message} onReact={onReact} isMine={isMine} />
    </div>
  );
}

function fileIcon(hint = '') {
  const h = hint.toLowerCase();
  if (h.includes('pdf')) return FileText;
  if (h.includes('excel') || h.includes('xls') || h.includes('csv') || h.includes('sheet'))
    return FileSpreadsheet;
  if (h.includes('image') || h.includes('png') || h.includes('jpg') || h.includes('jpeg')) return FileImage;
  return FileText;
}

function ReactionRow({ message, onReact, isMine, floating }) {
  const reactions = message.reactions || [];
  const hasReactions = reactions.length > 0;

  return (
    <div
      className={`flex items-center gap-1 ${
        floating ? 'absolute -bottom-3 left-2' : hasReactions ? 'mt-1.5' : ''
      }`}
    >
      {reactions.map((r) => (
        <button
          key={r.emoji}
          onClick={() => onReact(message.id, r.emoji)}
          className="flex items-center gap-0.5 bg-white dark:bg-[#20263f] shadow-sm border border-black/5 dark:border-white/10 rounded-full px-1.5 py-0.5 text-xs"
        >
          <span>{r.emoji}</span>
          <span className="text-slate-500 dark:text-slate-300">{r.count}</span>
        </button>
      ))}
      <button
        onClick={() => onReact(message.id, '🔥')}
        className={`opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-full flex items-center justify-center ${
          isMine ? 'text-white/70 hover:bg-white/20' : 'text-slate-400 hover:bg-black/5'
        }`}
        aria-label="React"
      >
        <Smile className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
