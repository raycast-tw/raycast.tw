import {
  type KeyboardEvent as ReactKeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import createGlobe from "cobe";
import { Calendar, ExternalLink, Globe, MapPin } from "lucide-react";
import { SectionTag } from "../ui/SectionTag";
import {
  hasGlobalEventCoordinates,
  useGlobalEvents,
  type GlobalEvent,
} from "../../hooks/useGlobalEvents";
import {
  formatGlobalEventDateTime,
  getGlobalEventLocation,
} from "../../utils/global-events";

type GlobeAngles = {
  phi: number;
  theta: number;
};

type GlobePoint = {
  x: number;
  y: number;
  z: number;
};

type GlobeMarker = {
  eventId: string;
  id: string;
  location: [number, number];
  size: number;
  color: [number, number, number];
};

const ANGLE_EPSILON = 0.0006;
const GLOBE_WARMUP_FRAMES = 90;
const DUPLICATE_MARKER_OFFSET_DEGREES = 0.9;

function normalizeAngle(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function interpolateAngle(from: number, to: number, factor: number) {
  const delta = normalizeAngle(to - from);
  return normalizeAngle(from + delta * factor);
}

function getGlobeAngles(latitude: number, longitude: number): GlobeAngles {
  const lat = (latitude * Math.PI) / 180;
  const lon = (longitude * Math.PI) / 180;
  const x = Math.cos(lat) * Math.cos(lon);
  const y = Math.sin(lat);
  const z = -Math.cos(lat) * Math.sin(lon);
  const phi = Math.atan2(-x, z);
  const depth = Math.sqrt(x * x + z * z);
  const theta = Math.atan2(y, depth);

  return { phi, theta };
}

function getWorldPoint(latitude: number, longitude: number): GlobePoint {
  const lat = (latitude * Math.PI) / 180;
  const lon = (longitude * Math.PI) / 180;

  return {
    x: Math.cos(lat) * Math.cos(lon),
    y: Math.sin(lat),
    z: -Math.cos(lat) * Math.sin(lon),
  };
}

function projectPointToCanvas(
  point: GlobePoint,
  angles: GlobeAngles,
  radius: number,
  centerX: number,
  centerY: number,
): { x: number; y: number; depth: number } {
  const cosPhi = Math.cos(angles.phi);
  const sinPhi = Math.sin(angles.phi);
  const cosTheta = Math.cos(angles.theta);
  const sinTheta = Math.sin(angles.theta);

  const xPhi = point.x * cosPhi + point.z * sinPhi;
  const zPhi = point.z * cosPhi - point.x * sinPhi;

  const yTheta = point.y * cosTheta - zPhi * sinTheta;
  const zTheta = zPhi * cosTheta + point.y * sinTheta;

  return {
    x: centerX + xPhi * radius,
    y: centerY - yTheta * radius,
    depth: zTheta,
  };
}

function normalizeLongitude(longitude: number) {
  return ((((longitude + 180) % 360) + 360) % 360) - 180;
}

function offsetMarkerLocation(
  latitude: number,
  longitude: number,
  angle: number,
  radiusDegrees: number,
): [number, number] {
  const latOffset = Math.sin(angle) * radiusDegrees;
  const lonScale = Math.max(Math.cos((latitude * Math.PI) / 180), 0.35);
  const lonOffset = (Math.cos(angle) * radiusDegrees) / lonScale;

  return [
    Math.max(-85, Math.min(85, latitude + latOffset)),
    normalizeLongitude(longitude + lonOffset),
  ];
}

function buildMarkers(
  events: Array<GlobalEvent & { latitude: number; longitude: number }>,
): GlobeMarker[] {
  const groupedEvents = new Map<
    string,
    Array<GlobalEvent & { latitude: number; longitude: number }>
  >();

  for (const event of events) {
    const key = `${event.latitude.toFixed(5)}:${event.longitude.toFixed(5)}`;
    const group = groupedEvents.get(key);
    if (group) {
      group.push(event);
    } else {
      groupedEvents.set(key, [event]);
    }
  }

  return Array.from(groupedEvents.values()).flatMap((group) => {
    const orderedGroup = [...group].sort((left, right) => {
      const leftTime = left.startsAt ? new Date(left.startsAt).getTime() : 0;
      const rightTime = right.startsAt ? new Date(right.startsAt).getTime() : 0;
      if (leftTime !== rightTime) return leftTime - rightTime;
      return left.id.localeCompare(right.id);
    });

    if (orderedGroup.length === 1) {
      const [event] = orderedGroup;
      return [
        {
          eventId: event.id,
          id: `global-event-${event.id}`,
          location: [event.latitude, event.longitude],
          size: 0.045,
          color: [1, 0.388, 0.388],
        },
      ];
    }

    return orderedGroup.map((event, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / orderedGroup.length;
      return {
        eventId: event.id,
        id: `global-event-${event.id}`,
        location: offsetMarkerLocation(
          event.latitude,
          event.longitude,
          angle,
          DUPLICATE_MARKER_OFFSET_DEGREES,
        ),
        size: 0.045,
        color: [1, 0.388, 0.388],
      };
    });
  });
}

function handleSelectableCardKeyDown(
  event: ReactKeyboardEvent<HTMLElement>,
  onSelect: () => void,
) {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  onSelect();
}

interface EventCardProps {
  event: GlobalEvent;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const EventCard = memo(function EventCard({
  event,
  isSelected,
  onSelect,
}: EventCardProps) {
  const handleClick = useCallback(
    () => onSelect(event.id),
    [event.id, onSelect],
  );
  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLElement>) =>
      handleSelectableCardKeyDown(e, handleClick),
    [handleClick],
  );

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group relative overflow-hidden rounded-[24px] border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(120,188,255,0.5)] sm:p-5 ${
        isSelected
          ? "border-[rgba(255,94,122,0.34)] bg-[linear-gradient(180deg,rgba(28,16,21,0.96)_0%,rgba(16,17,24,0.96)_100%)] shadow-[0_36px_90px_-58px_rgba(0,0,0,1),0_0_0_1px_rgba(255,118,146,0.08),inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "border-white/10 bg-[linear-gradient(180deg,rgba(18,20,25,0.94)_0%,rgba(12,13,17,0.96)_100%)] shadow-[0_34px_82px_-62px_rgba(0,0,0,0.96),inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-white/16 hover:bg-[linear-gradient(180deg,rgba(20,22,27,0.96)_0%,rgba(13,14,18,0.98)_100%)]"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(255,92,112,0.12)_0%,rgba(255,92,112,0)_32%),radial-gradient(circle_at_18%_88%,rgba(85,179,255,0.12)_0%,rgba(85,179,255,0)_28%)] opacity-0 transition duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="relative z-10 flex gap-4">
        <div className="hidden h-[104px] w-[98px] shrink-0 overflow-hidden rounded-[18px] border border-white/8 bg-white/5 sm:block">
          {event.coverUrl ? (
            <img
              src={event.coverUrl}
              alt={event.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-end bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_100%)] p-3">
              <span className="text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase">
                Raycast
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] text-white/58 uppercase">
              {event.city ?? event.country ?? "TBA"}
            </span>
          </div>

          <h3 className="mt-3 text-[22px] leading-[1.18] font-medium tracking-[-0.02em] text-white">
            {event.title}
          </h3>

          <div className="mt-3 flex flex-col gap-2 text-[13px] font-medium tracking-[0.2px] text-white/62">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {formatGlobalEventDateTime(event)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {getGlobalEventLocation(event)}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-5 flex items-center justify-end gap-4 border-t border-white/8 pt-4 text-[12px] font-semibold tracking-[0.14em] uppercase">
        {event.eventUrl ? (
          <a
            href={event.eventUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(mouseEvent) => mouseEvent.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-white/72 transition hover:opacity-60"
          >
            活動頁
            <ExternalLink className="size-3.5" />
          </a>
        ) : null}
      </div>
    </article>
  );
});

export function GlobalEventsSection() {
  const { events, isLoading, error } = useGlobalEvents();

  const mappableEvents = useMemo(
    () => events.filter(hasGlobalEventCoordinates),
    [events],
  );
  const firstEvent = events[0] ?? null;
  const firstMappableEvent = mappableEvents[0] ?? null;

  const [userSelectedEventId, setSelectedEventId] = useState("");
  const selectedEventId = useMemo(() => {
    if (events.some((event) => event.id === userSelectedEventId)) {
      return userSelectedEventId;
    }
    return firstMappableEvent?.id ?? firstEvent?.id ?? "";
  }, [events, firstEvent?.id, firstMappableEvent?.id, userSelectedEventId]);

  const selectedEvent =
    events.find((event) => event.id === selectedEventId) ?? firstEvent;
  const focusedEvent = useMemo(() => {
    if (!selectedEvent) return firstMappableEvent;
    if (hasGlobalEventCoordinates(selectedEvent)) return selectedEvent;

    if (selectedEvent.city) {
      const sameCityEvent = mappableEvents.find(
        (event) =>
          event.city &&
          event.city.toLocaleLowerCase() ===
            selectedEvent.city?.toLocaleLowerCase(),
      );
      if (sameCityEvent) return sameCityEvent;
    }

    if (selectedEvent.country) {
      const sameCountryEvent = mappableEvents.find(
        (event) =>
          event.country &&
          event.country.toLocaleLowerCase() ===
            selectedEvent.country?.toLocaleLowerCase(),
      );
      if (sameCountryEvent) return sameCountryEvent;
    }

    return firstMappableEvent;
  }, [firstMappableEvent, mappableEvents, selectedEvent]);

  const countriesCount = useMemo(
    () => new Set(events.map((event) => event.country).filter(Boolean)).size,
    [events],
  );
  const globeMarkers = useMemo(
    () => buildMarkers(mappableEvents),
    [mappableEvents],
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const globeMarkersRef = useRef<GlobeMarker[]>(globeMarkers);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const feedHeaderRef = useRef<HTMLDivElement>(null);
  const currentAnglesRef = useRef<GlobeAngles>({ phi: 0, theta: 0.22 });
  const targetAnglesRef = useRef<GlobeAngles>({ phi: 0, theta: 0.22 });
  const isDraggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, phi: 0, theta: 0 });
  const animationFrameIdRef = useRef(0);
  const warmupFramesRef = useRef(0);
  const [eventFeedMaxHeight, setEventFeedMaxHeight] = useState<number | null>(
    null,
  );

  const startAnimation = useCallback((forceFrames = 0) => {
    warmupFramesRef.current = Math.max(warmupFramesRef.current, forceFrames);
    window.cancelAnimationFrame(animationFrameIdRef.current);

    const animate = () => {
      const currentAngles = currentAnglesRef.current;
      const targetAngles = targetAnglesRef.current;

      const nextPhi = interpolateAngle(
        currentAngles.phi,
        targetAngles.phi,
        0.14,
      );
      const nextTheta =
        currentAngles.theta + (targetAngles.theta - currentAngles.theta) * 0.14;

      const phiDelta = Math.abs(normalizeAngle(nextPhi - currentAngles.phi));
      const thetaDelta = Math.abs(nextTheta - currentAngles.theta);
      const shouldWarmup = warmupFramesRef.current > 0;

      if (phiDelta > ANGLE_EPSILON || thetaDelta > ANGLE_EPSILON) {
        currentAngles.phi = nextPhi;
        currentAngles.theta = nextTheta;
      }

      if (
        phiDelta > ANGLE_EPSILON ||
        thetaDelta > ANGLE_EPSILON ||
        shouldWarmup
      ) {
        if (shouldWarmup) {
          warmupFramesRef.current -= 1;
        }

        globeRef.current?.update({
          phi: currentAngles.phi,
          theta: currentAngles.theta,
        });
        animationFrameIdRef.current = window.requestAnimationFrame(animate);
      }
    };

    animationFrameIdRef.current = window.requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    globeMarkersRef.current = globeMarkers;
  }, [globeMarkers]);

  useEffect(() => {
    if (!canvasRef.current || !firstMappableEvent) return;

    const initialAngles = getGlobeAngles(
      firstMappableEvent.latitude,
      firstMappableEvent.longitude,
    );

    currentAnglesRef.current = initialAngles;
    targetAnglesRef.current = initialAngles;

    const canvas = canvasRef.current;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    let bootstrapFrameId = 0;

    const initGlobe = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      if (width === 0 || height === 0) {
        bootstrapFrameId = window.requestAnimationFrame(initGlobe);
        return;
      }

      globeRef.current = createGlobe(canvas, {
        devicePixelRatio: pixelRatio,
        width: width * pixelRatio,
        height: height * pixelRatio,
        phi: initialAngles.phi,
        theta: initialAngles.theta,
        dark: 1,
        diffuse: 1.25,
        mapSamples: 18000,
        mapBrightness: 5.6,
        mapBaseBrightness: 0.04,
        baseColor: [0.08, 0.1, 0.12],
        markerColor: [1, 0.28, 0.36],
        glowColor: [1, 1, 1],
        markers: buildMarkers(mappableEvents),
        arcs: [],
        arcColor: [1, 0.4, 0.44],
        arcWidth: 1.2,
        arcHeight: 0.2,
        markerElevation: 0.03,
        opacity: 1,
        scale: 1,
      });
      globeRef.current.update({
        phi: targetAnglesRef.current.phi,
        theta: targetAnglesRef.current.theta,
      });
      startAnimation(GLOBE_WARMUP_FRAMES);
    };

    initGlobe();

    const resizeObserver = new ResizeObserver(() => {
      if (!canvasRef.current) return;
      globeRef.current?.update({
        width: canvasRef.current.offsetWidth * pixelRatio,
        height: canvasRef.current.offsetHeight * pixelRatio,
      });
      startAnimation(2);
    });

    resizeObserver.observe(canvas);

    canvas.style.cursor = "grab";

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      dragMovedRef.current = false;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        phi: targetAnglesRef.current.phi,
        theta: targetAnglesRef.current.theta,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMovedRef.current = true;
      const phiSensitivity = Math.PI / canvas.offsetWidth;
      const thetaSensitivity = Math.PI / 4 / canvas.offsetHeight;
      targetAnglesRef.current = {
        phi: dragStartRef.current.phi + dx * phiSensitivity,
        theta: Math.max(
          -0.5,
          Math.min(0.8, dragStartRef.current.theta + dy * thetaSensitivity),
        ),
      };
      startAnimation();
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = "grab";
    };

    const onCanvasClick = (e: MouseEvent) => {
      if (dragMovedRef.current) return;
      if (mappableEvents.length === 0) return;

      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const radius = Math.min(canvas.offsetWidth, canvas.offsetHeight) * 0.47;
      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;
      const angles = currentAnglesRef.current;

      let closestEventId: string | null = null;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const marker of globeMarkersRef.current) {
        const projected = projectPointToCanvas(
          getWorldPoint(marker.location[0], marker.location[1]),
          angles,
          radius,
          centerX,
          centerY,
        );
        if (projected.depth < 0) continue;

        const distance = Math.hypot(projected.x - clickX, projected.y - clickY);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEventId = marker.eventId;
        }
      }

      if (closestEventId && closestDistance <= 24) {
        setSelectedEventId(closestEventId);
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("click", onCanvasClick);

    return () => {
      window.cancelAnimationFrame(bootstrapFrameId);
      window.cancelAnimationFrame(animationFrameIdRef.current);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("click", onCanvasClick);
      globeRef.current?.destroy();
      globeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstMappableEvent?.id, mappableEvents]);

  useEffect(() => {
    if (!focusedEvent) return;

    targetAnglesRef.current = getGlobeAngles(
      focusedEvent.latitude,
      focusedEvent.longitude,
    );
    globeRef.current?.update({ markers: globeMarkers });
    startAnimation();
  }, [focusedEvent, globeMarkers, startAnimation]);

  useEffect(() => {
    const updateEventFeedHeight = () => {
      if (window.innerWidth < 1024) {
        setEventFeedMaxHeight(null);
        return;
      }

      const leftPanelHeight = leftPanelRef.current?.offsetHeight ?? 0;
      const feedHeaderHeight = feedHeaderRef.current?.offsetHeight ?? 0;
      const nextHeight = Math.max(0, leftPanelHeight - feedHeaderHeight);

      setEventFeedMaxHeight(nextHeight > 0 ? nextHeight : null);
    };

    updateEventFeedHeight();

    const resizeObserver = new ResizeObserver(updateEventFeedHeight);
    if (leftPanelRef.current) resizeObserver.observe(leftPanelRef.current);
    if (feedHeaderRef.current) resizeObserver.observe(feedHeaderRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isLoading]);

  if (isLoading || error || !firstEvent) return null;

  return (
    <section id="globe" className="scroll-mt-[110px] py-24 md:py-28">
      <div className="container">
        <SectionTag>GLOBAL EVENTS</SectionTag>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[720px]">
            <h2 className="text-foreground mt-2">Raycast 全球活動</h2>
            <p className="text-light-gray mt-5 max-w-[620px] text-[16px] leading-[1.7] font-medium tracking-[0.2px] md:text-[20px]">
              從舊金山、紐約、孟買到多倫多，直接掌握 Raycast 在世界各地的
              meetup。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] text-white/62 uppercase">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
              {events.length} Events
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
              {countriesCount} Countries
            </span>
          </div>
        </div>

        <div className="mt-12 grid items-start gap-5 lg:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.94fr)]">
          <div
            ref={leftPanelRef}
            className="relative overflow-hidden rounded-[28px] border border-[rgba(112,164,225,0.18)] bg-[linear-gradient(180deg,rgba(7,14,23,0.96)_0%,rgba(7,12,20,0.98)_100%)] shadow-[0_56px_140px_-72px_rgba(0,0,0,1),0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.08)]"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_26%_30%,rgba(83,168,255,0.14)_0%,rgba(83,168,255,0)_34%),radial-gradient(circle_at_74%_76%,rgba(255,91,118,0.18)_0%,rgba(255,91,118,0)_32%)]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] mask-[linear-gradient(130deg,rgba(0,0,0,0.76)_0%,rgba(0,0,0,0.2)_54%,rgba(0,0,0,0)_100%)] bg-size-[104px_104px]"
              aria-hidden="true"
            />

            <div className="relative flex items-center justify-center py-6 sm:py-8">
              <div
                className="pointer-events-none absolute h-[min(60%,290px)] w-[min(72%,420px)] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,88,118,0.2)_0%,rgba(77,153,255,0.14)_38%,rgba(6,16,27,0)_76%)] blur-[30px]"
                aria-hidden="true"
              />
              <canvas
                ref={canvasRef}
                className="relative z-10 mx-auto my-auto block size-[320px] sm:size-[390px] md:size-[460px] lg:size-[520px]"
              />
            </div>

            <div className="relative z-10 border-t border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] px-5 py-5 sm:px-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-[12px] font-semibold tracking-[0.14em] text-white/68 uppercase">
                  <Globe className="size-3.5" />
                  {focusedEvent ? "Globe Focus" : "Globe Overview"}
                </span>
              </div>

              <h3 className="mt-4 text-[26px] leading-[1.12] font-medium tracking-[-0.02em] text-white">
                {selectedEvent?.title}
              </h3>

              <div className="mt-3 flex flex-col gap-2 text-[14px] font-medium tracking-[0.2px] text-white/64">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {selectedEvent
                    ? formatGlobalEventDateTime(selectedEvent)
                    : "Date TBA"}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {selectedEvent
                    ? getGlobalEventLocation(selectedEvent)
                    : "地點待公布"}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(12,13,17,0.74)_0%,rgba(9,10,14,0.88)_100%)] shadow-[0_34px_88px_-62px_rgba(0,0,0,0.98),inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div
              ref={feedHeaderRef}
              className="flex items-center border-b border-white/8 px-4 py-4 sm:px-5"
            >
              <span className="text-[12px] font-semibold tracking-[0.14em] text-white/56 uppercase">
                活動動態
              </span>
            </div>

            <div
              className="grid gap-3 overflow-y-auto p-3 sm:p-4"
              style={
                eventFeedMaxHeight
                  ? { maxHeight: `${eventFeedMaxHeight}px` }
                  : undefined
              }
            >
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isSelected={event.id === selectedEvent?.id}
                  onSelect={setSelectedEventId}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
