import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

async function setupDatabase() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS candies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      notes TEXT
    )
  `);

  const candies = [
    { name: 'Chocolate', notes: 'Sweet and delicious' },
    { name: 'Gummy Bears', notes: 'Chewy and fruity' },
    { name: 'Lollipop', notes: 'Colorful and sugary' },
    { name: 'Candy Corn', notes: 'Sweet and seasonal' },
    { name: 'Jelly Beans', notes: 'Assorted flavors' },
    { name: 'Mints', notes: 'Fresh and cool' },
    { name: 'Licorice', notes: 'Sweet and slightly salty' },
    { name: 'Marshmallows', notes: 'Soft and fluffy' },
    { name: 'Butterscotch', notes: 'Rich and creamy' },
    { name: 'Sour Worms', notes: 'Tangy and chewy' },
    { name: 'Toffee', notes: 'Crunchy and buttery' },
    { name: 'Taffy', notes: 'Stretchy and fruity' },
    { name: 'Cotton Candy', notes: 'Light and airy' },
    { name: 'Peanut Butter Cups', notes: 'Creamy and nutty' },
    { name: 'Chocolate Truffles', notes: 'Rich and indulgent' }
  ];

  await db.exec('DELETE FROM candies');

  const insertStmt = await db.prepare('INSERT INTO candies (name, notes) VALUES (?, ?)');
  for (const candy of candies) {
    await insertStmt.run(candy.name, candy.notes);
  }

  await insertStmt.finalize();

  console.log('Table created and data inserted!');
  return db;
}

app.get('/api/candies', async (req, res) => {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  const rows = await db.all('SELECT * FROM candies');
  res.json(rows);
});

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  await setupDatabase();
});
