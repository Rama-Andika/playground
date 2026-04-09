import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const useCookie = <T>(
  key: string,
  initialValue: T,
  path?: { path: string }
) => {
  const [state, setState] = useState(() => {
    const cache = Cookies.get(key);
    return cache ? JSON.parse(cache) : initialValue;
  });

  useEffect(() => {
    if (state) {
      Cookies.set(key, JSON.stringify(state), path);
    }
  }, [key, state, path]);

  return [state, setState] as const;
};

export default useCookie;
