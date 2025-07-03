// Direct Turso (libSQL) client for Vercel serverless
// Falls back to Prisma for local dev

const getTursoDb = require('../backend/src/utils/tursoDb');

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
    // Use libSQL client for Turso
    const db = getTursoDb();
    const result = await db.execute({
      sql: `SELECT * FROM City WHERE latitude BETWEEN ? AND ? AND population >= 100000 ORDER BY population DESC, name ASC LIMIT 500`,
      args: [latitude - tol, latitude + tol]
    });
    const cities = result.rows.map(row => ({
      id: row[0],
      name: row[1],
      country: row[2], 
      latitude: row[3],
      longitude: row[4],
      population: row[5],
      timezone: row[6],
      createdAt: row[7]
    }));
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
