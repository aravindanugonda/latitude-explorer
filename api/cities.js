// Smart router that detects environment and routes to appropriate handler
import { createClient } from '@libsql/client';
import { PrismaClient } from '@prisma/client';

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

    const isProd = process.env.NODE_ENV === 'production' || process.env.TURSO_DATABASE_URL;
    let cities = [];

    if (isProd && process.env.TURSO_DATABASE_URL) {
      // Use Turso for production
      console.log('Using Turso database');
      const client = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });

      const result = await client.execute({
        sql: `SELECT * FROM City WHERE latitude BETWEEN ? AND ? AND population >= 100000 ORDER BY population DESC, name ASC LIMIT 500`,
        args: [latitude - tol, latitude + tol]
      });

      cities = result.rows.map(row => ({
        id: row[0],
        name: row[1],
        country: row[2], 
        latitude: row[3],
        longitude: row[4],
        population: row[5],
        timezone: row[6],
        createdAt: row[7]
      }));

    } else {
      // Use Prisma for local development
      console.log('Using Prisma/SQLite database');
      const prisma = new PrismaClient();
      
      cities = await prisma.city.findMany({
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

      await prisma.$disconnect();
    }

    const filteredCities = cities.filter(city => Math.abs(city.longitude - longitude) >= 3);

    res.status(200).json({
      cities: filteredCities.slice(0, lim),
      total: filteredCities.length,
      latitude,
      longitude,
      tolerance: tol,
    });

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
