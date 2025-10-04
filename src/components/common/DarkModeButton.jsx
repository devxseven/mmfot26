import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const DarkModeButton = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      return savedMode === 'true';
    }
    // Default to dark mode if no preference is saved and user prefers dark mode
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <button
          onClick={toggleDarkMode}
          className="btn text-sm md:text-base px-4 py-2 rounded-lg shadow-lg button h-auto min-h-[44px] border no-hover flex items-center gap-2"
        >
          {isDarkMode ? <FaSun className="w-5 h-5 md:w-7 md:h-7" strokeWidth={2} /> : <FaMoon className="w-5 h-5 md:w-7 md:h-7" strokeWidth={2} />}
        </button>
  );
};

export default DarkModeButton;

