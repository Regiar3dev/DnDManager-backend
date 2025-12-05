import axios from 'axios';

const EXTERNAL_API_BASE_URL = process.env.EXTERNAL_API_BASE_URL || 'https://api.example.com';

export const fetchDataFromExternalApi = async (endpoint: string) => {
  try {
    const response = await axios.get(`${EXTERNAL_API_BASE_URL}/${endpoint}`);
    return response.data;
    } catch (error) {
    console.error('Error fetching data from external API:', error);
    throw error;
    }
};