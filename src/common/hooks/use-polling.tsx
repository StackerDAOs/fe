// Hook (use-polling.tsx)
import { useEffect, useRef } from 'react';

export const usePolling = (callback: any, isPolling: boolean | null) => {
  const savedCallback = useRef<HTMLDivElement | any>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (isPolling) {
      const id = setInterval(tick, 7500);
      return () => {
        clearInterval(id);
      };
    }
  }, [callback, isPolling]);
};
