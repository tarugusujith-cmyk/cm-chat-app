import { useEffect, useState } from 'react';
import { Phone, Video, Mic, MicOff, VideoOff } from 'lucide-react';
import Avatar from './Avatar';

function formatDuration(sec) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function CallOverlay({ kind, caller, callee, onHangUp }) {
  const [phase, setPhase] = useState('connecting'); // connecting | connected
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase('connected'), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 'connected') return undefined;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const hangUp = () => onHangUp(seconds);

  if (kind === 'audio') {
    return (
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-[min(92vw,360px)] bg-white dark:bg-[#181c30] rounded-2xl shadow-modal p-6 animate-modal-in">
        <div className="flex items-center justify-center gap-6 mb-5">
          <div className="flex flex-col items-center gap-2">
            <Avatar src={caller.avatar} name={caller.name} size="lg" />
            <span className="text-xs font-medium truncate max-w-[80px]">{caller.name}</span>
          </div>
          <svg width="56" height="24" viewBox="0 0 56 24" className="text-brand-300 shrink-0">
            <path
              d="M0 12c6-10 10 10 16 0s10 10 16 0 10 10 16 0 6-10 8 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={phase === 'connecting' ? 'animate-pulse' : ''}
            />
          </svg>
          <div className="flex flex-col items-center gap-2">
            <Avatar src={callee.avatar} name={callee.name} size="lg" />
            <span className="text-xs font-medium truncate max-w-[80px]">{callee.name}</span>
          </div>
        </div>

        <p className="text-center font-semibold mb-5">
          {phase === 'connecting' ? 'Connecting…' : formatDuration(seconds)}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              muted ? 'bg-slate-700 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500'
            }`}
          >
            {muted ? <MicOff className="w-[18px] h-[18px]" /> : <Mic className="w-[18px] h-[18px]" />}
          </button>
          <button
            onClick={hangUp}
            className="flex items-center gap-2 border border-missed text-missed font-semibold rounded-xl px-5 py-2 text-sm hover:bg-missed/5"
          >
            Hang Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-20 bg-black flex items-center justify-center animate-fade-in">
      <img
        src={callee.avatar}
        alt={callee.name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'blur(1px) brightness(0.9)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

      <div className="absolute top-4 left-4 text-white">
        <p className="font-semibold drop-shadow">{callee.name}</p>
        <p className="text-xs text-white/80 drop-shadow">
          {phase === 'connecting' ? 'Connecting…' : formatDuration(seconds)}
        </p>
      </div>

      <div className="absolute top-4 right-4 w-20 h-28 sm:w-28 sm:h-36 rounded-2xl overflow-hidden ring-2 ring-white/40 shadow-modal">
        {videoOff ? (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <Avatar src={caller.avatar} name={caller.name} size="sm" />
          </div>
        ) : (
          <img src={caller.avatar} alt={caller.name} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur ${
            muted ? 'bg-white text-slate-900' : 'bg-white/20 text-white'
          }`}
        >
          {muted ? <MicOff className="w-[18px] h-[18px]" /> : <Mic className="w-[18px] h-[18px]" />}
        </button>
        <button
          onClick={hangUp}
          aria-label="Hang up"
          className="w-14 h-14 rounded-full bg-missed text-white flex items-center justify-center shadow-modal hover:bg-red-600"
        >
          <Phone className="w-6 h-6 rotate-[135deg]" />
        </button>
        <button
          onClick={() => setVideoOff((v) => !v)}
          aria-label={videoOff ? 'Turn camera on' : 'Turn camera off'}
          className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur ${
            videoOff ? 'bg-white text-slate-900' : 'bg-white/20 text-white'
          }`}
        >
          {videoOff ? <VideoOff className="w-[18px] h-[18px]" /> : <Video className="w-[18px] h-[18px]" />}
        </button>
      </div>
    </div>
  );
}
