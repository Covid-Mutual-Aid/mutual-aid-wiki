import React, { useState, useEffect } from 'react';

// Overload types
function useLocalyStoredState<S = undefined>(
  key: string,
  initialState: S
): [S, React.Dispatch<React.SetStateAction<S>>];

function useLocalyStoredState<S = undefined>(
  key: string
): [S | undefined, React.Dispatch<React.SetStateAction<S | undefined>>];

// Implementation
function useLocalyStoredState<S>(key: string, initialState?: S) {
  let local = localStorage.getItem(key);
  const [state, setState] = useState<S>(local ? JSON.parse(local) : initialState);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}
export default useLocalyStoredState
