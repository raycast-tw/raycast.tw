import { useEffect, useState } from "react";

const YOUTUBE_FEED_ENDPOINT = "/api/raycast-videos";
const ATOM_NAMESPACE = "http://www.w3.org/2005/Atom";
const YOUTUBE_NAMESPACE = "http://www.youtube.com/xml/schemas/2015";
const MEDIA_NAMESPACE = "http://search.yahoo.com/mrss/";
const VIDEO_LIMIT = 4;

export interface RaycastVideo {
  id: string;
  title: string;
  publishedAt: string;
  url: string;
  thumbnailUrl: string;
  summary: string;
}

export const RAYCAST_YOUTUBE_CHANNEL_URL =
  "https://www.youtube.com/@raycastapp/videos";

export type VideoFeedStatus = "syncing" | "live" | "error";

function getTextByNamespace(
  element: Element,
  namespace: string,
  localName: string,
) {
  return (
    element.getElementsByTagNameNS(namespace, localName).item(0)?.textContent ??
    ""
  ).trim();
}

function createSummary(description: string) {
  const firstParagraph = description.split(/\n\s*\n/, 1)[0] ?? "";
  const cleaned = firstParagraph
    .replace(/https?:\/\/\S+/g, "")
    .replace(/#\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return "Raycast 官方最新影片，點擊前往 YouTube 觀看完整內容。";
  }

  return cleaned.length > 180 ? `${cleaned.slice(0, 177).trim()}…` : cleaned;
}

export function parseRaycastVideosFeed(xml: string): RaycastVideo[] {
  const document = new DOMParser().parseFromString(xml, "application/xml");

  if (document.querySelector("parsererror")) {
    throw new Error("Invalid YouTube feed XML");
  }

  return Array.from(document.getElementsByTagNameNS(ATOM_NAMESPACE, "entry"))
    .slice(0, VIDEO_LIMIT)
    .map((entry) => {
      const id = getTextByNamespace(entry, YOUTUBE_NAMESPACE, "videoId");
      const title = getTextByNamespace(entry, ATOM_NAMESPACE, "title");
      const publishedAt = getTextByNamespace(
        entry,
        ATOM_NAMESPACE,
        "published",
      );
      const description = getTextByNamespace(
        entry,
        MEDIA_NAMESPACE,
        "description",
      );

      if (!id || !title || !publishedAt) {
        throw new Error("Incomplete YouTube feed entry");
      }

      return {
        id,
        title,
        publishedAt,
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        summary: createSummary(description),
      };
    });
}

export function useRaycastVideos() {
  const [videos, setVideos] = useState<RaycastVideo[]>([]);
  const [status, setStatus] = useState<VideoFeedStatus>("syncing");

  useEffect(() => {
    const controller = new AbortController();

    async function syncVideos() {
      try {
        const response = await fetch(YOUTUBE_FEED_ENDPOINT, {
          headers: { Accept: "application/atom+xml, application/xml" },
          cache: "no-cache",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`YouTube feed returned ${response.status}`);
        }

        const latestVideos = parseRaycastVideosFeed(await response.text());
        if (latestVideos.length === 0) {
          throw new Error("YouTube feed returned no videos");
        }

        setVideos(latestVideos);
        setStatus("live");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.warn("Unable to sync Raycast videos.", error);
        setStatus("error");
      }
    }

    void syncVideos();

    return () => controller.abort();
  }, []);

  return { videos, status };
}
