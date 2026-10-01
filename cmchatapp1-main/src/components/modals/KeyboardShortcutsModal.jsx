import ModalShell from './ModalShell';

const LEFT = [
  { label: 'Mark as unread', keys: ['Cmd', 'Shift', 'U'] },
  { label: 'Archive chat', keys: ['Cmd', 'Shift', 'E'] },
  { label: 'Pin chat', keys: ['Cmd', 'Shift', 'P'] },
  { label: 'Search Chat', keys: ['Cmd', 'Shift', 'F'] },
  { label: 'Next Chat', keys: ['Ctrl', 'Tab'] },
  { label: 'New Group', keys: ['Cmd', 'Shift', 'N'] },
  { label: 'Increase speed of voice message', keys: ['Shift', '.'] },
  { label: 'Settings', keys: ['Shift', ','] },
  { label: 'Settings', keys: ['Cmd', 'G'] },
];

const RIGHT = [
  { label: 'Mute', keys: ['Cmd', 'Shift', 'M'] },
  { label: 'Delete chat', keys: ['Cmd', 'Shift', 'D'] },
  { label: 'Search', keys: ['Cmd', 'F'] },
  { label: 'New Chat', keys: ['Cmd', 'N'] },
  { label: 'Previous Chat', keys: ['Ctrl', 'Shift', 'Tab'] },
  { label: 'Profile & About', keys: ['Cmd', 'P'] },
  { label: 'Decrease speed of voice message', keys: ['Shift', ','] },
  { label: 'Emoji Panel', keys: ['Cmd', 'E'] },
  { label: 'Sticker Panel', keys: ['Cmd', 'S'] },
];

function KeyCap({ children }) {
  return (
    <kbd className="min-w-[32px] text-center px-2 py-1 rounded-md bg-slate-50 dark:bg-white/10 border border-slate-300 dark:border-white/15 text-xs font-medium text-slate-600 dark:text-slate-200">
      {children}
    </kbd>
  );
}

function Row({ label, keys }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm text-slate-700 dark:text-slate-200">{label}</span>
      <span className="flex items-center gap-1.5 shrink-0">
        {keys.map((k, i) => (
          <KeyCap key={i}>{k}</KeyCap>
        ))}
      </span>
    </div>
  );
}

export default function KeyboardShortcutsModal({ onClose }) {
  return (
    <ModalShell title="Keyboard Shortcuts" onClose={onClose} width="max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 divide-y sm:divide-y-0 divide-black/5 dark:divide-white/10">
        <div className="divide-y divide-black/5 dark:divide-white/10">
          {LEFT.map((item, i) => (
            <Row key={i} {...item} />
          ))}
        </div>
        <div className="divide-y divide-black/5 dark:divide-white/10">
          {RIGHT.map((item, i) => (
            <Row key={i} {...item} />
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl px-8 py-2.5 text-sm transition-colors"
        >
          OK
        </button>
      </div>
    </ModalShell>
  );
}
