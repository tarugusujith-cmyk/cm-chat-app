import { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ModalShell from './ModalShell';
import Avatar from '../Avatar';
import { useData } from '../../context/DataContext';

export default function CreateGroupModal({ onClose }) {
  const { users, currentUser, createGroup } = useData();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [memberIds, setMemberIds] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [creating, setCreating] = useState(false);

  const pickable = users.filter((u) => u.id !== currentUser?.id && !memberIds.includes(u.id));

  const addMember = (id) => {
    setMemberIds((prev) => [...prev, id]);
    setShowPicker(false);
  };
  const removeMember = (id) => setMemberIds((prev) => prev.filter((m) => m !== id));

  const handleCreate = async () => {
    if (!name.trim() || memberIds.length === 0) return;
    setCreating(true);
    const chat = await createGroup({ name: name.trim(), memberIds });
    setCreating(false);
    onClose();
    navigate(`/groups/${chat.id}`);
  };

  return (
    <ModalShell title="Create New Group" onClose={onClose}>
      <label className="block mb-5">
        <span className="text-xs font-medium text-brand-500 mb-1.5 block">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group Name"
          className="w-full border border-brand-300 focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-sm outline-none dark:bg-white/5 dark:border-white/15"
        />
      </label>

      <div className="mb-2">
        <span className="text-xs font-medium text-brand-500 mb-1.5 block">Members</span>
        <div
          className="relative flex flex-wrap gap-2 border border-slate-200 dark:border-white/15 rounded-xl px-3 py-2.5 min-h-[52px] cursor-text"
          onClick={() => setShowPicker(true)}
        >
          {memberIds.map((id) => {
            const u = users.find((x) => x.id === id);
            if (!u) return null;
            return (
              <span
                key={id}
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/10 rounded-full pl-1 pr-2 py-1 text-xs font-medium"
              >
                <Avatar src={u.avatar} name={u.name} size="xs" />
                {u.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMember(id);
                  }}
                  className="w-4 h-4 rounded-full bg-slate-300 dark:bg-white/20 text-white flex items-center justify-center"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            );
          })}
          {memberIds.length === 0 && (
            <span className="text-sm text-slate-400 py-1">Tap to add members…</span>
          )}

          {showPicker && pickable.length > 0 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#20263f] shadow-modal rounded-xl border border-black/5 dark:border-white/10 max-h-52 overflow-y-auto scroll-thin z-10"
            >
              {pickable.map((u) => (
                <button
                  key={u.id}
                  onClick={() => addMember(u.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-brand-50 dark:hover:bg-white/5 text-left"
                >
                  <Avatar src={u.avatar} name={u.name} size="sm" />
                  <span className="text-sm">{u.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleCreate}
          disabled={!name.trim() || memberIds.length === 0 || creating}
          className="bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors"
        >
          {creating ? 'Creating…' : 'Create'}
        </button>
      </div>
    </ModalShell>
  );
}
