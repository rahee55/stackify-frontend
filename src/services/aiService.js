import api from './api';

// 1. Generate the content (Calls Gemini)
export const generateWebsite = async (prompt) => {
  const response = await api.post('/ai/generate', { prompt });
  return response.data; // Returns { title, blocks: [...] }
};

// 2. Save the generated site to MongoDB
export const createSite = async (siteData) => {
  const response = await api.post('/sites', siteData);
  return response.data; // Returns the saved site with _id
};

// 3. Get all sites for the user (For Dashboard)
export const getMySites = async () => {
  const response = await api.get('/sites');
  return response.data;
};