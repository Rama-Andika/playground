import type { User } from "@/contexts/auth.context";
import type { TResponse } from "@/types/response.type";
import axios from "axios";
import { Capacitor } from "@capacitor/core";
import { storage } from "@/utils/storage";
import { getSubdomain } from "@/utils/get-subdomain";

const url = import.meta.env.VITE_API_URL as string;
const basename = import.meta.env.VITE_BASENAME as string;

const isNative = Capacitor.isNativePlatform();


/** Navigasi ke halaman login setelah sesi habis. */
const redirectToLogin = () => {
  if (isNative) {
    // Di native, router menggunakan Hash History → cukup update hash
    window.location.hash = "#/login";
  } else {
    const loginPath = basename.endsWith("/")
      ? `${basename}login`
      : `${basename}/login`;
    window.location.replace(`${window.location.origin}${loginPath}`);
  }
};

const axiosInstance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------------------------
// Request interceptor
// ---------------------------------------------------------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const userRaw = storage.get("user");
    let user: User | undefined;
    if (userRaw) {
      user = JSON.parse(userRaw);
    }

    if (user && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    const tenantId = getSubdomain();
    if (tenantId) {
      config.headers["X-Tenant-ID"] = tenantId;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ---------------------------------------------------------------------------
// Response interceptor — token refresh
// ---------------------------------------------------------------------------
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const userRaw = storage.get("user");
        let user: User | undefined;
        if (userRaw) {
          user = JSON.parse(userRaw);
        }

        const refreshHeaders: Record<string, string> = {};
        const tenantId = getSubdomain();
        if (tenantId) {
          refreshHeaders["X-Tenant-ID"] = tenantId;
        }

        const response = await axios.post(
          `${url}/rest/auth/refresh`,
          { refreshToken: user?.refreshToken },
          { headers: refreshHeaders },
        );

        const result: TResponse<User> = response.data;
        const token = result.data?.token;
        originalRequest.headers.Authorization = `Bearer ${token}`;

        // Simpan user yang sudah diperbarui ke storage yang sesuai platform
        storage.set("user", JSON.stringify(result.data), { path: basename });

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Hapus sesi & arahkan ke login
        storage.remove("user", { path: basename });
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
