import { Router } from 'express';
import { getCitiesByLatitude, searchCities, getCityById } from '../controllers/cities';

const router = Router();

// Get cities by latitude
router.get('/by-latitude/:lat', getCitiesByLatitude);

// Search cities by name or country
router.get('/search', searchCities);

// Get specific city by ID
router.get('/:id', getCityById);

export default router;
