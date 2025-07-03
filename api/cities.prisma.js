import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { lat, lng, tolerance = 1.0, limit = 50 } = req.query;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const tol = parseFloat(tolerance);
    const lim = parseInt(limit);
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }
    const cities = await prisma.city.findMany({
      where: {
        latitude: {
          gte: latitude - tol,
          lte: latitude + tol,
        },
        population: {
          gte: 100_000,
        },
      },
      orderBy: [
        { population: 'desc' },
        { name: 'asc' }
      ],
      take: 500,
    });
    const filteredCities = cities.filter(city => Math.abs(city.longitude - longitude) >= 3);
    res.status(200).json({
      cities: filteredCities.slice(0, lim),
      total: filteredCities.length,
      latitude,
      longitude,
      tolerance: tol,
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
