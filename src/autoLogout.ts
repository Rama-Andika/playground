import { useEffect, useCallback, useRef } from "react";
import Cookies from "js-cookie";

const basename = import.meta.env.VITE_BASENAME;

const AUTO_LOGOUT_TIME = 30 * 60 * 1000; // 30 menit

const AutoLogout = () => {
  const logoutTimerRef = useRef<number | null>(null);

  const logoutUser = useCallback(() => {
    Cookies.remove("user", { path: basename });
    Cookies.remove("authenticated", { path: basename });
    window.location.href = `${basename}/login`;
  }, []);

  const resetTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    logoutTimerRef.current = window.setTimeout(logoutUser, AUTO_LOGOUT_TIME);
  }, [logoutUser]);

  useEffect(() => {
    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "keydown",
      "click",
      "touchstart",
      "scroll",
    ];

    events.forEach((event) =>
      window.addEventListener(event, resetTimer, { passive: true })
    );

    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [resetTimer]);

  return null;
};

export default AutoLogout;
