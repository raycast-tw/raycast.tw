import type { TaiwanEvent } from "../data/events";

export function getEventImages(
  event: TaiwanEvent,
  { includeGallery = false } = {},
): string[] {
  if (includeGallery && event.galleryImages && event.galleryImages.length > 0)
    return event.galleryImages;
  if (event.imageUrls && event.imageUrls.length > 0) return event.imageUrls;
  if (event.imageUrl) return [event.imageUrl];
  return [];
}

export function getEventTime(date: string) {
  const eventDate = new Date(`${date}T23:59:59`);
  return eventDate.getTime();
}

export function isPastEvent(date: string, referenceDate = new Date()) {
  const eventTime = getEventTime(date);
  return !Number.isNaN(eventTime) && eventTime < referenceDate.getTime();
}

export function hasEventGallery(event: TaiwanEvent) {
  return Boolean(event.galleryImages && event.galleryImages.length > 0);
}

export function getEventDetailPath(eventId: string) {
  return `/events/${eventId}`;
}
