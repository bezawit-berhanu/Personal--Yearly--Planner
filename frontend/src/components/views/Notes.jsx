import { useState } from 'react';
import { usePlannerContext } from '../../context/PlannerContext';
import SectionHeader from '../shared/SectionHeader';
import StatCard from '../shared/StatCard';
import {
  StickyNote, Plus, Search, Trash2, Edit3, Pin, PinOff,
  Tag, Calendar, Sparkles, X, Check, List
} from 'lucide-react';

const CATEGORIES = ['Work', 'Personal', 'Ideas', 'Urgent', 'Reference', 'General'];

const COLOR_MAP = {
  pink: 'bg-pink-100/90 border-pink-300 text-pink-950',
  amber: 'bg-amber-100/90 border-amber-300 text-amber-950',
  green: 'bg-emerald-100/90 border-emerald-300 text-emerald-950',
  blue: 'bg-sky-100/90 border-sky-300 text-sky-950',
  purple: 'bg-purple-100/90 border-purple-300 text-purple-950',
  glass: 'bg-white/80 border-slate-300 text-slate-900 backdrop-blur-md'
};

function RenderNoteContent({ content }) {
  if (!content) return null;
  const lines = content.split('\n');
  const hasBullets = lines.some(l => l.trim().startsWith('•') || l.trim().startsWith('-') || l.trim().startsWith('*'));

  if (!hasBullets) {
    return (
      <p className="text-xs font-medium whitespace-pre-wrap leading-relaxed opacity-90 line-clamp-6">
        {content}
      </p>
    );
  }

  return (
    <div className="text-xs font-medium leading-relaxed opacity-90 space-y-1 line-clamp-6">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
          const text = trimmed.replace(/^[•\-*]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-pink-600 font-bold shrink-0 text-sm leading-none">•</span>
              <span className="flex-1">{text}</span>
            </div>
          );
        }
        return line ? <p key={idx}>{line}</p> : <div key={idx} className="h-1" />;
      })}
    </div>
  );
}

export default function Notes() {
  const { db, addItem, updateField, deleteItem } = usePlannerContext();
  const notes = db.notes || [];

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Work',
    color: 'glass',
    pinned: false,
    content: '',
    date: new Date().toISOString().substring(0, 10)
  });

  const openNewModal = () => {
    setEditingItem(null);
    setForm({
      title: '',
      category: 'Work',
      color: 'glass',
      pinned: false,
      content: '',
      date: new Date().toISOString().substring(0, 10)
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      category: item.category || 'Work',
      color: item.color || 'glass',
      pinned: item.pinned || false,
      content: item.content || '',
      date: item.date || new Date().toISOString().substring(0, 10)
    });
    setModalOpen(true);
  };

  const insertBulletPoint = () => {
    setForm(prev => {
      const content = prev.content || '';
      const endsWithNewline = content.length === 0 || content.endsWith('\n');
      const bulletStr = endsWithNewline ? '• ' : '\n• ';
      return { ...prev, content: content + bulletStr };
    });
  };

  const handleKeyDownContent = (e) => {
    if (e.key === 'Enter') {
      const target = e.target;
      const val = target.value;
      const selectionStart = target.selectionStart;
      const lines = val.substring(0, selectionStart).split('\n');
      const lineBeforeCursor = lines[lines.length - 1];
      
      if (lineBeforeCursor.trim().startsWith('•') || lineBeforeCursor.trim().startsWith('-')) {
        e.preventDefault();
        const prefix = lineBeforeCursor.trim().startsWith('•') ? '\n• ' : '\n- ';
        const newVal = val.substring(0, selectionStart) + prefix + val.substring(selectionStart);
        setForm(prev => ({ ...prev, content: newVal }));
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = selectionStart + prefix.length;
        }, 0);
      }
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingItem) {
      updateField('notes', editingItem.id, 'title', form.title);
      updateField('notes', editingItem.id, 'category', form.category);
      updateField('notes', editingItem.id, 'color', form.color);
      updateField('notes', editingItem.id, 'pinned', form.pinned);
      updateField('notes', editingItem.id, 'content', form.content);
      updateField('notes', editingItem.id, 'date', form.date);
    } else {
      addItem('notes', form);
    }
    setModalOpen(false);
  };

  const togglePin = (item) => {
    updateField('notes', item.id, 'pinned', !item.pinned);
  };

  const filteredNotes = notes.filter(item => {
    const matchSearch = (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
                        (item.content || '').toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const pinnedCount = notes.filter(n => n.pinned).length;
  const ideasCount = notes.filter(n => n.category === 'Ideas').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <SectionHeader
        title="Notes & Scratchpad"
        description="Quick notes, reminders, bullet points, and reference snippets. Pin key notes for fast access."
        onAdd={openNewModal}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Notes" value={notes.length} color="pink" />
        <StatCard label="Pinned Notes" value={pinnedCount} color="amber" />
        <StatCard label="Ideas" value={ideasCount} color="blue" />
        <StatCard label="Categories" value={CATEGORIES.length} color="green" />
      </div>

      {/* Search & Category Filter Bar */}
      <div className="glass-card p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search notes by title or contents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="modal-input pl-9 text-xs font-semibold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-700 shrink-0">Category:</span>
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-2.5 py-1 text-xs font-bold rounded-sm cursor-pointer transition-colors ${
              activeCategory === 'All' ? 'bg-pink-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-pink-50'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-xs font-bold rounded-sm cursor-pointer transition-colors whitespace-nowrap ${
                activeCategory === cat ? 'bg-pink-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-pink-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedNotes.map((item) => {
          const colorClass = COLOR_MAP[item.color] || COLOR_MAP.glass;

          return (
            <div
              key={item.id}
              className={`relative rounded-sm border p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between group ${colorClass}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-white/70 border border-slate-300/80 text-slate-800">
                    {item.category || 'General'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePin(item)}
                      className={`p-1 rounded-sm transition-colors cursor-pointer ${
                        item.pinned ? 'text-amber-600 bg-amber-200/80' : 'text-slate-400 hover:text-slate-700 hover:bg-white/50'
                      }`}
                      title={item.pinned ? 'Unpin note' : 'Pin note'}
                    >
                      {item.pinned ? <Pin className="w-3.5 h-3.5 fill-amber-600" /> : <Pin className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1 text-slate-500 hover:text-pink-700 hover:bg-white/50 rounded-sm cursor-pointer"
                      title="Edit note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteItem('notes', item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-100/70 rounded-sm cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif text-base font-bold mb-2 leading-snug">
                  {item.title}
                </h3>

                <RenderNoteContent content={item.content} />
              </div>

              <div className="pt-3 border-t border-slate-900/10 flex items-center justify-between text-[11px] font-semibold opacity-75 mt-4">
                <span>{item.date}</span>
                {item.pinned && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                    <Pin className="w-3 h-3 fill-amber-700" /> Pinned
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {sortedNotes.length === 0 && (
          <div className="col-span-full glass-card py-16 text-center text-slate-500 font-medium italic text-sm">
            <StickyNote className="w-10 h-10 mx-auto mb-2 text-pink-400 opacity-60" />
            No notes found. Click <strong>Add Entry</strong> to write your first quick note!
          </div>
        )}
      </div>

      {/* Add / Edit Note Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="glass-modal rounded-sm shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-pink-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">
                  {editingItem ? 'Edit Note' : 'New Quick Note'}
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  {editingItem ? 'Update Note' : 'Create Note'}
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
                    Note Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Key take-aways from weekly sync"
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    className="modal-input font-bold text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Category Tag
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                      className="modal-select font-semibold"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Card Color Tint
                    </label>
                    <select
                      value={form.color}
                      onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
                      className="modal-select font-semibold"
                    >
                      <option value="glass">Glass Translucent</option>
                      <option value="pink">Soft Pink</option>
                      <option value="amber">Warm Amber</option>
                      <option value="green">Emerald Green</option>
                      <option value="blue">Sky Blue</option>
                      <option value="purple">Lavender</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase text-slate-700">
                      Note Details & Content
                    </label>
                    <button
                      type="button"
                      onClick={insertBulletPoint}
                      className="text-[11px] font-bold text-pink-600 hover:text-pink-800 bg-pink-50 hover:bg-pink-100 px-2 py-0.5 rounded-sm border border-pink-200 inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <List className="w-3 h-3" /> Add Bullet Point
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    placeholder="Write your note, ideas, or click 'Add Bullet Point' to create a bulleted list..."
                    value={form.content}
                    onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                    onKeyDown={handleKeyDownContent}
                    className="modal-input font-medium text-xs leading-relaxed font-sans"
                  />
                  <p className="text-[10px] text-slate-600 font-semibold mt-1">
                    Tip: Click <strong>Add Bullet Point</strong> or type <code className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200">•</code> or <code className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200">-</code> to start a list. Pressing Enter automatically continues bullet points.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="pinned-check"
                    checked={form.pinned}
                    onChange={(e) => setForm(prev => ({ ...prev, pinned: e.target.checked }))}
                    className="w-4 h-4 accent-pink-500 rounded-sm cursor-pointer"
                  />
                  <label htmlFor="pinned-check" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                    Pin note to top of list
                  </label>
                </div>

              </div>

              <div className="flex items-center justify-between px-5 py-3 border-t border-pink-100 bg-white/40 backdrop-blur-md shrink-0">
                <span className="text-[11px] text-slate-400">* Required field</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary text-xs">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary text-xs">
                    {editingItem ? 'Save Note' : 'Create Note'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
