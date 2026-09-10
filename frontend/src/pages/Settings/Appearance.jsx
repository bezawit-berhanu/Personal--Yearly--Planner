import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import api from '../../api/client';
import SectionHeader from '../../components/shared/SectionHeader';
import { Palette, Image as ImageIcon, Type, RefreshCw, Upload, Check } from 'lucide-react';

export default function Appearance() {
  const { theme, updateTheme } = useTheme();

  const [wallpaperUrl, setWallpaperUrl] = useState(theme.bg_wallpaper || '');
  const [wallpaperBlur, setWallpaperBlur] = useState(
    theme.wallpaper_blur !== undefined ? theme.wallpaper_blur : (theme.custom_theme_json?.wallpaper_blur ?? 0)
  );
  const [cardOpacity, setCardOpacity] = useState(
    theme.card_opacity !== undefined ? theme.card_opacity : (theme.custom_theme_json?.card_opacity ?? 60)
  );
  const [bgColor, setBgColor] = useState(theme.bg_color || '#FFFFFF');
  const [textColor, setTextColor] = useState(theme.text_color || '#1A1A2E');
  const [accentColor, setAccentColor] = useState(theme.accent_color || '#E879A0');
  const [fontFamily, setFontFamily] = useState(theme.font_family || 'Inter');
  const [uploading, setUploading] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const handleSaveTheme = async (e) => {
    e.preventDefault();
    await updateTheme({
      bg_wallpaper: wallpaperUrl,
      wallpaper_blur: Number(wallpaperBlur),
      card_opacity: Number(cardOpacity),
      bg_color: bgColor,
      text_color: textColor,
      accent_color: accentColor,
      font_family: fontFamily
    });
    setSavedMessage('Theme settings applied and saved to your account!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleWallpaperUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const res = await api.post('/files/upload', {
          file_base64: reader.result,
          file_name: `Wallpaper_${Date.now()}`,
          section_category: 'Theme Wallpaper'
        });

        if (res.data && res.data.file_url) {
          setWallpaperUrl(res.data.file_url);
          updateTheme({
            bg_wallpaper: res.data.file_url,
            wallpaper_blur: Number(wallpaperBlur),
            card_opacity: Number(cardOpacity)
          });
        }
        setUploading(false);
      };
    } catch (err) {
      console.error('Failed to upload wallpaper:', err);
      setUploading(false);
    }
  };

  const resetDefault = () => {
    const def = {
      bg_wallpaper: '',
      wallpaper_blur: 0,
      card_opacity: 60,
      bg_color: '#FFFFFF',
      text_color: '#1A1A2E',
      font_family: 'Inter',
      accent_color: '#E879A0'
    };
    setWallpaperUrl('');
    setWallpaperBlur(0);
    setCardOpacity(60);
    setBgColor('#FFFFFF');
    setTextColor('#1A1A2E');
    setAccentColor('#E879A0');
    setFontFamily('Inter');
    updateTheme(def);
  };

  const BLUR_PRESETS = [
    { label: '0px (Crisp)', val: 0 },
    { label: '4px (Soft)', val: 4 },
    { label: '8px (Balanced)', val: 8 },
    { label: '16px (Heavy)', val: 16 },
    { label: '24px (Ultra)', val: 24 }
  ];

  const OPACITY_PRESETS = [
    { label: '0% (Fully Clear)', val: 0 },
    { label: '30% (Light Glass)', val: 30 },
    { label: '60% (Balanced)', val: 60 },
    { label: '85% (Solid Glass)', val: 85 },
    { label: '100% (Solid White)', val: 100 }
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Aesthetic Theme & UI Customization"
        description="Upload custom wallpaper background, customize font colors, blur intensity, card transparency, and accent themes."
      />

      {savedMessage && (
        <div className="p-3 bg-emerald-50/90 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          {savedMessage}
        </div>
      )}

      <form onSubmit={handleSaveTheme} className="glass-card p-6 rounded-sm shadow-sm space-y-6">

        {/* Wallpaper Upload */}
        <div>
          <h3 className="font-serif text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-pink-600" />
            Background Wallpaper Image
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Upload Custom Wallpaper Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleWallpaperUpload}
                className="modal-input text-xs cursor-pointer font-semibold"
              />
              {uploading && <p className="text-[11px] font-bold text-pink-700 mt-1">Uploading wallpaper...</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Or Wallpaper Image Direct URL
              </label>
              <input
                type="text"
                className="modal-input font-semibold"
                placeholder="https://images.unsplash.com/..."
                value={wallpaperUrl}
                onChange={(e) => {
                  setWallpaperUrl(e.target.value);
                  updateTheme({ bg_wallpaper: e.target.value, wallpaper_blur: Number(wallpaperBlur), card_opacity: Number(cardOpacity) });
                }}
              />
            </div>
          </div>

          {/* Wallpaper Blur Intensity Control */}
          <div className="mt-4 pt-4 border-t border-slate-200/60">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                Wallpaper Blur Intensity: <span className="text-pink-600 font-extrabold">{wallpaperBlur}px</span>
              </label>
              <div className="flex items-center gap-1">
                {BLUR_PRESETS.map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => {
                      setWallpaperBlur(p.val);
                      updateTheme({ wallpaper_blur: p.val });
                    }}
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-sm border cursor-pointer transition-colors ${
                      Number(wallpaperBlur) === p.val
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'bg-white/80 text-slate-700 border-slate-300 hover:bg-pink-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">0px</span>
              <input
                type="range"
                min={0}
                max={30}
                step={1}
                value={wallpaperBlur}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWallpaperBlur(val);
                  updateTheme({ wallpaper_blur: val });
                }}
                className="flex-1 accent-pink-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-500">30px</span>
            </div>
          </div>

          {/* Component Card Transparency Control */}
          <div className="mt-4 pt-4 border-t border-slate-200/60">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                Component Card Opacity / Transparency: <span className="text-pink-600 font-extrabold">{cardOpacity}% Solid ({100 - cardOpacity}% Translucent)</span>
              </label>
              <div className="flex items-center gap-1 overflow-x-auto">
                {OPACITY_PRESETS.map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => {
                      setCardOpacity(p.val);
                      updateTheme({ card_opacity: p.val });
                    }}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-sm border cursor-pointer transition-colors whitespace-nowrap ${
                      Number(cardOpacity) === p.val
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'bg-white/80 text-slate-700 border-slate-300 hover:bg-pink-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">0% (Clear)</span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={cardOpacity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCardOpacity(val);
                  updateTheme({ card_opacity: val });
                }}
                className="flex-1 accent-pink-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-500">100% (Opaque)</span>
            </div>
          </div>

          {wallpaperUrl && (
            <div className="mt-3 relative h-32 border border-slate-300 rounded-sm overflow-hidden bg-cover bg-center shadow-xs" style={{ backgroundImage: `url("${wallpaperUrl}")` }}>
              <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-between px-4 text-white">
                <span className="text-xs font-bold drop-shadow-md">
                  Wallpaper Preview (Active Blur: {wallpaperBlur}px)
                </span>
                <button
                  type="button"
                  onClick={() => { setWallpaperUrl(''); updateTheme({ bg_wallpaper: '' }); }}
                  className="btn-danger text-[10px] py-0.5 px-2"
                >
                  Remove Wallpaper
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Font Color & Styling */}
        <div className="pt-4 border-t border-slate-200/80">
          <h3 className="font-serif text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-pink-600" />
            Color Palette & Font Styling
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Global Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-9 h-9 border border-slate-300 rounded-sm cursor-pointer p-0.5"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
                <input
                  type="text"
                  className="modal-input flex-1 font-semibold"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Global Font Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-9 h-9 border border-slate-300 rounded-sm cursor-pointer p-0.5"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                />
                <input
                  type="text"
                  className="modal-input flex-1 font-semibold"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pink Accent Theme Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-9 h-9 border border-slate-300 rounded-sm cursor-pointer p-0.5"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                />
                <input
                  type="text"
                  className="modal-input flex-1 font-semibold"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Font Family */}
        <div className="pt-4 border-t border-slate-200/80">
          <h3 className="font-serif text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Type className="w-4 h-4 text-pink-600" />
            Global Font Family
          </h3>

          <div className="max-w-xs">
            <select
              className="modal-select font-semibold"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            >
              <option value="Inter">Inter (Clean Modern Sans)</option>
              <option value="Playfair Display">Playfair Display (Elegant Serif)</option>
              <option value="Georgia">Georgia (Classic Serif)</option>
              <option value="Fira Code">Fira Code (Monospace)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
          <button
            type="button"
            onClick={resetDefault}
            className="btn-secondary text-xs flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Default Pure White/Pink
          </button>

          <button type="submit" className="btn-primary text-xs">
            Apply & Save Theme
          </button>
        </div>

      </form>
    </div>
  );
}
