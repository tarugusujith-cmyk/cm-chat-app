import ListDetailLayout from '../../components/ListDetailLayout';
import SettingsSubHeader from '../../components/SettingsSubHeader';
import Checkbox from '../../components/Checkbox';
import { usePreferences } from '../../context/PreferencesContext';

const SWATCHES = [
  '#16261f',
  '#1f6f54',
  '#2f9e74',
  '#2b6a8a',
  '#c98585',
  '#a79a95',
  '#180a10',
  '#4b5e14',
  '#b13d78',
  '#4bbf96',
  '#d98a4c',
  '#c9bdf0',
  '#062617',
  '#d9a3a3',
  '#2b2b2b',
  '#a3157e',
  '#5b5a8d',
  '#3fbf8f',
  '#8a5a2b',
  '#26268c',
];

export default function WallpaperPage() {
  const { wallpaper, setWallpaper } = usePreferences();

  const listPanel = (
    <>
      <SettingsSubHeader title="Set Chat Wallpaper" />
      <div className="flex-1 overflow-y-auto scroll-thin px-5">
        <label className="flex items-center justify-between gap-3 mb-4">
          <span className="text-sm font-medium">Enable Talk Doodle</span>
          <Checkbox
            checked={wallpaper.doodle}
            onChange={(v) => setWallpaper('doodle', v)}
            ariaLabel="Enable Talk Doodle"
          />
        </label>

        <div className="grid grid-cols-3 gap-3 pb-6">
          <button
            onClick={() => setWallpaper('color', null)}
            className={`aspect-square rounded-2xl flex items-center justify-center text-xs font-medium bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 ${
              !wallpaper.color ? 'ring-2 ring-brand-500' : ''
            }`}
          >
            Default
          </button>
          {SWATCHES.map((color) => (
            <button
              key={color}
              onClick={() => setWallpaper('color', color)}
              aria-label={`Wallpaper ${color}`}
              className={`aspect-square rounded-2xl ${
                wallpaper.color === color ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-[#12162a]' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </>
  );

  return (
    <ListDetailLayout
      listPanel={listPanel}
      detailPanel={<WallpaperPreview color={wallpaper.color} doodle={wallpaper.doodle} />}
      showDetail={false}
    />
  );
}

function WallpaperPreview({ color, doodle }) {
  return (
    <div className="hidden md:flex flex-1 flex-col h-full">
      <div className="text-center py-4 font-semibold text-sm border-b border-black/5 dark:border-white/5">
        Wallpaper Preview
      </div>
      <div
        className="flex-1 relative"
        style={{
          backgroundColor: color || '#f4f6fc',
          backgroundImage: doodle
            ? 'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)'
            : undefined,
          backgroundSize: doodle ? '18px 18px' : undefined,
        }}
      />
    </div>
  );
}
