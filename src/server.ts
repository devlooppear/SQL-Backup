import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { exec } from 'child_process';
import util from 'util';

dotenv.config();

const app = express();
const port = 3000;

// Define the schedule for the cron job using the format 'minute hour day-of-month month day-of-week'
// The format is:
// ────────────── minute (0-59)
// ────────────── hour (0-23)
// ────────────── day-of-month (1-31)
// ────────────── month (1-12)
// ────────────── day-of-week (0-6) (0 is Sunday, 1 is Monday, etc.)

// Example: '0 13 * * *' means:
// - '0' minute: The job will run at the 0th minute (the start of the hour)
// - '13' hour: The job will run at 13:00 (1 PM in 24-hour format)
// - '*' day-of-month: The job will run on any day of the month
// - '*' month: The job will run in any month
// - '*' day-of-week: The job will run on any day of the week

// Therefore, '0 13 * * *' configures the cron job to run daily at 13:00 (1 PM).

const BACKUP_SCHEDULE = '0 13 * * *';

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

const execPromise = util.promisify(exec);
cron.schedule(BACKUP_SCHEDULE, async () => {
  try {
    console.log('Starting daily backup...');
    await execPromise('./backup.sh');
    console.log('Backup completed successfully.');
  } catch (error) {
    console.error('Error during backup:', error);
  }
});
