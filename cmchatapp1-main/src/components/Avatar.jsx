function initials(name = '') {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-24 h-24 text-2xl',
};

export default function Avatar({ src, name, size = 'md', online, className = '' }) {
  const dim = sizes[size] || sizes.md;
  return (
    <div className={`relative shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${dim} rounded-full object-cover ring-2 ring-white dark:ring-[#1a1e30]`}
        />
      ) : (
        <div
          className={`${dim} rounded-full ring-2 ring-white dark:ring-[#1a1e30] bg-brand-500 text-white flex items-center justify-center font-semibold`}
        >
          {initials(name)}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-online ring-2 ring-white dark:ring-[#1a1e30]" />
      )}
    </div>
  );
}
