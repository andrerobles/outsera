import * as fs from 'fs';
import * as csv from 'csv-parser';

export async function parseCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => {
        results.push({
          year: parseInt(data.year, 10),
          title: data.title,
          studios: data.studios.split(/,|and/).map((s) => s.trim()),
          producers: data.producers.split(/,|and/).map((p) => p.trim()),
          winner: data.winner.toLowerCase().trim() === 'yes',
        });
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}
