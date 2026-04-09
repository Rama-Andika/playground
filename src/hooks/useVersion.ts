import { useEffect, useRef } from "react";

/**
 * Auto checks version.json periodically.
 * If version is updated, triggers a page reload.
 *
 * @param interval - How often to check (ms), default: 60,000 (1 minute)
 */
const basename = import.meta.env.VITE_BASENAME;

export const useVersion = (interval: number = 30000) => {
  const currentVersion = useRef<string | null>(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const res = await fetch(`${basename}/version.json?ts=${Date.now()}`); // prevent caching
        const data = await res.json();

        if (!data?.version) {
          console.warn("⚠️ version.json missing 'version' field");
          return;
        }

        if (!currentVersion.current) {
          currentVersion.current = data.version;
          console.log(`Current Version ${currentVersion.current}`);
        } else if (data.version !== currentVersion.current) {
          console.log(
            `🔄 New version detected (${data.version}), reloading...`
          );
          window.location.reload();
        }
      } catch (err) {
        console.warn("❌ Version check failed:", err);
      }
    };

    const timer = setInterval(checkVersion, interval);
    return () => clearInterval(timer);
  }, [interval]);
};
