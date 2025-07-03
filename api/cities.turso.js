// Direct Turso (libSQL) client for Vercel serverless
import { createClient } from '@libsql/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const { lat, lng, tolerance = 1.0, limit = 50 } = req.query;
    
    console.log('API Request params:', { lat, lng, tolerance, limit });
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const tol = parseFloat(tolerance);
    const lim = parseInt(limit);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ 
        error: 'Invalid latitude or longitude',
        received: { lat, lng, latitude, longitude }
      });
    }

    // Check environment variables
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      console.error('Missing Turso environment variables');
      return res.status(500).json({ 
        error: 'Database configuration error',
        hasUrl: !!process.env.TURSO_DATABASE_URL,
        hasToken: !!process.env.TURSO_AUTH_TOKEN
      });
    }

    // Create Turso client
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    console.log('Querying database for latitude range:', latitude - tol, 'to', latitude + tol);

    const result = await client.execute({
      sql: `SELECT id, name, country, latitude, longitude, population, timezone, createdAt FROM City WHERE latitude BETWEEN ? AND ? ORDER BY population DESC LIMIT ?`,
      args: [latitude - tol, latitude + tol, lim]
    });

    console.log('Database returned', result.rows.length, 'rows');

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

    // Filter out cities that are too close longitudinally (optional)
    const filteredCities = cities.filter(city => 
      Math.abs(city.longitude - longitude) >= 1 // At least 1 degree apart
    );

    const response = {
      cities: filteredCities.slice(0, lim),
      total: filteredCities.length,
      latitude,
      longitude,
      tolerance: tol,
      debug: {
        originalCount: cities.length,
        filteredCount: filteredCities.length,
        query: `latitude BETWEEN ${latitude - tol} AND ${latitude + tol}`
      }
    };

    console.log('Returning response:', {
      cityCount: response.cities.length,
      total: response.total
    });

    res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      stack: error.stack
    });
  }
}
