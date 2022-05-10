import { useState, useEffect } from 'react';

const useSessionStorage = (name: string) => {
  const [value, setValue] = useState<string|null>('');

  useEffect(() => {
    setValue(sessionStorage.getItem(name))
  }, []);

  return value;
}

export default useSessionStorage;