import MobileTopBar from './MobileTopBar';
import MobileTabBar from './MobileTabBar';

/**
 * On desktop (md+): list panel and detail panel show side by side, always.
 * On mobile: only one shows at a time, decided by `showDetail`.
 */
export default function ListDetailLayout({ listPanel, detailPanel, showDetail }) {
  return (
    <>
      <div
        className={`${showDetail ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-[340px] lg:w-[380px] shrink-0 bg-surface-panel dark:bg-[#12162a] border-r border-black/5 dark:border-white/5 h-full overflow-hidden`}
      >
        <MobileTopBar />
        {listPanel}
      </div>

      <div
        className={`${showDetail ? 'flex' : 'hidden'} md:flex flex-1 flex-col h-full overflow-hidden bg-surface-main dark:bg-[#0f1220]`}
      >
        {detailPanel}
      </div>

      {!showDetail && <MobileTabBar />}
    </>
  );
}
