import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

function safeParseJson(val, fallback = {}) {
  if (!val) return fallback;
  if (typeof val === 'object' && val !== null) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === 'object' && parsed !== null) return parsed;
      return fallback;
    } catch (e) {
      return fallback;
    }
  }
  return fallback;
}

export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState({
    bg_wallpaper: '',
    wallpaper_blur: 0,
    card_opacity: 60,
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
          const loaded = res.data.theme;
          const customJson = safeParseJson(loaded.custom_theme_json, {});
          const blurVal = loaded.wallpaper_blur !== undefined ? loaded.wallpaper_blur : (customJson.wallpaper_blur ?? 0);
          const opacityVal = loaded.card_opacity !== undefined ? loaded.card_opacity : (customJson.card_opacity ?? 60);
          const fullTheme = { ...loaded, wallpaper_blur: blurVal, card_opacity: opacityVal, custom_theme_json: customJson };
          setTheme(fullTheme);
          applyCssVariables(fullTheme);
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
    const blurPx = t.wallpaper_blur !== undefined ? t.wallpaper_blur : (t.custom_theme_json?.wallpaper_blur ?? 0);
    root.style.setProperty('--theme-wallpaper-blur', `${blurPx}px`);

    const opacity = t.card_opacity !== undefined ? t.card_opacity : (t.custom_theme_json?.card_opacity ?? 60);
    const alpha = (Number(opacity) / 100).toFixed(2);
    root.style.setProperty('--theme-card-opacity', `${opacity}%`);
    root.style.setProperty('--theme-card-bg', `rgba(255, 255, 255, ${alpha})`);

    root.style.setProperty('--theme-bg-color', t.bg_color || '#FFFFFF');
    root.style.setProperty('--theme-text-color', t.text_color || '#1A1A2E');
    root.style.setProperty('--theme-font-family', t.font_family || 'Inter, sans-serif');
  };

  const updateTheme = async (newSettings) => {
    const updatedCustom = { ...(theme.custom_theme_json || {}), ...(newSettings.custom_theme_json || {}) };
    if (newSettings.wallpaper_blur !== undefined) {
      updatedCustom.wallpaper_blur = newSettings.wallpaper_blur;
    }
    if (newSettings.card_opacity !== undefined) {
      updatedCustom.card_opacity = newSettings.card_opacity;
    }

    const updated = {
      ...theme,
      ...newSettings,
      custom_theme_json: updatedCustom
    };
    setTheme(updated);
    applyCssVariables(updated);
    if (user) {
      try {
        await api.post('/theme', {
          ...updated,
          custom_theme_json: updatedCustom
        });
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
