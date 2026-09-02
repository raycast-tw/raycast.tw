import { motion } from "framer-motion";
import { ArrowUpRight, LoaderCircle, Play, Video, WifiOff } from "lucide-react";
import {
  RAYCAST_YOUTUBE_CHANNEL_URL,
  type RaycastVideo,
  type VideoFeedStatus,
  useRaycastVideos,
} from "../../hooks/useRaycastVideos";
import { SectionTag } from "../ui/SectionTag";

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatPublishedDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function VideoThumbnail({ video }: { video: RaycastVideo }) {
  const fallbackThumbnailUrl = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;

  return (
    <img
      src={video.thumbnailUrl}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={(event) => {
        if (event.currentTarget.src !== fallbackThumbnailUrl) {
          event.currentTarget.src = fallbackThumbnailUrl;
        }
      }}
      className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
    />
  );
}

function FeaturedVideo({ video }: { video: RaycastVideo }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: [0.25, 0.4, 0.25, 1] }}
      className="group relative min-h-[360px] overflow-hidden rounded-[26px] border border-white/10 bg-[#101113] shadow-[0_44px_110px_-64px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.08)] sm:min-h-[480px] lg:min-h-[580px]"
    >
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-visible:ring-red-accent/70 absolute inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
        aria-label={`在 YouTube 觀看：${video.title}`}
      >
        <VideoThumbnail video={video} />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,10,0.02)_18%,rgba(7,8,10,0.4)_58%,rgba(7,8,10,0.96)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_12%,rgba(255,108,124,0.2)_0%,transparent_34%)] opacity-70 transition duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/42 px-3 py-1.5 text-[11px] font-semibold tracking-[0.15em] text-white/88 uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
            <span className="bg-red-accent size-1.5 rounded-full shadow-[0_0_12px_rgba(255,99,99,0.9)]" />
            最新上架
          </span>
          <span className="font-mono text-[11px] tracking-[0.16em] text-white/60 uppercase">
            Watch / 001
          </span>
        </div>

        <span className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/22 bg-black/38 text-white shadow-[0_18px_50px_-18px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl transition duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-[#101113] sm:size-20">
          <Play className="ml-1 size-6 fill-current sm:size-7" />
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-white/58 uppercase">
            {formatPublishedDate(video.publishedAt)} · Raycast
          </p>
          <h3 className="mt-3 max-w-[740px] text-[28px] leading-[1.08] font-semibold tracking-[-0.025em] text-white sm:text-[38px] lg:text-[44px]">
            {video.title}
          </h3>
          <p className="mt-4 hidden max-w-[640px] text-[15px] leading-[1.65] font-medium text-white/68 sm:block">
            {video.summary}
          </p>
        </div>
      </a>
    </motion.article>
  );
}

function VideoCard({ video, index }: { video: RaycastVideo; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className="group relative min-h-[150px] overflow-hidden rounded-[22px] border border-white/9 bg-[linear-gradient(150deg,rgba(20,21,24,0.96)_0%,rgba(12,13,15,0.98)_100%)] shadow-[0_28px_72px_-52px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 hover:border-white/17"
    >
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-visible:ring-red-accent/70 grid h-full min-h-[150px] grid-cols-[minmax(118px,0.9fr)_minmax(0,1.1fr)] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset sm:grid-cols-[minmax(180px,0.82fr)_minmax(0,1.18fr)] lg:grid-cols-[minmax(150px,0.78fr)_minmax(0,1.22fr)]"
        aria-label={`在 YouTube 觀看：${video.title}`}
      >
        <div className="relative overflow-hidden bg-white/4">
          <VideoThumbnail video={video} />
          <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent_55%,rgba(12,13,15,0.7)_100%)]" />
          <span className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/38 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md transition group-hover:scale-110 group-hover:bg-white group-hover:text-[#101113]">
            <Play className="ml-0.5 size-3.5 fill-current" />
          </span>
        </div>

        <div className="flex min-w-0 flex-col justify-between p-4 sm:p-5">
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] tracking-[0.16em] text-white/42 uppercase">
                Watch / {String(index + 2).padStart(3, "0")}
              </span>
              <ArrowUpRight className="size-3.5 shrink-0 text-white/34 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/82" />
            </div>
            <h3 className="mt-2 line-clamp-3 text-[17px] leading-[1.22] font-semibold tracking-[-0.012em] text-white sm:text-[19px]">
              {video.title}
            </h3>
          </div>
          <p className="mt-3 text-[11px] font-semibold tracking-[0.09em] text-white/44 uppercase sm:text-[12px]">
            {formatPublishedDate(video.publishedAt)}
          </p>
        </div>
      </a>
    </motion.article>
  );
}

function EmptyVideoState({ status }: { status: VideoFeedStatus }) {
  const isSyncing = status === "syncing";

  return (
    <div
      className="flex min-h-[360px] flex-col items-center justify-center rounded-[26px] border border-white/9 bg-[linear-gradient(150deg,rgba(20,21,24,0.82)_0%,rgba(12,13,15,0.92)_100%)] px-6 text-center shadow-[0_44px_110px_-64px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.06)]"
      role="status"
      aria-live="polite"
    >
      <span className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/62">
        {isSyncing ? (
          <LoaderCircle className="size-5 animate-spin" />
        ) : (
          <WifiOff className="size-5" />
        )}
      </span>
      <h3 className="mt-5 text-[20px] font-semibold text-white/88">
        {isSyncing ? "正在同步最新影片" : "暫時無法載入影片"}
      </h3>
      <p className="mt-2 max-w-[420px] text-[14px] leading-[1.65] text-white/48">
        {isSyncing
          ? "正在從 Raycast 官方 YouTube 頻道取得最新內容。"
          : "你仍可前往 Raycast 官方頻道查看最新影片。"}
      </p>
    </div>
  );
}

export function VideosSection() {
  const { videos, status } = useRaycastVideos();
  const [featuredVideo, ...moreVideos] = videos;

  return (
    <section
      id="videos"
      className="relative scroll-mt-[110px] overflow-hidden py-24 md:py-32"
    >
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[880px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,76,100,0.09)_0%,rgba(255,76,100,0.025)_44%,transparent_72%)] blur-2xl"
        aria-hidden="true"
      />

      <div className="relative container">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[650px]">
            <SectionTag>WATCH &amp; LEARN</SectionTag>
            <h2 className="text-foreground mt-3">Raycast 最新影片</h2>
            <p className="text-light-gray mt-5 max-w-[610px] text-[16px] leading-[1.7] font-medium tracking-[0.2px] md:text-[20px]">
              從產品新功能到實戰工作流，跟著官方團隊更快掌握 Raycast。
            </p>
          </div>

          <a
            href={RAYCAST_YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0.035)_100%)] px-4 py-2 text-[13px] font-semibold text-white/76 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition hover:border-white/22 hover:text-white"
          >
            <Video className="text-red-accent size-4" />
            前往官方頻道
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>

        {featuredVideo ? (
          <div className="mt-10 grid gap-3 lg:grid-cols-[minmax(0,1.68fr)_minmax(340px,0.92fr)]">
            <FeaturedVideo video={featuredVideo} />
            <div className="grid gap-3 sm:grid-cols-1">
              {moreVideos.map((video, index) => (
                <VideoCard key={video.id} video={video} index={index} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <EmptyVideoState status={status} />
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <a
            href={RAYCAST_YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.04)_100%)] px-5 py-2.5 text-[14px] font-semibold tracking-[0.2px] text-white/78 shadow-[0_16px_34px_-24px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:border-white/24 hover:bg-white/10 hover:text-white"
          >
            更多影片
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
