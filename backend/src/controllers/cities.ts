import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCitiesByLatitude = async (req: Request, res: Response): Promise<void> => {
  try {
    const lat = parseFloat(req.params.lat);
    const lng = parseFloat(req.query.lng as string);
  const tolerance = parseFloat(req.query.tolerance as string) || 1.0;
    const limit = parseInt(req.query.limit as string) || 50;

    // Validate input
    if (isNaN(lat) || lat < -90 || lat > 90) {
      res.status(400).json({ error: 'Invalid latitude. Must be between -90 and 90.' });
      return;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      res.status(400).json({ error: 'Invalid longitude. Must be between -180 and 180.' });
      return;
    }
    if (tolerance < 0 || tolerance > 10) {
      res.status(400).json({ error: 'Invalid tolerance. Must be between 0 and 10.' });
      return;
    }

    // First, get all cities within latitude tolerance
    const cities = await prisma.city.findMany({
      where: {
        latitude: {
          gte: lat - tolerance,
          lte: lat + tolerance,
        },
        population: {
          gte: 100_000,
        },
      },
      orderBy: [
        { population: 'desc' },
        { name: 'asc' }
      ],
      take: 500, // get more to allow for filtering
    });

    // Debug: log how many cities found by latitude and population
    console.log(`Found ${cities.length} cities by latitude and population`);

    // Then, filter for longitude difference >= 3 degrees (inclusive)
    const filteredCities = cities.filter(city => Math.abs(city.longitude - lng) >= 3);

    // Debug: log how many remain after longitude filtering
    console.log(`Filtered to ${filteredCities.length} cities with longitude difference >= 3`);

    res.json({
      cities: filteredCities.slice(0, limit),
      total: filteredCities.length,
      latitude: lat,
      longitude: lng,
      tolerance,
    });
  } catch (error) {
    console.error('Error fetching cities by latitude:', error);
    res.status(500).json({ error: 'An error occurred while fetching cities.' });
  }
};

export const searchCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!query || query.trim().length < 2) {
      res.status(400).json({ error: 'Search query must be at least 2 characters long.' });
      return;
    }

    const cities = await prisma.city.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { country: { contains: query } },
        ],
      },
      orderBy: [
        { population: 'desc' },
        { name: 'asc' }
      ],
      take: limit,
    });

    res.json({
      cities,
      total: cities.length,
      query,
    });
  } catch (error) {
    console.error('Error searching cities:', error);
    res.status(500).json({ error: 'An error occurred while searching cities.' });
  }
};

export const getCityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid city ID.' });
      return;
    }

    const city = await prisma.city.findUnique({
      where: { id },
    });

    if (!city) {
      res.status(404).json({ error: 'City not found.' });
      return;
    }

    res.json(city);
  } catch (error) {
    console.error('Error fetching city by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the city.' });
  }
};
