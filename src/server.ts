import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'sqlbackups',
});

async function setupDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS candies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
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

    await connection.query('DELETE FROM candies');

    for (const candy of candies) {
      await connection.query('INSERT INTO candies (name, notes) VALUES (?, ?)', [candy.name, candy.notes]);
    }

    console.log('Table created and data inserted!');
  } finally {
    connection.release();
  }
}

app.get('/api/candies', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM candies');
    res.json(rows);
  } finally {
    connection.release();
  }
});

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  await setupDatabase();
});
