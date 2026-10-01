import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Trash2, Plus, Send } from 'lucide-react';
import Avatar from './Avatar';
import { timeAgo } from '../utils/time';

const SLIDE_MS = 4500;

export default function StatusViewer({
  status,
  onClose,
  onPrevPerson,
  onNextPerson,
  onDeleteSlide,
  onAddSlide,
  onReply,
}) {
  const [index, setIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reply, setReply] = useState('');
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  const images = status?.images || [];

  useEffect(() => {
    setIndex(0);
    setProgressKey((k) => k + 1);
  }, [status?.id]);

  const goNext = () => {
    if (index < images.length - 1) {
      setIndex((i) => i + 1);
      setProgressKey((k) => k + 1);
    } else {
      onNextPerson?.();
    }
  };

  const goPrev = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
      setProgressKey((k) => k + 1);
    } else {
      onPrevPerson?.();
    }
  };

  useEffect(() => {
    if (paused || images.length === 0) return undefined;
    timerRef.current = setTimeout(goNext, SLIDE_MS);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, progressKey, paused, status?.id]);

  if (!status) return null;

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onAddSlide(url);
    e.target.value = '';
  };

  const submitReply = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    onReply(reply.trim());
    setReply('');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0f1220]">
      <header className="flex items-center gap-3 px-4 sm:px-6 py-3.5 border-b border-black/5 dark:border-white/5">
        <Avatar src={status.user.avatar} name={status.user.name} size="sm" />
        <p className="font-semibold text-sm flex-1 truncate">
          {status.isMine ? `${status.user.name} (Me)` : status.user.name}
        </p>
        {status.isMine && (
          <button
            onClick={() => onDeleteSlide(index)}
            aria-label="Delete this update"
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-missed"
          >
            <Trash2 className="w-[18px] h-[18px]" />
          </button>
        )}
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center gap-2 sm:gap-6 px-2 sm:px-10 py-4 min-h-0">
        <button
          onClick={goPrev}
          aria-label="Previous"
          className="hidden sm:flex w-10 h-10 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div
          className="relative h-full max-h-full flex-1 max-w-[340px] flex flex-col items-stretch justify-center"
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
        >
          <div className="flex gap-1.5 mb-2 shrink-0">
            {images.map((_, i) => (
              <div key={i} className="h-[3px] flex-1 rounded-full bg-black/10 dark:bg-white/15 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-brand-500 ${
                    i === index && !paused ? 'animate-story-fill' : ''
                  }`}
                  style={{
                    width: i < index ? '100%' : i > index ? '0%' : paused ? '100%' : undefined,
                    animationDuration: `${SLIDE_MS}ms`,
                  }}
                  key={i === index ? progressKey : `static-${i}`}
                />
              </div>
            ))}
          </div>

          <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5">
            <img
              src={images[index]}
              alt="Update"
              className="w-full h-full object-cover"
              draggable={false}
            />
            <button
              className="absolute inset-y-0 left-0 w-1/3 sm:hidden"
              aria-label="Previous slide"
              onClick={goPrev}
            />
            <button
              className="absolute inset-y-0 right-0 w-1/3 sm:hidden"
              aria-label="Next slide"
              onClick={goNext}
            />
          </div>
          <p className="text-center text-xs text-slate-400 mt-2 shrink-0">{timeAgo(status.postedAt)} ago</p>
        </div>

        <button
          onClick={goNext}
          aria-label="Next"
          className="hidden sm:flex w-10 h-10 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {status.isMine ? (
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3.5 border-t border-black/5 dark:border-white/5 overflow-x-auto scroll-thin">
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFile} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            aria-label="Add update"
            className="w-12 h-12 shrink-0 rounded-xl border-2 border-dashed border-brand-300 text-brand-400 flex items-center justify-center hover:bg-brand-50 dark:hover:bg-white/5"
          >
            <Plus className="w-5 h-5" />
          </button>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                setProgressKey((k) => k + 1);
              }}
              className={`relative w-12 h-12 shrink-0 rounded-xl overflow-hidden ring-2 ${
                i === index ? 'ring-brand-500' : 'ring-transparent'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              <span
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSlide(i);
                }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center"
              >
                <X className="w-2.5 h-2.5" />
              </span>
            </button>
          ))}
        </div>
      ) : (
        <form
          onSubmit={submitReply}
          className="flex items-center gap-2 px-3 sm:px-5 py-3 border-t border-black/5 dark:border-white/5"
        >
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a message ..."
            className="flex-1 bg-brand-50 dark:bg-white/5 rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-brand-400"
          />
          <button
            type="submit"
            disabled={!reply.trim()}
            aria-label="Send reply"
            className="w-10 h-10 shrink-0 rounded-full bg-brand-500 text-white flex items-center justify-center disabled:opacity-40 hover:bg-brand-600"
          >
            <Send className="w-[18px] h-[18px]" />
          </button>
        </form>
      )}
    </div>
  );
}
