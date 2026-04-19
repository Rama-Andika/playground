/**
 * Cross-platform storage adapter.
 *
 * Di browser: menggunakan `js-cookie` agar data survive across tabs & sesi.
 * Di native Capacitor: fallback ke `localStorage` karena `document.cookie`
 * tidak berfungsi secara konsisten di WebView Android/iOS.
 */
import Cookies from "js-cookie";
import { Capacitor } from "@capacitor/core";

const isNative = Capacitor.isNativePlatform();

export const storage = {
  get(key: string): string | undefined {
    if (isNative) {
      return localStorage.getItem(key) ?? undefined;
    }
    return Cookies.get(key);
  },

  set(key: string, value: string, options?: Cookies.CookieAttributes): void {
    if (isNative) {
      localStorage.setItem(key, value);
    } else {
      Cookies.set(key, value, options);
    }
  },

  remove(key: string, options?: Cookies.CookieAttributes): void {
    if (isNative) {
      localStorage.removeItem(key);
    } else {
      Cookies.remove(key, options);
    }
  },
};
