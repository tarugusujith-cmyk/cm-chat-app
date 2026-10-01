import { useState } from 'react';
import { UserRound } from 'lucide-react';
import ModalShell from './ModalShell';
import { useData } from '../../context/DataContext';

export default function AddContactModal({ onClose, onAdded }) {
  const { addContact } = useData();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [about, setAbout] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const user = await addContact({ name, phone, about });
      onAdded?.(user);
    } catch {
      setError("Couldn't add contact. Please try again.");
      setSaving(false);
    }
  };

  return (
    <ModalShell title="New Contact" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-brand-50 dark:bg-white/10 flex items-center justify-center">
            <UserRound className="w-8 h-8 text-brand-400" />
          </div>
        </div>

        <label className="block mb-4">
          <span className="text-xs font-medium text-brand-500 mb-1.5 block">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contact name"
            autoFocus
            className="w-full border border-brand-300 focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-sm outline-none dark:bg-white/5 dark:border-white/15"
          />
        </label>

        <label className="block mb-4">
          <span className="text-xs font-medium text-slate-400 mb-1.5 block">Phone</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 000 0000"
            type="tel"
            className="w-full bg-brand-50 dark:bg-white/5 rounded-xl px-3.5 py-2.5 text-sm outline-none border border-transparent focus:border-brand-300"
          />
        </label>

        <label className="block mb-1.5">
          <span className="text-xs font-medium text-slate-400 mb-1.5 block">About (optional)</span>
          <input
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Hey there! I am using CM Chat."
            className="w-full bg-brand-50 dark:bg-white/5 rounded-xl px-3.5 py-2.5 text-sm outline-none border border-transparent focus:border-brand-300"
          />
        </label>

        {error && <p className="text-xs text-missed mt-2">{error}</p>}

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={!name.trim() || saving}
            className="bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors"
          >
            {saving ? 'Adding…' : 'Add Contact'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
