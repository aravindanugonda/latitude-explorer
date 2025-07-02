import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface City {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  population?: number;
  timezone?: string;
  createdAt: string;
}

export interface CitiesResponse {
  cities: City[];
  total: number;
  latitude?: number;
  tolerance?: number;
  query?: string;
}

export const getCitiesByLatitude = async (latitude: number, tolerance: number = 0.1): Promise<City[]> => {
  try {
    const response = await axios.get<CitiesResponse>(`${API_URL}/cities/by-latitude/${latitude}?tolerance=${tolerance}&limit=50`);
    return response.data.cities;
  } catch (error) {
    console.error('Error fetching cities by latitude:', error);
    throw error;
  }
};

export const searchCities = async (query: string): Promise<City[]> => {
  try {
    const response = await axios.get<CitiesResponse>(`${API_URL}/cities/search?q=${encodeURIComponent(query)}&limit=20`);
    return response.data.cities;
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
};

export const getCityById = async (id: number): Promise<City> => {
  try {
    const response = await axios.get<City>(`${API_URL}/cities/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching city by ID:', error);
    throw error;
  }
};
