import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { signIn as signInApi } from "../api/auth.api";
import Cookies from "js-cookie";
import ToastError from "@/components/toast/toast-error";
const basename = import.meta.env.VITE_BASENAME;

export type User = {
  userId: string;
  fullName: string;
  level: number;
  token: string;
  refreshToken: string;
};

export type Auth = {
  user: User | null;
  authenticated: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = React.createContext<Auth>({
  user: null,
  authenticated: false,
  signIn: async () => {},
  signOut: async () => {},
});

const getStoredUser = () => {
  const cookie = Cookies.get("user");
  return cookie ? JSON.parse(cookie) : null;
};
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const authenticated = !!user;

  const signIn = React.useCallback(
    async (username: string, password: string) => {
      try {
        const user = await signInApi(username, password);
        setUser(user);
        Cookies.set("user", JSON.stringify(user), { path: basename });
      } catch (error) {
        toast(<ToastError message="Invalid username or password" />);
        throw error;
      }
    },
    [],
  );

  const signOut = React.useCallback(async () => {
    setUser(null);
    Cookies.remove("user", { path: basename });
  }, []);

  useEffect(() => {
    setUser(getStoredUser);
  }, []);

  return (
    <AuthContext
      value={{
        user: user,
        authenticated: authenticated,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext>
  );
};

export default AuthProvider;

export const useAuth = () => React.useContext(AuthContext);
