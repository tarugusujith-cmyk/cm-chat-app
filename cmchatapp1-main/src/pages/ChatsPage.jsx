import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SquarePen, Filter, ArchiveRestore, ChevronLeft, Plus } from 'lucide-react';
import ListDetailLayout from '../components/ListDetailLayout';
import ConversationDetailPane from '../components/ConversationDetailPane';
import SearchInput from '../components/SearchInput';
import ChatListRow from '../components/ChatListRow';
import ContactPickerModal from '../components/modals/ContactPickerModal';
import ArchiveChatModal from '../components/modals/ArchiveChatModal';
import { useData } from '../context/DataContext';
import { useActiveChat } from '../context/ActiveChatContext';

const RESERVED_IDS = ['archived', 'unread'];

export default function ChatsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chatsWithPreview, togglePin, toggleArchive } = useData();
  const { activeChatId, setActiveChatId } = useActiveChat();
  const [query, setQuery] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [showArchivePicker, setShowArchivePicker] = useState(false);

  const view = RESERVED_IDS.includes(id) ? id : 'normal';

  useEffect(() => {
    if (id && view === 'normal') setActiveChatId(id);
  }, [id, view, setActiveChatId]);

  const rowMenu = (chat) => [
    { label: chat.pinned ? 'Unpin chat' : 'Pin chat', onClick: () => togglePin(chat.id) },
    {
      label: chat.archived ? 'Unarchive chat' : 'Archive chat',
      onClick: () => toggleArchive(chat.id),
    },
  ];

  const filteredChats = useMemo(() => {
    let list;
    if (view === 'archived') {
      list = chatsWithPreview.filter((c) => c.type === 'direct' && c.archived);
    } else if (view === 'unread') {
      list = chatsWithPreview.filter((c) => c.type === 'direct' && !c.archived && c.unread > 0);
    } else {
      list = chatsWithPreview.filter((c) => c.type === 'direct' && !c.archived);
    }
    if (query.trim()) {
      list = list.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));
    }
    return list;
  }, [chatsWithPreview, query, view]);

  const pinned = filteredChats.filter((c) => c.pinned);
  const rest = filteredChats.filter((c) => !c.pinned);

  if (view !== 'normal') {
    const emptyText = view === 'archived' ? 'No archived chats' : 'No Unread Messages';
    const title = view === 'archived' ? 'Archive' : 'Unread';

    const listPanel = (
      <>
        <div className="flex items-center gap-2 px-5 pt-3 pb-4">
          <button
            onClick={() => navigate('/chats')}
            aria-label="Back"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 -ml-1.5"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[26px] font-bold">{title}</h1>
        </div>

        <div className="px-4 mb-4">
          <SearchInput value={query} onChange={setQuery} />
        </div>

        {view === 'archived' && (
          <button
            onClick={() => setShowArchivePicker(true)}
            className="flex items-center gap-2 px-5 mb-3 text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            <Plus className="w-4 h-4" />
            Add chat to archive
          </button>
        )}

        <div className="flex-1 overflow-y-auto scroll-thin pb-4">
          {filteredChats.length === 0 ? (
            <p className="text-center text-sm text-slate-400 px-5 py-10">{emptyText}</p>
          ) : (
            <>
              {pinned.length > 0 && (
                <Section title="Pinned">
                  {pinned.map((c) => (
                    <ChatListRow
                      key={c.id}
                      to={`/chats/${c.id}`}
                      chat={c}
                      active={c.id === activeChatId}
                      menu={rowMenu(c)}
                    />
                  ))}
                </Section>
              )}
              {rest.length > 0 && (
                <Section title={pinned.length > 0 ? 'All Chats' : undefined}>
                  {rest.map((c) => (
                    <ChatListRow
                      key={c.id}
                      to={`/chats/${c.id}`}
                      chat={c}
                      active={c.id === activeChatId}
                      menu={rowMenu(c)}
                    />
                  ))}
                </Section>
              )}
            </>
          )}
        </div>
      </>
    );

    return (
      <>
        <ListDetailLayout
          listPanel={listPanel}
          detailPanel={<ConversationDetailPane backTo="/chats" onStartNew={() => setShowPicker(true)} />}
          showDetail={false}
        />
        {showPicker && <ContactPickerModal onClose={() => setShowPicker(false)} />}
        {showArchivePicker && <ArchiveChatModal onClose={() => setShowArchivePicker(false)} />}
      </>
    );
  }

  const listPanel = (
    <>
      <div className="flex items-center justify-between px-5 pt-3 pb-4">
        <h1 className="text-[26px] font-bold">Chats</h1>
        <button
          onClick={() => setShowPicker(true)}
          aria-label="Start new chat"
          title="Start new chat"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-brand-50 dark:hover:bg-white/5 hover:text-brand-500"
        >
          <SquarePen className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 mb-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          rightSlot={
            <button
              onClick={() => navigate('/chats/unread')}
              aria-label="Show unread only"
              className="text-brand-400 hover:text-brand-600"
            >
              <Filter className="w-4 h-4" />
            </button>
          }
        />
      </div>

      <button
        onClick={() => navigate('/chats/archived')}
        className="flex items-center gap-2 px-5 mb-3 text-sm font-medium text-brand-500 hover:text-brand-600"
      >
        <ArchiveRestore className="w-4 h-4" />
        Archived
      </button>

      <div className="flex-1 overflow-y-auto scroll-thin pb-4">
        {pinned.length > 0 && (
          <Section title="Pinned">
            {pinned.map((c) => (
              <ChatListRow
                key={c.id}
                to={`/chats/${c.id}`}
                chat={c}
                active={c.id === activeChatId}
                menu={rowMenu(c)}
              />
            ))}
          </Section>
        )}
        <Section title="All Chats">
          {rest.map((c) => (
            <ChatListRow
              key={c.id}
              to={`/chats/${c.id}`}
              chat={c}
              active={c.id === activeChatId}
              menu={rowMenu(c)}
            />
          ))}
          {rest.length === 0 && pinned.length === 0 && (
            <p className="text-center text-sm text-slate-400 px-5 py-6">No chats found.</p>
          )}
        </Section>
      </div>
    </>
  );

  return (
    <>
      <ListDetailLayout
        listPanel={listPanel}
        detailPanel={<ConversationDetailPane backTo="/chats" onStartNew={() => setShowPicker(true)} />}
        showDetail={!!id}
      />
      {showPicker && <ContactPickerModal onClose={() => setShowPicker(false)} />}
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-2">
      {title && <p className="px-5 text-sm font-medium text-slate-400 mb-1.5">{title}</p>}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
