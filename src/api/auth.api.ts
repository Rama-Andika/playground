import type { User } from "@/contexts/auth.context";
import { getSubdomain } from "@/utils/get-subdomain";

const host = import.meta.env.VITE_API_URL ?? "";

export const signIn = async (
  username: string,
  password: string,
): Promise<User> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const tenantId = getSubdomain();
  if (tenantId) {
    headers["X-Tenant-ID"] = tenantId;
  }

  const response = await fetch(`${host}/rest/auth/login`, {
    method: "POST",
    headers,
    body: JSON.stringify({ username, password }),
  });
  const result = await response.json();
  if (!response.ok) throw result.error;
  return result.data;
};
