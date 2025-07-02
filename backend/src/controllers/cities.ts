import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCitiesByLatitude = async (req: Request, res: Response): Promise<void> => {
  try {
    const lat = parseFloat(req.params.lat);
    const tolerance = parseFloat(req.query.tolerance as string) || 0.1;
    const limit = parseInt(req.query.limit as string) || 50;

    // Validate input
    if (isNaN(lat) || lat < -90 || lat > 90) {
      res.status(400).json({ error: 'Invalid latitude. Must be between -90 and 90.' });
      return;
    }

    if (tolerance < 0 || tolerance > 10) {
      res.status(400).json({ error: 'Invalid tolerance. Must be between 0 and 10.' });
      return;
    }

    const cities = await prisma.city.findMany({
      where: {
        latitude: {
          gte: lat - tolerance,
          lte: lat + tolerance,
        },
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
      latitude: lat,
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
