import { useEffect } from "react";
import { useLocation } from "react-router";

function scrollToHashTarget(hash: string) {
  const targetId = decodeURIComponent(hash.slice(1));
  const target = document.getElementById(targetId);

  if (!target) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return;
  }

  target.scrollIntoView({ block: "start", behavior: "auto" });
}

export function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) {
      return;
    }

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      if (location.hash) {
        scrollToHashTarget(location.hash);
        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [location.pathname, location.hash]);

  return null;
}
