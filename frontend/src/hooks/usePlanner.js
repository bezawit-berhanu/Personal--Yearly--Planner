import { useState, useCallback, useEffect, useRef } from 'react';
import api from '../api/client';

export function usePlanner(user) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sections, setSections] = useState({});
  const loadedSectionsRef = useRef(new Set());

  // Reset loaded cache when user changes (login/logout)
  useEffect(() => {
    loadedSectionsRef.current.clear();
    setSections({});
  }, [user?.id]);

  // Fetch section data from TiDB Cloud API
  const fetchSectionData = useCallback(async (tab) => {
    if (!user) return [];
    try {
      const res = await api.get(`/sections/${tab}`);
      const data = res.data && res.data.data ? res.data.data : [];
      const parsedData = Array.isArray(data) ? data : (typeof data === 'string' ? JSON.parse(data) : []);
      setSections(prev => ({ ...prev, [tab]: parsedData }));
      loadedSectionsRef.current.add(tab);
      return parsedData;
    } catch (e) {
      console.error(`Failed to load section ${tab}:`, e);
      const fallback = [];
      setSections(prev => ({ ...prev, [tab]: prev[tab] || fallback }));
      if (e.response && e.response.status !== 401) {
        loadedSectionsRef.current.add(tab);
      }
      return fallback;
    }
  }, [user]);

  // Pre-fetch primary sections on login
  useEffect(() => {
    if (user) {
      const primarySections = ['goals', 'habits', 'tasks', 'notes', 'journal', 'dashboard', 'financeCashflow'];
      primarySections.forEach(sec => {
        if (!loadedSectionsRef.current.has(sec)) {
          fetchSectionData(sec);
        }
      });
    }
  }, [user, fetchSectionData]);

  // Fetch active tab whenever activeTab changes
  useEffect(() => {
    if (user && !loadedSectionsRef.current.has(activeTab)) {
      fetchSectionData(activeTab);
    }
  }, [user, activeTab, fetchSectionData]);

  const navigateTo = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const ensureSectionLoaded = async (key) => {
    if (!loadedSectionsRef.current.has(key)) {
      const existing = await fetchSectionData(key);
      return existing;
    }
    return sections[key] || [];
  };

  const saveSection = useCallback(async (key, newData) => {
    setSections(prev => ({ ...prev, [key]: newData }));
    loadedSectionsRef.current.add(key);
    try {
      await api.post(`/sections/${key}`, { data: newData });
    } catch (e) {
      console.error(`Failed to save section ${key}:`, e);
    }
  }, []);

  const updateField = useCallback(async (key, id, field, value) => {
    const currentList = await ensureSectionLoaded(key);
    const updated = currentList.map(item => item.id === id ? { ...item, [field]: value } : item);
    setSections(prev => ({ ...prev, [key]: updated }));
    loadedSectionsRef.current.add(key);
    try {
      await api.post(`/sections/${key}`, { data: updated });
    } catch (e) {
      console.error(`Failed to update field in section ${key}:`, e);
    }
  }, []);

  const addItem = useCallback(async (key, newItem) => {
    const currentList = await ensureSectionLoaded(key);
    const updated = [{ id: Date.now() + Math.floor(Math.random() * 1000), ...newItem }, ...currentList];
    setSections(prev => ({ ...prev, [key]: updated }));
    loadedSectionsRef.current.add(key);
    try {
      await api.post(`/sections/${key}`, { data: updated });
    } catch (e) {
      console.error(`Failed to add item in section ${key}:`, e);
    }
  }, []);

  const deleteItem = useCallback(async (key, id) => {
    const currentList = await ensureSectionLoaded(key);
    const updated = currentList.filter(item => item.id !== id);
    setSections(prev => ({ ...prev, [key]: updated }));
    loadedSectionsRef.current.add(key);
    try {
      await api.post(`/sections/${key}`, { data: updated });
    } catch (e) {
      console.error(`Failed to delete item from section ${key}:`, e);
    }
  }, []);

  const db = {
    activeTab,
    sidebarOpen,
    ...sections
  };

  return {
    db,
    activeTab,
    sidebarOpen,
    navigateTo,
    toggleSidebar,
    updateField,
    addItem,
    deleteItem,
    fetchSectionData,
    saveSection
  };
}
