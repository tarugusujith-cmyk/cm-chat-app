import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function SettingsSubHeader({ title, backTo = '/settings' }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-2 px-5 pt-3 pb-4">
      <button
        onClick={() => navigate(backTo)}
        aria-label="Back"
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 -ml-1.5"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <h1 className="text-xl font-bold leading-tight">{title}</h1>
    </div>
  );
}
