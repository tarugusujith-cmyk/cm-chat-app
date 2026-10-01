import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import ListDetailLayout from '../components/ListDetailLayout';
import StatusViewer from '../components/StatusViewer';
import Avatar from '../components/Avatar';
import { useData } from '../context/DataContext';
import { useActiveChat } from '../context/ActiveChatContext';
import { timeAgo } from '../utils/time';

export default function UpdatesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    statusesWithMeta,
    currentUser,
    markStatusSeen,
    addSlideToMyStatus,
    removeMySlide,
    startDirectChat,
    sendMessage,
  } = useData();
  const { setActiveChatId } = useActiveChat();
  const fileInputRef = useRef(null);

  const mine = statusesWithMeta.find((s) => s.isMine);
  const others = statusesWithMeta.filter((s) => !s.isMine);
  const notSeen = others.filter((s) => !s.seen);
  const seen = others.filter((s) => s.seen);

  const active = statusesWithMeta.find((s) => s.id === id);

  const openStatus = (statusId) => {
    navigate(`/updates/${statusId}`);
    const target = statusesWithMeta.find((s) => s.id === statusId);
    if (target && !target.isMine) markStatusSeen(statusId);
  };

  const handleAddNew = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const statusId = await addSlideToMyStatus(url);
    navigate(`/updates/${statusId}`);
    e.target.value = '';
  };

  const goToNeighbor = (dir) => {
    const order = [mine, ...notSeen, ...seen].filter(Boolean);
    const idx = order.findIndex((s) => s.id === id);
    const next = order[idx + dir];
    if (next) openStatus(next.id);
    else navigate('/updates');
  };

  const handleReply = async (statusId, text) => {
    const status = statusesWithMeta.find((s) => s.id === statusId);
    if (!status) return;
    const chat = await startDirectChat(status.userId);
    await sendMessage(chat.id, { type: 'text', text });
    setActiveChatId(chat.id);
    navigate(`/chats/${chat.id}`);
  };

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
        <h1 className="text-[26px] font-bold flex-1">Updates</h1>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAddNew} className="hidden" />
        <button
          onClick={() => fileInputRef.current?.click()}
          aria-label="Add update"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-brand-50 dark:hover:bg-white/5 hover:text-brand-500"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin px-2 pb-4">
        <p className="px-3 text-sm font-medium text-slate-400 mb-1.5">Not seen</p>
        <div className="space-y-0.5 mb-4">
          {mine && (
            <StatusRow status={mine} active={mine.id === id} onClick={() => openStatus(mine.id)} isMine />
          )}
          {!mine && currentUser && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white dark:hover:bg-white/5 text-left"
            >
              <Avatar src={currentUser.avatar} name={currentUser.name} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{currentUser.name} (Me)</p>
                <p className="text-xs text-brand-500">Add an update</p>
              </div>
            </button>
          )}
          {notSeen.map((s) => (
            <StatusRow key={s.id} status={s} active={s.id === id} onClick={() => openStatus(s.id)} />
          ))}
        </div>

        {seen.length > 0 && (
          <>
            <p className="px-3 text-sm font-medium text-slate-400 mb-1.5">Seen</p>
            <div className="space-y-0.5">
              {seen.map((s) => (
                <StatusRow key={s.id} status={s} active={s.id === id} onClick={() => openStatus(s.id)} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );

  const detailPanel = active ? (
    <StatusViewer
      status={active}
      onClose={() => navigate('/updates')}
      onPrevPerson={() => goToNeighbor(-1)}
      onNextPerson={() => goToNeighbor(1)}
      onDeleteSlide={(idx) => removeMySlide(active.id, idx)}
      onAddSlide={(url) => addSlideToMyStatus(url)}
      onReply={(text) => handleReply(active.id, text)}
    />
  ) : (
    <div className="hidden md:flex flex-1 flex-col items-center justify-center gap-4 text-center px-6">
      <div className="w-16 h-16 rounded-full border-2 border-dashed border-brand-300 flex items-center justify-center text-brand-300">
        <ChevronLeft className="w-6 h-6 rotate-180" />
      </div>
      <p className="text-slate-400">Click on an update to view</p>
    </div>
  );

  return <ListDetailLayout listPanel={listPanel} detailPanel={detailPanel} showDetail={!!id} />;
}

function StatusRow({ status, active, onClick, isMine }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-colors ${
        active ? 'bg-brand-500 text-white' : 'hover:bg-white dark:hover:bg-white/5'
      }`}
    >
      <div
        className={`rounded-full p-0.5 ${
          status.seen
            ? 'border-2 border-solid border-slate-300 dark:border-white/20'
            : 'border-2 border-dashed border-online'
        }`}
      >
        <Avatar src={status.user.avatar} name={status.user.name} size="sm" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">
          {isMine ? `${status.user.name} (Me)` : status.user.name}
        </p>
        {isMine && <p className={`text-xs ${active ? 'text-white/85' : 'text-brand-500'}`}>Edit</p>}
      </div>
      <span className={`text-xs shrink-0 ${active ? 'text-white/80' : 'text-slate-400'}`}>
        {timeAgo(status.postedAt)}
      </span>
    </button>
  );
}
