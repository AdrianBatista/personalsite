import { SpeedInsights } from "@vercel/speed-insights";

/**
 * Initialize Vercel Speed Insights for real user monitoring (RUM).
 * Tracks Core Web Vitals and performance metrics.
 */
export function initSpeedInsights() {
  try {
    SpeedInsights({
      route: window.location.pathname,
      params: { referrer: document.referrer },
    });
  } catch (error) {
    console.warn("Speed Insights initialization failed:", error);
  }
}
