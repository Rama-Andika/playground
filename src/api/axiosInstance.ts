import type { User } from "@/contexts/auth.context";
import type { TResponse } from "@/types/response.type";
import axios from "axios";
import Cookies from "js-cookie";
import { getSubdomain } from "@/utils/get-subdomain";

const url = import.meta.env.VITE_API_URL as string;
const basename = import.meta.env.VITE_BASENAME;

const axiosInstance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const userCookies = Cookies.get("user");
    let user: User | undefined;
    if (userCookies) {
      user = JSON.parse(userCookies);
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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const userCookies = Cookies.get("user");
        let user: User | undefined;
        if (userCookies) {
          user = JSON.parse(userCookies);
        }

        const refreshHeaders: Record<string, string> = {};
        const tenantId = getSubdomain();
        if (tenantId) {
          refreshHeaders["X-Tenant-ID"] = tenantId;
        }

        const response = await axios.post(
          `${url}/rest/auth/refresh`,
          { refreshToken: user?.refreshToken },
          { headers: refreshHeaders }
        );

        const result: TResponse<User> = response.data;
        const token = result.data?.token;
        originalRequest.headers.Authorization = `Bearer ${token}`;

        Cookies.set("user", JSON.stringify(result.data), { path: basename });
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        Cookies.remove("user", { path: basename });
        window.location.href = `${basename}/login`;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
