import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState({
    bg_wallpaper: '',
    bg_color: '#FFFFFF',
    text_color: '#1A1A2E',
    font_family: 'Inter',
    accent_color: '#E879A0',
    custom_theme_json: {}
  });

  useEffect(() => {
    if (user) {
      api.get('/theme').then(res => {
        if (res.data && res.data.theme) {
          setTheme(res.data.theme);
          applyCssVariables(res.data.theme);
        }
      }).catch(console.error);
    }
  }, [user]);

  const applyCssVariables = (t) => {
    const root = document.documentElement;
    if (t.bg_wallpaper) {
      root.style.setProperty('--theme-wallpaper-url', `url("${t.bg_wallpaper}")`);
    } else {
      root.style.setProperty('--theme-wallpaper-url', 'none');
    }
    root.style.setProperty('--theme-bg-color', t.bg_color || '#FFFFFF');
    root.style.setProperty('--theme-text-color', t.text_color || '#1A1A2E');
    root.style.setProperty('--theme-font-family', t.font_family || 'Inter, sans-serif');
  };

  const updateTheme = async (newSettings) => {
    const updated = { ...theme, ...newSettings };
    setTheme(updated);
    applyCssVariables(updated);
    if (user) {
      try {
        await api.post('/theme', updated);
      } catch (e) {
        console.error('Failed to persist theme:', e);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
