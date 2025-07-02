import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CityData {
  name: string;
  country: string;
  lat: string;
  lng: string;
  population?: number;
  timezone?: string;
}

async function main() {
  console.log('Starting database seeding...');
  
  // Clear existing data
  await prisma.city.deleteMany();
  console.log('Cleared existing cities data.');

  // Import cities data using require since it's a CommonJS module
  const cities: CityData[] = require('cities.json');
  
  console.log(`Found ${cities.length} cities to seed`);
  
  let seededCount = 0;
  const batchSize = 1000;
  
  for (let i = 0; i < cities.length; i += batchSize) {
    const batch = cities.slice(i, i + batchSize);
    
    const cityData = batch.map((city: CityData) => ({
      name: city.name,
      country: city.country,
      latitude: parseFloat(city.lat),
      longitude: parseFloat(city.lng),
      population: city.population || null,
      timezone: city.timezone || null,
    }));

    await prisma.city.createMany({
      data: cityData,
    });

    seededCount += batch.length;
    console.log(`Seeded ${seededCount}/${cities.length} cities...`);
  }

  console.log(`Database seeding completed! Total cities: ${seededCount}`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
