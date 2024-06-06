import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const updatePoints = async (bet: number, option: string) => {
  const response = await axios.post(`${API_URL}/update-points`, { bet, option });
  return response.data;
};

