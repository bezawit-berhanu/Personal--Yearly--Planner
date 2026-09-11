import { useState, useCallback, useEffect, useRef } from 'react';
import api from '../api/client';

export function usePlanner(user) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sections, setSections] = useState({});
  const sectionsRef = useRef({});
  const loadedSectionsRef = useRef(new Set());

  // Helper to set section data synchronously in ref & state
  const updateSectionState = useCallback((key, data) => {
    sectionsRef.current[key] = data;
    setSections(prev => ({ ...prev, [key]: data }));
    loadedSectionsRef.current.add(key);
  }, []);

  // Reset loaded cache when user changes (login/logout)
  useEffect(() => {
    sectionsRef.current = {};
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
      updateSectionState(tab, parsedData);
      return parsedData;
    } catch (e) {
      console.error(`Failed to load section ${tab}:`, e);
      const fallback = sectionsRef.current[tab] || [];
      updateSectionState(tab, fallback);
      if (e.response && e.response.status !== 401) {
        loadedSectionsRef.current.add(tab);
      }
      return fallback;
    }
  }, [user, updateSectionState]);

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
      return await fetchSectionData(key);
    }
    return sectionsRef.current[key] || [];
  };

  const saveSection = useCallback(async (key, newData) => {
    updateSectionState(key, newData);
    try {
      await api.post(`/sections/${key}`, { data: newData });
    } catch (e) {
      console.error(`Failed to save section ${key}:`, e);
    }
  }, [updateSectionState]);

  const updateField = useCallback(async (key, id, field, value) => {
    const currentList = await ensureSectionLoaded(key);
    const updated = currentList.map(item => item.id === id ? { ...item, [field]: value } : item);
    updateSectionState(key, updated);
    try {
      await api.post(`/sections/${key}`, { data: updated });
    } catch (e) {
      console.error(`Failed to update field in section ${key}:`, e);
    }
  }, [updateSectionState]);

  const addItem = useCallback(async (key, newItem) => {
    const currentList = await ensureSectionLoaded(key);
    const updated = [{ id: Date.now() + Math.floor(Math.random() * 1000), ...newItem }, ...currentList];
    updateSectionState(key, updated);
    try {
      await api.post(`/sections/${key}`, { data: updated });
    } catch (e) {
      console.error(`Failed to add item in section ${key}:`, e);
    }
  }, [updateSectionState]);

  const deleteItem = useCallback(async (key, id) => {
    const currentList = await ensureSectionLoaded(key);
    const updated = currentList.filter(item => item.id !== id);
    updateSectionState(key, updated);
    try {
      await api.post(`/sections/${key}`, { data: updated });
    } catch (e) {
      console.error(`Failed to delete item from section ${key}:`, e);
    }
  }, [updateSectionState]);

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

