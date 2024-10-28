import { useState, useEffect } from 'react';

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    //The initial value is just the returned value of the function
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  //Storing watched list items in localStorage
  useEffect(() => {
    localStorage.setItem(`${key}`, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
