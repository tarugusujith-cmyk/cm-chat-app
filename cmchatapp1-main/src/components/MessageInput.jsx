import { useRef, useState } from 'react';
import { Paperclip, Smile, Send } from 'lucide-react';

const QUICK_EMOJIS = ['😀', '😂', '👍', '❤️', '🔥', '🎉', '😮', '😢'];

export default function MessageInput({ onSend, onSendFile }) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef(null);

  const submit = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onSendFile(file);
    e.target.value = '';
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 px-3 sm:px-5 py-3 border-t border-black/5 dark:border-white/5 bg-surface-panel dark:bg-[#12162a]"
    >
      <input type="file" ref={fileInputRef} onChange={handleFilePick} className="hidden" />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        aria-label="Attach file"
        className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full text-brand-400 hover:bg-brand-50 dark:hover:bg-white/5"
      >
        <Paperclip className="w-5 h-5" />
      </button>

      <div className="flex-1 relative">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message ..."
          className="w-full bg-brand-50 dark:bg-white/5 rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-brand-400 text-slate-700 dark:text-slate-100"
        />
      </div>

      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setShowEmoji((s) => !s)}
          aria-label="Emoji"
          className="w-9 h-9 flex items-center justify-center rounded-full text-brand-400 hover:bg-brand-50 dark:hover:bg-white/5"
        >
          <Smile className="w-5 h-5" />
        </button>
        {showEmoji && (
          <div className="absolute bottom-12 right-0 bg-white dark:bg-[#1c2138] shadow-modal rounded-2xl p-2 grid grid-cols-4 gap-1 animate-fade-in z-10">
            {QUICK_EMOJIS.map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => {
                  setText((t) => t + em);
                  setShowEmoji(false);
                }}
                className="text-xl w-9 h-9 flex items-center justify-center rounded-xl hover:bg-brand-50 dark:hover:bg-white/10"
              >
                {em}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        aria-label="Send"
        className="w-10 h-10 shrink-0 rounded-full bg-brand-500 text-white flex items-center justify-center disabled:opacity-40 hover:bg-brand-600 transition-colors"
        disabled={!text.trim()}
      >
        <Send className="w-[18px] h-[18px]" />
      </button>
    </form>
  );
}
