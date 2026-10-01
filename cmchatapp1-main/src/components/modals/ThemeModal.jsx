import { useState } from 'react';
import ModalShell from './ModalShell';
import RadioOption from '../RadioOption';
import { useTheme } from '../../context/ThemeContext';

const OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System Default' },
];

export default function ThemeModal({ onClose }) {
  const { themePreference, setTheme } = useTheme();
  const [staged, setStaged] = useState(themePreference);

  const handleApply = () => {
    setTheme(staged);
    onClose();
  };

  return (
    <ModalShell title="Choose Theme" onClose={onClose} width="max-w-sm">
      <div className="divide-y divide-black/5 dark:divide-white/10">
        {OPTIONS.map(({ value, label }) => (
          <RadioOption
            key={value}
            name="theme"
            value={value}
            label={label}
            checked={staged === value}
            onChange={setStaged}
          />
        ))}
      </div>

      <div className="flex items-center justify-end gap-4 mt-6">
        <button
          onClick={onClose}
          className="text-sm font-semibold text-brand-500 hover:text-brand-600 px-3 py-2"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors"
        >
          Apply
        </button>
      </div>
    </ModalShell>
  );
}
