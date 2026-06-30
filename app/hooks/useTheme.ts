'use client';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'panel-theme';

export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(localStorage.getItem(STORAGE_KEY) === 'dark');
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
  }

  return { dark, toggle };
}
