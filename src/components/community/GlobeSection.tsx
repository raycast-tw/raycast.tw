import { useRef, useEffect, useMemo } from "react";
import createGlobe from "cobe";
import { SectionTag } from "../ui/SectionTag";
import { taiwanEvents } from "../../data/events";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

export function GlobeSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const phiRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const pixelRatio = window.devicePixelRatio || 1;

    globeRef.current = createGlobe(canvas, {
      devicePixelRatio: pixelRatio,
      width: canvas.offsetWidth * 2 * pixelRatio,
      height: canvas.offsetHeight * 2 * pixelRatio,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.06, 0.065, 0.07],
      markerColor: [1, 0.39, 0.39],
      glowColor: [1, 1, 1],
      markers: [
        { location: [24.1239, 120.677] as [number, number], size: 0.06 },
      ],
      arcs: [],
      arcColor: [1, 0.39, 0.39],
      arcWidth: 1.5,
      arcHeight: 0.3,
    });

    let animationId: number;
    const animate = () => {
      phiRef.current += 0.003;
      globeRef.current?.update({ phi: phiRef.current });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      globeRef.current?.destroy();
    };
  }, []);

  const recentEvents = useMemo(() => taiwanEvents.slice(0, 4), []);

  return (
    <section id="globe" className="py-20 md:py-28">
      <div className="container">
        <SectionTag>TAIWAN EVENTS</SectionTag>
        <h2 className="text-foreground mt-2">台灣社群活動</h2>
        <p className="text-light-gray mt-4 max-w-[600px] text-[16px] leading-[1.6] font-normal tracking-[0.2px] md:text-[18px]">
          聚焦在台灣社群的活動資訊與交流紀錄。 一眼掌握近期活動與報名入口。
        </p>

        <div className="relative mt-12 grid items-center gap-8 overflow-hidden rounded-[18px] border border-[rgba(72,162,255,0.5)] bg-[linear-gradient(180deg,rgba(4,14,25,0.94)_0%,rgba(4,11,19,0.94)_100%),radial-gradient(circle_at_24%_48%,rgba(94,48,255,0.11)_0%,rgba(94,48,255,0)_42%)] shadow-[0_40px_120px_-64px_rgba(0,0,0,0.98),0_0_0_1px_rgba(28,132,255,0.25),inset_0_1px_0_rgba(146,208,255,0.14)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(rgba(130,175,225,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(130,175,225,0.04)_1px,transparent_1px)] before:mask-[linear-gradient(120deg,rgba(0,0,0,0.64)_0%,rgba(0,0,0,0.2)_56%,rgba(0,0,0,0)_100%)] before:bg-size-[108px_108px] lg:grid-cols-[1fr_400px]">
          <div className="relative flex min-h-[460px] items-center justify-center max-lg:min-h-[380px]">
            <div
              className="pointer-events-none absolute h-[min(54%,250px)] w-[min(70%,360px)] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,82,115,0.24)_0%,rgba(100,42,255,0.16)_38%,rgba(14,26,47,0)_76%)] blur-[26px]"
              aria-hidden="true"
            />
            <canvas
              ref={canvasRef}
              className="relative z-10 size-[300px] sm:size-[350px] md:size-[400px] lg:size-[450px]"
            />
          </div>

          <div className="relative z-10 flex flex-col gap-3 pr-[1.1rem] max-lg:px-4 max-lg:pb-4">
            <h3 className="text-[18px] font-medium tracking-[0.2px] text-[rgba(235,246,255,0.96)]">
              近期活動
            </h3>
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-2 rounded-[14px] border border-[rgba(147,188,230,0.16)] bg-[linear-gradient(180deg,rgba(16,33,51,0.66)_0%,rgba(11,20,34,0.82)_100%)] p-4 shadow-[0_20px_50px_-38px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(180,222,255,0.08)] transition hover:translate-y-[-3px] hover:border-[rgba(119,180,255,0.3)] hover:shadow-[0_34px_72px_-44px_rgba(0,0,0,0.95),0_0_42px_-30px_rgba(89,168,255,0.34),inset_0_1px_0_rgba(194,230,255,0.14)]"
              >
                <h4 className="text-[15px] font-medium tracking-normal text-[rgba(243,249,255,0.96)]">
                  {event.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-[13px] font-normal tracking-[0.2px] text-[rgba(194,214,235,0.72)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {event.location}
                  </span>
                  {event.url && (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-accent flex items-center gap-0.5 hover:opacity-60"
                    >
                      詳情
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
