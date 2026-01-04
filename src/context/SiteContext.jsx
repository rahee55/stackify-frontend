import { createContext, useState, useContext } from 'react';

export const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  [cite_start]// Mock initial data based on SDD "Website" Class [cite: 403]
  // Updated to include 'theme' property
  const [siteData, setSiteData] = useState({
    title: 'My New Site',
    theme: 'default', // <--- Default Theme added here
    blocks: [
      { id: '1', type: 'header', content: 'Welcome to Stackify', styles: { backgroundColor: '#ffffff', color: '#000000' } },
      { id: '2', type: 'text', content: 'This is an AI-generated website.', styles: { padding: '20px' } },
    ]
  });

  const [selectedBlockId, setSelectedBlockId] = useState(null);

  // Add a new block to the site
  const addBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: `New ${type} block`,
      styles: { padding: '10px' }
    };
    setSiteData(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
  };

  // Update a specific block's content or styles
  const updateBlock = (id, updates) => {
    setSiteData(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  // NEW: Function to change the global theme
  const changeTheme = (themeKey) => {
    setSiteData(prev => ({ ...prev, theme: themeKey }));
  };

  const selectedBlock = siteData.blocks.find(b => b.id === selectedBlockId);

  return (
    <SiteContext.Provider value={{ 
      siteData, 
      setSiteData, 
      selectedBlock, 
      setSelectedBlockId, 
      addBlock, 
      updateBlock, 
      changeTheme
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);