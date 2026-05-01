import type { TaiwanEvent } from "../data/events";

const taichungGalleryImageLoaders = import.meta.glob<string>(
  "../assets/events/raycafe-taichung-10-19/*.jpg",
  {
    import: "default",
  },
);

const galleryImageLoadersByEventId: Record<
  string,
  Record<string, () => Promise<string>>
> = {
  "raycafe-taichung-10-19": taichungGalleryImageLoaders,
};

export function getEventImages(event: TaiwanEvent): string[] {
  if (event.imageUrls && event.imageUrls.length > 0) return event.imageUrls;
  if (event.imageUrl) return [event.imageUrl];
  return [];
}

export async function loadEventGalleryImages(
  eventId: string,
): Promise<string[]> {
  const loaders = galleryImageLoadersByEventId[eventId];
  if (!loaders) return [];

  return Promise.all(
    Object.entries(loaders)
      .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
      .map(([, loadImage]) => loadImage()),
  );
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
  return Boolean(event.hasGallery);
}

export function getEventDetailPath(eventId: string) {
  return `/events/${eventId}`;
}
