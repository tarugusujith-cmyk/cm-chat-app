import { useMemo, useState } from 'react';
import { ChevronLeft, Download, Link2, FileText, FileSpreadsheet, FileImage } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatDateLabel } from '../utils/time';

const TABS = ['Media', 'Links', 'Docs'];

function fileIcon(hint = '') {
  const h = hint.toLowerCase();
  if (h.includes('pdf')) return { Icon: FileText, color: 'text-red-500 bg-red-50 dark:bg-red-500/10' };
  if (h.includes('excel') || h.includes('xls') || h.includes('csv') || h.includes('sheet'))
    return { Icon: FileSpreadsheet, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' };
  return { Icon: FileImage, color: 'text-brand-500 bg-brand-50 dark:bg-white/10' };
}

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

export default function AttachmentsView({ chatId, initialTab = 'Media', onBack }) {
  const { messagesByChat } = useData();
  const [tab, setTab] = useState(initialTab);

  const messages = messagesByChat(chatId);
  const media = useMemo(() => messages.filter((m) => m.type === 'image'), [messages]);
  const links = useMemo(() => messages.filter((m) => m.type === 'link'), [messages]);
  const docs = useMemo(() => messages.filter((m) => m.type === 'file'), [messages]);

  const active = tab === 'Media' ? media : tab === 'Links' ? links : docs;
  const groups = groupByDate(active);

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
        <div className="flex items-center gap-5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-sm pb-0.5 border-b-2 transition-colors ${
                tab === t
                  ? 'text-brand-500 border-brand-500 font-medium'
                  : 'text-slate-500 dark:text-slate-400 border-transparent'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4">
        {active.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-10">Nothing shared here yet.</p>
        )}

        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="text-xs text-slate-400 mb-2">{group.label}</p>

            {tab === 'Media' && (
              <div className="grid grid-cols-3 gap-1.5">
                {group.items.map((m) => (
                  <div key={m.id} className="aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-white/5">
                    <img src={m.fileUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {tab === 'Links' && (
              <div className="space-y-2.5">
                {group.items.map((m) => (
                  <a
                    key={m.id}
                    href={m.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-black/5 dark:border-white/10 px-3.5 py-3 hover:bg-black/[0.02] dark:hover:bg-white/5"
                  >
                    <span className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                      <Link2 className="w-4 h-4 text-slate-500" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm truncate">{m.linkUrl}</p>
                      <p className="text-xs text-brand-500 truncate">{m.linkDomain}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {tab === 'Docs' && (
              <div className="space-y-2.5">
                {group.items.map((m) => {
                  const { Icon, color } = fileIcon(m.fileKind || m.fileName);
                  return (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 rounded-xl border border-black/5 dark:border-white/10 px-3.5 py-3"
                    >
                      <span className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{m.fileName}</p>
                        {m.fileSize && <p className="text-xs text-slate-400">{m.fileSize}</p>}
                      </div>
                      <Download className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
