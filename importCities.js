const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const csvPath = path.join(__dirname, './worldcities.csv');

async function importCities() {
  const cities = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        // Map CSV fields to Prisma model fields
        const city = {
          name: row.city_ascii || row.city,
          country: row.country,
          latitude: parseFloat(row.lat),
          longitude: parseFloat(row.lng),
          population: row.population ? parseInt(row.population, 10) : null,
        };
        // Only add if required fields are present
        if (city.name && city.country && !isNaN(city.latitude) && !isNaN(city.longitude)) {
          cities.push(city);
        } else {
          console.warn('Skipping invalid row:', row);
        }
      })
      .on('end', async () => {
        try {
          // Clear existing data
          await prisma.city.deleteMany();
          // Bulk insert
          for (let i = 0; i < cities.length; i += 500) {
            try {
              await prisma.city.createMany({ data: cities.slice(i, i + 500) });
            } catch (batchErr) {
              console.error('Error inserting batch:', batchErr);
            }
          }
          console.log(`Imported ${cities.length} cities.`);
          resolve();
        } catch (err) {
          reject(err);
        } finally {
          await prisma.$disconnect();
        }
      })
      .on('error', (err) => reject(err));
  });
}

importCities().catch((err) => {
  console.error('Error importing cities:', err);
  process.exit(1);
});
