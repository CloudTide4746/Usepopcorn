import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  const [addedMovie, setAdded] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return JSON.parse(storedValue);
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(addedMovie));
    },
    [addedMovie, key]
  );
  return [addedMovie, setAdded];
}
