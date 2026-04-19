import { Capacitor } from "@capacitor/core";

/**
 * Mengambil tenant ID dari berbagai sumber tergantung platform:
 *
 * 1. **Native (Android/iOS via Capacitor)**: Membaca dari env var
 *    `VITE_TENANT_ID` yang di-set saat build, atau dari `localStorage`
 *    jika pernah di-set secara dinamis.
 *
 * 2. **Browser**: Mengekstrak subdomain dari `window.location.hostname`.
 *    Contoh: `akidsmaginepg.oxysystem.com` → `"akidsmaginepg"`
 */
export const getSubdomain = (): string | null => {
  // --- Native platform (Capacitor Android / iOS) ---
  if (Capacitor.isNativePlatform()) {
    // Prioritas 1: override dinamis yang disimpan di localStorage
    const stored = localStorage.getItem("tenantId");
    if (stored) return stored;

    // Prioritas 2: nilai statis dari build-time env var
    const envTenant = import.meta.env.VITE_TENANT_ID as string | undefined;
    return envTenant ?? null;
  }

  // --- Web browser ---
  if (typeof window === "undefined") return null;

  const hostname = window.location.hostname;
  const parts = hostname.split(".");

  // Akses langsung via IP / localhost → tidak ada subdomain
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    parts.length === 1
  ) {
    return null;
  }

  const subdomain = parts[0];

  // Abaikan "www", tapi cek apakah ada tenant di bagian berikutnya
  if (subdomain.toLowerCase() === "www") {
    return parts.length > 2 ? parts[1] : null;
  }

  return subdomain;
};
