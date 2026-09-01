import { createContext, useContext, useEffect, useState } from 'react';

export const THEMES = {
  dark: {
    id: 'dark',
    name: 'Deep Space',
    emoji: '🌌',
    bg:        '#050B18',
    bgCard:    '#0D1627',
    bgBorder:  '#1E2D45',
    text:      '#E2E8F0',
    textMuted: '#64748B',
    primary:   '#2563EB',
    secondary: '#06B6D4',
    accent:    '#38BDF8',
  },
  navy: {
    id: 'navy',
    name: 'Dark Navy',
    emoji: '🌊',
    bg:        '#0F172A',
    bgCard:    '#1E293B',
    bgBorder:  '#334155',
    text:      '#F8FAFC',
    textMuted: '#94A3B8',
    primary:   '#3B82F6',
    secondary: '#06B6D4',
    accent:    '#60A5FA',
  },
  light: {
    id: 'light',
    name: 'Off White',
    emoji: '☀️',
    bg:        '#F8FAFC',
    bgCard:    '#FFFFFF',
    bgBorder:  '#E2E8F0',
    text:      '#0F172A',
    textMuted: '#64748B',
    primary:   '#3B82F6',
    secondary: '#0EA5E9',
    accent:    '#2563EB',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    emoji: '🌙',
    bg:        '#000000',
    bgCard:    '#111111',
    bgBorder:  '#222222',
    text:      '#FFFFFF',
    textMuted: '#888888',
    primary:   '#A855F7',
    secondary: '#EC4899',
    accent:    '#C084FC',
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    emoji: '🌿',
    bg:        '#0A1628',
    bgCard:    '#0F2236',
    bgBorder:  '#1A3A4A',
    text:      '#E0F2F1',
    textMuted: '#5E8A8A',
    primary:   '#10B981',
    secondary: '#06B6D4',
    accent:    '#34D399',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    emoji: '🌅',
    bg:        '#1A0A0F',
    bgCard:    '#2D1020',
    bgBorder:  '#4A1F35',
    text:      '#FFF1F5',
    textMuted: '#9D6070',
    primary:   '#F43F5E',
    secondary: '#FB923C',
    accent:    '#FB7185',
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('portfolio_theme') || 'dark';
  });

  const theme = THEMES[themeId] || THEMES.dark;

  useEffect(() => {
    const root = document.documentElement;
    // Apply CSS variables
    root.style.setProperty('--bg',         theme.bg);
    root.style.setProperty('--bg-card',    theme.bgCard);
    root.style.setProperty('--bg-border',  theme.bgBorder);
    root.style.setProperty('--text',       theme.text);
    root.style.setProperty('--text-muted', theme.textMuted);
    root.style.setProperty('--primary',    theme.primary);
    root.style.setProperty('--secondary',  theme.secondary);
    root.style.setProperty('--accent',     theme.accent);

    // Apply body background directly for instant change
    document.body.style.backgroundColor = theme.bg;
    document.body.style.color = theme.text;

    // Add theme class to root
    root.setAttribute('data-theme', themeId);
    localStorage.setItem('portfolio_theme', themeId);
  }, [themeId, theme]);

  const setTheme = (id) => {
    if (THEMES[id]) setThemeId(id);
  };

  // Keep isDark for backwards compat
  const isDark = !['light'].includes(themeId);
  const toggleTheme = () => setThemeId(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, themeId, setTheme, isDark, toggleTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
