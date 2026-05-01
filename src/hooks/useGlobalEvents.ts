import { useEffect, useState } from "react";

export interface GlobalEvent {
  id: string;
  entryApiId: string | null;
  title: string;
  startsAt: string | null;
  endsAt: string | null;
  timezone: string;
  eventUrl: string | null;
  coverUrl: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  countryCode: string | null;
  locationLabel: string;
  latitude: number | null;
  longitude: number | null;
  isFree: boolean;
  isSoldOut: boolean;
  requireApproval: boolean;
  spotsRemaining: number | null;
  hosts: string[];
}

export function hasGlobalEventCoordinates(
  event: GlobalEvent,
): event is GlobalEvent & { latitude: number; longitude: number } {
  return (
    typeof event.latitude === "number" && typeof event.longitude === "number"
  );
}

const LUMA_API_PATH = "/api/luma-events";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  events: GlobalEvent[];
  fetchedAt: number;
}

let memoryCache: CacheEntry | null = null;

export const LOCATION_TBA = "Location TBA";

function getCachedEvents(): GlobalEvent[] | null {
  if (!memoryCache) return null;
  if (Date.now() - memoryCache.fetchedAt >= CACHE_TTL_MS) return null;
  return memoryCache.events;
}

function parseCoordinateValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function formatLocationLabel(addressInfo: Record<string, string>): string {
  const segments = [
    addressInfo?.city,
    addressInfo?.region,
    addressInfo?.country,
  ].filter(Boolean);

  if (segments.length > 0) return segments.join(", ");
  if (addressInfo?.city_state) return addressInfo.city_state;
  if (addressInfo?.short_address) return addressInfo.short_address;
  return LOCATION_TBA;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeEntry(entry: any): GlobalEvent | null {
  const event = entry?.event ?? {};
  const addressInfo = event.geo_address_info ?? {};
  const coordinate = event.coordinate ?? {};
  const ticketInfo = entry?.ticket_info ?? {};
  const eventSlug = event.url ?? "";

  if (!event.start_at) return null;

  return {
    id: event.api_id ?? entry?.api_id ?? `${event.name}-${event.start_at}`,
    entryApiId: entry?.api_id ?? null,
    title: event.name ?? "Untitled Event",
    startsAt: event.start_at ?? null,
    endsAt: event.end_at ?? null,
    timezone: event.timezone ?? "UTC",
    eventUrl: eventSlug ? `https://luma.com/${eventSlug}` : null,
    coverUrl: event.cover_url ?? null,
    city: addressInfo.city ?? null,
    region: addressInfo.region ?? null,
    country: addressInfo.country ?? null,
    countryCode: addressInfo.country_code ?? null,
    locationLabel: formatLocationLabel(addressInfo),
    latitude: parseCoordinateValue(coordinate.latitude),
    longitude: parseCoordinateValue(coordinate.longitude),
    isFree: Boolean(ticketInfo.is_free),
    isSoldOut: Boolean(ticketInfo.is_sold_out),
    requireApproval: Boolean(ticketInfo.require_approval),
    spotsRemaining:
      typeof ticketInfo.spots_remaining === "number"
        ? ticketInfo.spots_remaining
        : null,
    hosts: Array.isArray(entry?.hosts)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        entry.hosts.map((host: any) => host?.name).filter(Boolean)
      : [],
  };
}

function parseApiResponse(payload: unknown): GlobalEvent[] {
  const entries = Array.isArray((payload as Record<string, unknown>)?.entries)
    ? ((payload as Record<string, unknown>).entries as unknown[])
    : [];

  return entries
    .map(normalizeEntry)
    .filter((e): e is GlobalEvent => e !== null)
    .sort(
      (a, b) =>
        new Date(a.startsAt ?? 0).getTime() -
        new Date(b.startsAt ?? 0).getTime(),
    );
}

export interface UseGlobalEventsResult {
  events: GlobalEvent[];
  isLoading: boolean;
  error: string | null;
}

export function useGlobalEvents(): UseGlobalEventsResult {
  const [state, setState] = useState<UseGlobalEventsResult>(() => {
    const cachedEvents = getCachedEvents();
    return {
      events: cachedEvents ?? [],
      isLoading: cachedEvents === null,
      error: null,
    };
  });

  useEffect(() => {
    if (getCachedEvents()) return;

    const controller = new AbortController();

    fetch(LUMA_API_PATH, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((payload: unknown) => {
        const normalized = parseApiResponse(payload);
        memoryCache = { events: normalized, fetchedAt: Date.now() };
        setState({ events: normalized, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setState({
          events: [],
          isLoading: false,
          error: "無法載入活動資料",
        });
      });

    return () => {
      controller.abort();
    };
  }, []);

  return state;
}
