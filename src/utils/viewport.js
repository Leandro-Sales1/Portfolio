import { useState, useEffect } from "react";

export function getViewportWidth() {
  if (typeof window === "undefined") return 0;
  const vv = window.visualViewport;
  if (vv) return Math.round(vv.width);
  return window.innerWidth ?? document.documentElement?.clientWidth ?? 0;
}

export function getViewportHeight() {
  if (typeof window === "undefined") return 0;
  const vv = window.visualViewport;
  if (vv) return Math.round(vv.height);
  return window.innerHeight ?? document.documentElement?.clientHeight ?? 0;
}

export function useViewportDimensions() {
  const [dimensions, setDimensions] = useState(() => ({
    width: getViewportWidth(),
    height: getViewportHeight(),
  }));

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: getViewportWidth(),
        height: getViewportHeight(),
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", updateDimensions);
      vv.addEventListener("scroll", updateDimensions);
    }
    return () => {
      window.removeEventListener("resize", updateDimensions);
      if (vv) {
        vv.removeEventListener("resize", updateDimensions);
        vv.removeEventListener("scroll", updateDimensions);
      }
    };
  }, []);

  return dimensions;
}
