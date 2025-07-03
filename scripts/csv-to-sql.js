// csv-to-sql.js: Convert worldcities.csv to SQL INSERTs for City table
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const input = path.join(__dirname, '../worldcities.csv');
const output = path.join(__dirname, '../seed-cities.sql');

const outStream = fs.createWriteStream(output, { flags: 'w' });
outStream.write('BEGIN TRANSACTION;\n');

fs.createReadStream(input)
  .pipe(csv())
  .on('data', (row) => {
    // Map CSV columns to City table columns
    const name = row.city.replace(/'/g, "''");
    const country = row.country.replace(/'/g, "''");
    const latitude = parseFloat(row.lat);
    const longitude = parseFloat(row.lng);
    const population = row.population ? parseInt(row.population) : null;
    const timezone = row.admin_name ? `'${row.admin_name.replace(/'/g, "''")}'` : 'NULL';
    outStream.write(`INSERT INTO City (name, country, latitude, longitude, population, timezone) VALUES ('${name}', '${country}', ${latitude}, ${longitude}, ${population ?? 'NULL'}, ${timezone});\n`);
  })
  .on('end', () => {
    outStream.write('COMMIT;\n');
    outStream.end();
    console.log('SQL file created: seed-cities.sql');
  });
