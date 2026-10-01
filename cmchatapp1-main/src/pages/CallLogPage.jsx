import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Video, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import ListDetailLayout from '../components/ListDetailLayout';
import ConversationDetailPane from '../components/ConversationDetailPane';
import SearchInput from '../components/SearchInput';
import Avatar from '../components/Avatar';
import ContactPickerModal from '../components/modals/ContactPickerModal';
import { useData } from '../context/DataContext';
import { useActiveChat } from '../context/ActiveChatContext';

export default function CallLogPage() {
  const { calls, getUser, logCall, startDirectChat } = useData();
  const { setActiveChatId } = useActiveChat();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const rows = useMemo(() => {
    return calls
      .map((call) => ({ call, user: getUser(call.userId) }))
      .filter((r) => r.user)
      .filter((r) => r.user.name.toLowerCase().includes(query.toLowerCase()));
  }, [calls, getUser, query]);

  const openChatWith = async (userId) => {
    const chat = await startDirectChat(userId);
    setActiveChatId(chat.id);
    navigate(`/chats/${chat.id}`);
  };

  const listPanel = (
    <>
      <div className="px-5 pt-3 pb-4">
        <h1 className="text-[26px] font-bold">Call Log</h1>
      </div>

      <div className="px-4 mb-4">
        <SearchInput value={query} onChange={setQuery} />
      </div>

      <button
        onClick={() => setShowPicker(true)}
        className="flex items-center gap-2 px-5 mb-3 text-sm font-medium text-brand-500 hover:text-brand-600"
      >
        Start new conversation
        <Phone className="w-4 h-4" />
      </button>

      <div className="flex-1 overflow-y-auto scroll-thin pb-4 px-2">
        {rows.map(({ call, user }) => (
          <div
            key={call.id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white dark:hover:bg-white/5"
          >
            <button className="flex items-center gap-3 flex-1 min-w-0 text-left" onClick={() => openChatWith(user.id)}>
              <Avatar src={user.avatar} name={user.name} />
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{user.name}</p>
                <p
                  className={`text-xs flex items-center gap-1 ${
                    call.status === 'missed' ? 'text-missed' : 'text-online'
                  }`}
                >
                  {call.direction === 'outgoing' ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                  )}
                  {call.time}
                </p>
              </div>
            </button>
            <button
              onClick={() => logCall(user.id, call.kind)}
              aria-label={call.kind === 'video' ? 'Video call' : 'Voice call'}
              className="w-9 h-9 flex items-center justify-center rounded-full text-online hover:bg-online/10 shrink-0"
            >
              {call.kind === 'video' ? <Video className="w-[18px] h-[18px]" /> : <Phone className="w-[18px] h-[18px]" />}
            </button>
          </div>
        ))}
        {rows.length === 0 && <p className="text-center text-sm text-slate-400 py-6">No calls found.</p>}
      </div>
    </>
  );

  return (
    <>
      <ListDetailLayout
        listPanel={listPanel}
        detailPanel={<ConversationDetailPane backTo="/calls" onStartNew={() => setShowPicker(true)} />}
        showDetail={false}
      />
      {showPicker && <ContactPickerModal onClose={() => setShowPicker(false)} />}
    </>
  );
}
