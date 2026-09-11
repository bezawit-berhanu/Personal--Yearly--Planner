import { useState } from 'react';
import { usePlannerContext } from '../../context/PlannerContext';
import SectionHeader from '../shared/SectionHeader';
import StatCard from '../shared/StatCard';
import ConfirmDeleteModal from '../shared/ConfirmDeleteModal';
import api from '../../api/client';
import {
  BookHeart, Plus, Search, Trash2, Edit3, Image as ImageIcon,
  Upload, Calendar, Smile, Sparkles, X, Check, Eye
} from 'lucide-react';

const MOOD_OPTIONS = [
  'Energized ⚡',
  'Inspired ✨',
  'Calm 🌿',
  'Grateful 🙏',
  'Reflective 🤔',
  'Focused 🎯',
  'Tired 🥱'
];

export default function Journal() {
  const { db, addItem, updateField, deleteItem } = usePlannerContext();
  const journals = db.journal || [];

  const [search, setSearch] = useState('');
  const [moodFilter, setMoodFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    date: new Date().toISOString().substring(0, 10),
    mood: 'Inspired ✨',
    content: '',
    wallpaper: ''
  });
  const [uploading, setUploading] = useState(false);

  const openNewModal = () => {
    setEditingItem(null);
    setForm({
      title: '',
      date: new Date().toISOString().substring(0, 10),
      mood: 'Inspired ✨',
      content: '',
      wallpaper: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      date: item.date || new Date().toISOString().substring(0, 10),
      mood: item.mood || 'Inspired ✨',
      content: item.content || '',
      wallpaper: item.wallpaper || ''
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const res = await api.post('/files/upload', {
          file_base64: reader.result,
          file_name: `Journal_Wallpaper_${Date.now()}`,
          section_category: 'Journal Wallpaper'
        });
        if (res.data && res.data.file_url) {
          setForm(prev => ({ ...prev, wallpaper: res.data.file_url }));
        }
        setUploading(false);
      };
    } catch (err) {
      console.error('Failed to upload journal wallpaper:', err);
      setUploading(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingItem) {
      updateField('journal', editingItem.id, 'title', form.title);
      updateField('journal', editingItem.id, 'date', form.date);
      updateField('journal', editingItem.id, 'mood', form.mood);
      updateField('journal', editingItem.id, 'content', form.content);
      updateField('journal', editingItem.id, 'wallpaper', form.wallpaper);
    } else {
      addItem('journal', form);
    }
    setModalOpen(false);
  };

  const filteredJournals = journals.filter(item => {
    const matchSearch = (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
                        (item.content || '').toLowerCase().includes(search.toLowerCase());
    const matchMood = moodFilter === 'All' || item.mood === moodFilter;
    return matchSearch && matchMood;
  });

  const withWallpaperCount = journals.filter(j => j.wallpaper).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <SectionHeader
        title="Journal & Daily Reflections"
        description="Write anything on your mind. Customize each journal entry with blurry wallpapers."
        onAdd={openNewModal}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Entries" value={journals.length} color="pink" />
        <StatCard label="With Wallpapers" value={withWallpaperCount} color="blue" />
        <StatCard label="This Month" value={journals.filter(j => (j.date || '').startsWith(new Date().toISOString().substring(0, 7))).length} color="green" />
        <StatCard label="Latest Mood" value={journals[0]?.mood ? journals[0].mood.split(' ')[0] : 'None'} color="amber" />
      </div>

      {/* Filters & Search Bar */}
      <div className="glass-card p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search journal entries by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="modal-input pl-9 text-xs font-semibold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-700 shrink-0">Mood:</span>
          <button
            onClick={() => setMoodFilter('All')}
            className={`px-2.5 py-1 text-xs font-bold rounded-sm cursor-pointer transition-colors ${
              moodFilter === 'All' ? 'bg-pink-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-pink-50'
            }`}
          >
            All
          </button>
          {MOOD_OPTIONS.map(m => (
            <button
              key={m}
              onClick={() => setMoodFilter(m)}
              className={`px-2.5 py-1 text-xs font-bold rounded-sm cursor-pointer transition-colors whitespace-nowrap ${
                moodFilter === m ? 'bg-pink-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-pink-50'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Journal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJournals.map((item) => {
          const hasWallpaper = Boolean(item.wallpaper);

          return (
            <div
              key={item.id}
              className="relative group rounded-sm shadow-sm border border-pink-200/90 overflow-hidden transition-all hover:shadow-md flex flex-col min-h-[220px]"
            >
              {/* Blurry Wallpaper Background Overlay */}
              {hasWallpaper ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110 transition-transform duration-500 group-hover:scale-115"
                    style={{ backgroundImage: `url("${item.wallpaper}")` }}
                  />
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs group-hover:bg-slate-950/30 transition-colors" />
                </>
              ) : (
                <div className="absolute inset-0 bg-white/75 backdrop-blur-md" />
              )}

              {/* Card Content Container */}
              <div className={`relative z-10 p-5 flex flex-col justify-between flex-1 ${hasWallpaper ? 'text-white' : 'text-slate-900'}`}>
                
                {/* Header Row */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                      hasWallpaper
                        ? 'bg-black/40 border-white/20 text-pink-200 backdrop-blur-md'
                        : 'bg-pink-50 border-pink-200 text-pink-700'
                    }`}>
                      {item.mood || 'Reflection'}
                    </span>
                    <span className={`text-[11px] font-semibold flex items-center gap-1 ${hasWallpaper ? 'text-slate-200' : 'text-slate-700'}`}>
                      <Calendar className="w-3 h-3 text-pink-500" />
                      {item.date}
                    </span>
                  </div>

                  <h3 className={`font-serif text-lg font-bold line-clamp-2 ${hasWallpaper ? 'text-white drop-shadow-sm' : 'text-slate-900'}`}>
                    {item.title}
                  </h3>
                </div>

                {/* Excerpt */}
                <p className={`text-xs font-medium my-3 line-clamp-4 leading-relaxed ${hasWallpaper ? 'text-slate-100 drop-shadow-xs' : 'text-slate-700'}`}>
                  {item.content || 'No journal text recorded...'}
                </p>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-200/30 flex items-center justify-between gap-2 mt-auto">
                  <button
                    onClick={() => setViewingItem(item)}
                    className={`text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                      hasWallpaper ? 'text-pink-300 hover:text-white' : 'text-pink-600 hover:text-pink-800'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" /> Read Entry
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
                        hasWallpaper ? 'hover:bg-white/20 text-white' : 'hover:bg-pink-100 text-slate-600'
                      }`}
                      title="Edit journal entry"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteTargetId(item.id)}
                      className="p-1.5 rounded-sm hover:bg-rose-500/80 hover:text-white text-rose-400 transition-colors cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

        {filteredJournals.length === 0 && (
          <div className="col-span-full glass-card py-16 text-center text-slate-500 font-medium italic text-sm">
            <BookHeart className="w-10 h-10 mx-auto mb-2 text-pink-400 opacity-60" />
            No journal entries match your search filter. Click <strong>Add Entry</strong> to start writing!
          </div>
        )}
      </div>

      {/* Add / Edit Journal Entry Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="glass-modal rounded-sm shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-pink-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">
                  {editingItem ? 'Edit Journal Entry' : 'New Journal Entry'}
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  {editingItem ? 'Update Reflection' : 'Write Journal'}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="btn-ghost p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Journal Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Reflections on Startup Progress & Daily Wins"
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    className="modal-input font-bold text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                      className="modal-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Mood
                    </label>
                    <select
                      value={form.mood}
                      onChange={(e) => setForm(prev => ({ ...prev, mood: e.target.value }))}
                      className="modal-select font-semibold"
                    >
                      {MOOD_OPTIONS.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Journal Content
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Write anything you want... express your thoughts, feelings, plans or reflections freely."
                    value={form.content}
                    onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                    className="modal-input font-medium text-xs leading-relaxed"
                  />
                </div>

                {/* Custom Blurry Wallpaper Settings for this card */}
                <div className="pt-3 border-t border-slate-200">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-pink-600" />
                    Custom Blurry Wallpaper Background (Optional)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="modal-input text-xs cursor-pointer"
                      />
                      {uploading && <p className="text-[11px] font-bold text-pink-600 mt-0.5">Uploading wallpaper image...</p>}
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Or image URL (https://...)"
                        value={form.wallpaper}
                        onChange={(e) => setForm(prev => ({ ...prev, wallpaper: e.target.value }))}
                        className="modal-input text-xs"
                      />
                    </div>
                  </div>

                  {form.wallpaper && (
                    <div className="mt-2 relative h-20 border border-slate-300 rounded-sm overflow-hidden bg-cover bg-center shadow-xs" style={{ backgroundImage: `url("${form.wallpaper}")` }}>
                      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-between px-3 text-white">
                        <span className="text-xs font-bold drop-shadow-xs">Blurry Wallpaper Preview</span>
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, wallpaper: '' }))}
                          className="btn-danger text-[10px] py-0.5 px-2"
                        >
                          Remove Wallpaper
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              <div className="flex items-center justify-between px-5 py-3 border-t border-pink-100 bg-white/40 backdrop-blur-md shrink-0">
                <span className="text-[11px] text-slate-400">* Required field</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary text-xs">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary text-xs">
                    {editingItem ? 'Save Changes' : 'Save Journal'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Screen Reader Modal for Journal View */}
      {viewingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setViewingItem(null)}
        >
          <div className="relative w-full max-w-2xl glass-modal rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {viewingItem.wallpaper && (
              <div className="relative h-40 bg-cover bg-center" style={{ backgroundImage: `url("${viewingItem.wallpaper}")` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-pink-500/90 px-2 py-0.5 rounded-sm">
                    {viewingItem.mood}
                  </span>
                  <h2 className="font-serif text-xl font-bold mt-1 text-white drop-shadow-md">
                    {viewingItem.title}
                  </h2>
                </div>
              </div>
            )}

            {!viewingItem.wallpaper && (
              <div className="p-6 pb-3 border-b border-pink-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded-sm">
                  {viewingItem.mood}
                </span>
                <h2 className="font-serif text-xl font-bold mt-2 text-slate-900">
                  {viewingItem.title}
                </h2>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
              <div className="text-xs text-slate-500 font-bold flex items-center gap-1 pb-2 border-b border-pink-100">
                <Calendar className="w-3.5 h-3.5 text-pink-500" />
                Recorded on {viewingItem.date}
              </div>
              <div>{viewingItem.content}</div>
            </div>

            <div className="p-4 border-t border-pink-100 bg-white/40 backdrop-blur-md flex items-center justify-between">
              <button
                onClick={() => { const item = viewingItem; setViewingItem(null); openEditModal(item); }}
                className="btn-secondary text-xs flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Entry
              </button>

              <button
                onClick={() => setViewingItem(null)}
                className="btn-primary text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId !== null) {
            deleteItem('journal', deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        title="Delete Journal Entry"
        message="Are you sure you want to delete this journal reflection? This action cannot be undone."
      />

    </div>
  );
}
