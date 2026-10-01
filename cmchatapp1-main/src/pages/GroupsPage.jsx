import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ListDetailLayout from '../components/ListDetailLayout';
import ConversationDetailPane from '../components/ConversationDetailPane';
import SearchInput from '../components/SearchInput';
import ChatListRow from '../components/ChatListRow';
import CreateGroupModal from '../components/modals/CreateGroupModal';
import { useData } from '../context/DataContext';
import { useActiveChat } from '../context/ActiveChatContext';

export default function GroupsPage() {
  const { id } = useParams();
  const { chatsWithPreview } = useData();
  const { activeChatId, setActiveChatId } = useActiveChat();
  const [query, setQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (id) setActiveChatId(id);
  }, [id, setActiveChatId]);

  const groups = useMemo(() => {
    let list = chatsWithPreview.filter((c) => c.type === 'group' && !c.archived);
    if (query.trim()) list = list.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [chatsWithPreview, query]);

  const pinned = groups.filter((c) => c.pinned);
  const rest = groups.filter((c) => !c.pinned);

  const listPanel = (
    <>
      <div className="px-5 pt-3 pb-4">
        <h1 className="text-[26px] font-bold">Groups</h1>
      </div>

      <div className="px-4 mb-4">
        <SearchInput value={query} onChange={setQuery} />
      </div>

      <button
        onClick={() => setShowCreate(true)}
        className="flex items-center gap-2 px-5 mb-3 text-sm font-medium text-brand-500 hover:text-brand-600"
      >
        <Plus className="w-4 h-4" />
        Create New Group
      </button>

      <div className="flex-1 overflow-y-auto scroll-thin pb-4">
        {pinned.length > 0 && (
          <Section title="Pinned">
            {pinned.map((c) => (
              <ChatListRow key={c.id} to={`/groups/${c.id}`} chat={c} active={c.id === activeChatId} />
            ))}
          </Section>
        )}
        <Section title="All Chats">
          {rest.map((c) => (
            <ChatListRow key={c.id} to={`/groups/${c.id}`} chat={c} active={c.id === activeChatId} />
          ))}
          {rest.length === 0 && pinned.length === 0 && (
            <p className="text-center text-sm text-slate-400 px-5 py-6">
              No groups yet — create one to get started.
            </p>
          )}
        </Section>
      </div>
    </>
  );

  return (
    <>
      <ListDetailLayout
        listPanel={listPanel}
        detailPanel={<ConversationDetailPane backTo="/groups" onStartNew={() => setShowCreate(true)} />}
        showDetail={!!id}
      />
      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} />}
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-2">
      <p className="px-5 text-sm font-medium text-slate-400 mb-1.5">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
