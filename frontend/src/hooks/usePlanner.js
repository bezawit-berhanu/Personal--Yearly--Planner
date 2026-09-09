import { useState, useCallback, useEffect } from 'react';
import api from '../api/client';

export function usePlanner() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch active tab section data from API
  const fetchSectionData = useCallback(async (tab) => {
    try {
      const res = await api.get(`/sections/${tab}`);
      if (res.data && res.data.data) {
        setSections(prev => ({ ...prev, [tab]: res.data.data }));
      } else {
        setSections(prev => ({ ...prev, [tab]: prev[tab] || [] }));
      }
    } catch (e) {
      console.error(`Failed to load section ${tab}:`, e);
      setSections(prev => ({ ...prev, [tab]: prev[tab] || [] }));
    }
  }, []);

  useEffect(() => {
    fetchSectionData(activeTab);
  }, [activeTab, fetchSectionData]);

  const navigateTo = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const saveSection = useCallback(async (key, newData) => {
    setSections(prev => ({ ...prev, [key]: newData }));
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
  }, []);

  const addItem = useCallback((key, newItem) => {
    setSections(prev => {
      const list = prev[key] || [];
      const updated = [{ id: Date.now(), ...newItem }, ...list];
      api.post(`/sections/${key}`, { data: updated }).catch(console.error);
      return { ...prev, [key]: updated };
    });
  }, []);

  const deleteItem = useCallback((key, id) => {
    setSections(prev => {
      const list = prev[key] || [];
      const updated = list.filter(item => item.id !== id);
      api.post(`/sections/${key}`, { data: updated }).catch(console.error);
      return { ...prev, [key]: updated };
    });
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
