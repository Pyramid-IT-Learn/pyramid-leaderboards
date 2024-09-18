import axios from 'axios';

const API_URL = 'https://cmrit-leaderboards-backend.vercel.app/'; // Update this to your backend URL

export const fetchDatabases = () => {
  return axios.get(`${API_URL}/databases`);
};

export const fetchCollections = (database: string) => {
  return axios.get(`${API_URL}/databases/${database}/collections`);
};

export const fetchBatchData = (database: string, collection: string) => {
  return axios.get(`${API_URL}/databases/${database}/collections/${collection}/data`);
};

export const fetchBatchUpdateTime = (database: string, collection: string) => {
  return axios.get(`${API_URL}/databases/${database}/collections/${collection}/batch-update-time`);
};
