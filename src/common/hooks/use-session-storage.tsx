// Hook (use-session-storage.tsx)
import { useState, useEffect } from 'react';

export const useSessionStorage = (name: string) => {
  const [value, setValue] = useState<string | null>('');

  useEffect(() => {
    setValue(sessionStorage.getItem(name));
  }, []);

  return value;
};
