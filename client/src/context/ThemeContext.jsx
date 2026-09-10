import React, { createContext, useContext, useState, useEffect } from 'react';

export const PALETTES = [
  {
    id: 'indigo',
    name: 'Electric Indigo',
    color: '#6366f1',
    secondary: '#8b5cf6',
    desc: 'Modern & sleek AI vibe',
  },
  {
    id: 'emerald',
    name: 'Emerald Eco',
    color: '#10b981',
    secondary: '#14b8a6',
    desc: 'Classic food rescue & earth',
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    color: '#f59e0b',
    secondary: '#f43f5e',
    desc: 'Warm, appetizing & welcoming',
  },
  {
    id: 'ocean',
    name: 'Ocean Azure',
    color: '#3b82f6',
    secondary: '#06b6d4',
    desc: 'Deep crisp blue & turquoise',
  },
  {
    id: 'rose',
    name: 'Rose Luxe',
    color: '#f43f5e',
    secondary: '#ec4899',
    desc: 'Vibrant crimson & magenta',
  },
  {
    id: 'cyber',
    name: 'Cyber Neon',
    color: '#06b6d4',
    secondary: '#d946ef',
    desc: 'Neon cyan & electric purple',
  },
];

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('replate_theme');
    return saved || 'light'; // Default to clean, modern light mode
  });

  const [palette, setPalette] = useState(() => {
    const saved = localStorage.getItem('replate_palette');
    return saved || 'indigo'; // Default to modern Electric Indigo
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('replate_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-palette', palette);
    localStorage.setItem('replate_palette', palette);
  }, [palette]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const changePalette = (newPalette) => {
    setPalette(newPalette);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        palette,
        changePalette,
        palettes: PALETTES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
