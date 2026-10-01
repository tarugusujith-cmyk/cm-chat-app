export default function EmptyState({ onStartNew }) {
  return (
    <div className="hidden md:flex flex-1 flex-col items-center justify-center gap-6 text-center px-6">
      <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M90 8c-13 0-25 5-34 14a48 48 0 0 0 0 68l-6 22 23-6a48 48 0 0 0 68-68A48 48 0 0 0 90 8Z"
          fill="currentColor"
          className="text-brand-200 dark:text-brand-900"
        />
        <circle cx="90" cy="90" r="38" fill="currentColor" className="text-white dark:text-[#161a2c]" />
        <rect x="70" y="76" width="40" height="30" rx="6" className="fill-brand-500" />
        <rect x="76" y="60" width="28" height="18" rx="4" className="fill-brand-300" />
        <circle cx="86" cy="90" r="3" fill="white" />
        <circle cx="94" cy="90" r="3" fill="white" />
        <path d="M84 98c2 2 8 2 10 0" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div>
        <p className="text-slate-500 dark:text-slate-400">
          Select a conversation or start a{' '}
          <button onClick={onStartNew} className="text-brand-500 underline underline-offset-2 font-medium">
            new one
          </button>
        </p>
      </div>
    </div>
  );
}
