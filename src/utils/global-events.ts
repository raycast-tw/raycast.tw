import { LOCATION_TBA, type GlobalEvent } from "../hooks/useGlobalEvents";

export function formatGlobalEventDateTime(
  event: Pick<GlobalEvent, "startsAt" | "timezone">,
) {
  if (!event.startsAt) return "Date TBA";

  try {
    return new Intl.DateTimeFormat("zh-TW", {
      month: "short",
      day: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: event.timezone,
      timeZoneName: "short",
    }).format(new Date(event.startsAt));
  } catch {
    return event.startsAt;
  }
}

export function getGlobalEventLocation(
  event: Pick<GlobalEvent, "locationLabel" | "city" | "country">,
) {
  if (event.locationLabel && event.locationLabel !== LOCATION_TBA)
    return event.locationLabel;

  const fallback = [event.city, event.country].filter(Boolean).join(", ");
  return fallback || "地點待公布";
}
