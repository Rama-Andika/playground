import type { User } from "@/contexts/auth.context";

const host = import.meta.env.VITE_API_URL ?? "";

export const signIn = async (
  username: string,
  password: string,
): Promise<User> => {
  const response = await fetch(`${host}/rest/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const result = await response.json();
  if (!response.ok) throw result.error;
  return result.data;
};
