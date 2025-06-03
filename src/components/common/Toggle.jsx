import React from 'react'
import { useTheme } from '@/hooks/ThemeContext';

const Toggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'dark' ? 'light' : 'dark'} mode
    </button>
  );
}

export default Toggle