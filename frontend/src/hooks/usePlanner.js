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

  // Fetch active tab section data from API
  const fetchSectionData = useCallback(async (tab) => {
    if (!user) return;
    try {
      const res = await api.get(`/sections/${tab}`);
      const data = res.data && res.data.data ? res.data.data : [];
      const parsedData = Array.isArray(data) ? data : (typeof data === 'string' ? JSON.parse(data) : []);
      setSections(prev => ({ ...prev, [tab]: parsedData }));
      loadedSectionsRef.current.add(tab);
    } catch (e) {
      console.error(`Failed to load section ${tab}:`, e);
      setSections(prev => ({ ...prev, [tab]: prev[tab] || [] }));
      if (e.response && e.response.status !== 401) {
        loadedSectionsRef.current.add(tab);
      }
    }
  }, [user]);

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

  const saveSection = useCallback(async (key, newData) => {
    setSections(prev => ({ ...prev, [key]: newData }));
    loadedSectionsRef.current.add(key);
    try {
      await api.post(`/sections/${key}`, { data: newData });
    } catch (e) {
      console.error(`Failed to save section ${key}:`, e);
    }
  }, []);

  const updateField = useCallback((key, id, field, value) => {
    setSections(prev => {
      const list = prev[key] || [];
      const updated = list.map(item => item.id === id ? { ...item, [field]: value } : item);
      api.post(`/sections/${key}`, { data: updated }).catch(console.error);
      return { ...prev, [key]: updated };
    });
    loadedSectionsRef.current.add(key);
  }, []);

  const addItem = useCallback((key, newItem) => {
    setSections(prev => {
      const list = prev[key] || [];
      const updated = [{ id: Date.now() + Math.floor(Math.random() * 1000), ...newItem }, ...list];
      api.post(`/sections/${key}`, { data: updated }).catch(console.error);
      return { ...prev, [key]: updated };
    });
    loadedSectionsRef.current.add(key);
  }, []);

  const deleteItem = useCallback((key, id) => {
    setSections(prev => {
      const list = prev[key] || [];
      const updated = list.filter(item => item.id !== id);
      api.post(`/sections/${key}`, { data: updated }).catch(console.error);
      return { ...prev, [key]: updated };
    });
    loadedSectionsRef.current.add(key);
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
