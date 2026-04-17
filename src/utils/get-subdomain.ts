export const getSubdomain = (): string | null => {
  if (typeof window === "undefined") return null;

  const hostname = window.location.hostname;
  const parts = hostname.split(".");

  // Jika diakses langsung via IP atau localhost murni
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    parts.length === 1
  ) {
    return null; // Atau return default tenant jika perlu
  }

  // Mengambil bagian pertama sebagai subdomain
  const subdomain = parts[0];

  // Abaikan jika subdomain adalah "www"
  if (subdomain.toLowerCase() === "www") {
    // Jika formatnya www.tenant.domain.com
    if (parts.length > 2) {
      return parts[1];
    }
    return null;
  }

  return subdomain;
};
