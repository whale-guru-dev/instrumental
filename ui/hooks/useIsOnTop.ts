import { useEffect, useMemo, useState } from "react";

export const useIsOnTop = (): boolean => {
  const [onTop, setIsOnTop] = useState(true);

  useEffect(() => {
    window.addEventListener("scroll", () =>
      window.scrollY !== 0 ? setIsOnTop(false) : setIsOnTop(true),
    );

    return () => {
      // return a cleanup function to unregister our function since its gonna run multiple times
      window.removeEventListener("scroll", () =>
        window.scrollY !== 0 ? setIsOnTop(false) : setIsOnTop(true),
      );
    };
  }, []);

  return useMemo(() => {
    return onTop;
  }, [onTop]);
};
