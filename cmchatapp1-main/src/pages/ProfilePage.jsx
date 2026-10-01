import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera } from 'lucide-react';
import ListDetailLayout from '../components/ListDetailLayout';
import ConversationDetailPane from '../components/ConversationDetailPane';
import Avatar from '../components/Avatar';
import { useData } from '../context/DataContext';

export default function ProfilePage() {
  const { currentUser, updateProfile } = useData();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setAbout(currentUser.about || '');
    }
  }, [currentUser]);

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({ name, about });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const listPanel = (
    <>
      <div className="flex items-center gap-2 px-5 pt-3 pb-4">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 -ml-1.5"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[26px] font-bold">Profile</h1>
      </div>

      <div className="px-5 flex-1 overflow-y-auto scroll-thin pb-6">
        <div className="flex justify-center mb-7">
          <div className="relative">
            <Avatar src={currentUser?.avatar} name={currentUser?.name} size="xl" />
            <button
              aria-label="Change photo"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-[#12162a]"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        <label className="block mb-1.5">
          <span className="text-xs font-medium text-brand-500 mb-1.5 block">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-brand-300 focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-sm outline-none dark:bg-white/5 dark:border-white/15"
          />
        </label>
        <p className="text-xs text-slate-400 mb-5">This name is visible to your contacts</p>

        <label className="block mb-1.5">
          <span className="text-xs font-medium text-slate-400 mb-1.5 block">About</span>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={3}
            className="w-full bg-brand-50 dark:bg-white/5 rounded-xl px-3.5 py-2.5 text-sm outline-none resize-none border border-transparent focus:border-brand-300"
          />
        </label>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="border border-brand-300 text-brand-500 hover:bg-brand-50 dark:hover:bg-white/5 font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          {saved && <span className="text-sm text-online font-medium">Saved!</span>}
        </div>
      </div>
    </>
  );

  return (
    <ListDetailLayout
      listPanel={listPanel}
      detailPanel={<ConversationDetailPane backTo="/profile" onStartNew={() => {}} />}
      showDetail={false}
    />
  );
}
