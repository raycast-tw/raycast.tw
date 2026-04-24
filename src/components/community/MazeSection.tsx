import { SectionTag } from "../ui/SectionTag";
import { MazeGame } from "../maze";

export function MazeSection() {
  return (
    <section
      id="features"
      className="bg-background hidden scroll-mt-[110px] py-24 md:block md:py-28"
    >
      <div className="container">
        <SectionTag>FEATURES</SectionTag>
        <h2 className="text-foreground mt-2">探索 Raycast 功能迷宮</h2>
        <p className="text-light-gray mt-5 max-w-[600px] text-[16px] leading-[1.6] font-medium tracking-[0.2px] md:text-[18px]">
          透過互動式迷宮遊戲，親身體驗 Raycast
          的強大功能。一步一步解鎖每個驚喜，發現你不知道的生產力秘密。
        </p>

        <div className="mt-14 w-full">
          <div className="relative w-full max-w-[1120px]">
            <div className="relative w-full overflow-hidden rounded-xl border border-white/8 bg-[linear-gradient(180deg,rgba(18,19,23,0.96)_0%,rgba(8,9,12,0.96)_100%)] shadow-[0_40px_120px_-42px_rgba(0,0,0,0.95),0_20px_64px_-30px_rgba(255,88,118,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2 border-b border-white/5 bg-[#0a0b0d] px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#ff5f57]/90" />
                  <span className="size-2.5 rounded-full bg-[#febc2e]/90" />
                  <span className="size-2.5 rounded-full bg-[#28c840]/90" />
                </div>
                <span className="text-subtle ml-2 text-[11px] font-medium tracking-[0.35px]">
                  Raycast Maze
                </span>
              </div>
              <div className="relative h-[min(660px,calc(100vw-2rem))] w-full sm:h-[660px]">
                <MazeGame />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
