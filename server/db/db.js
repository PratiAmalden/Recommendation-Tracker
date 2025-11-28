import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import { Pool } from "pg";

// Create PostgreSQL connection pool
const db = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// Test database connection
async function testDbConnection() {
  try {
    const client = await db.connect();
    console.log('Database connected successfully!');
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error('Database connection error:', err.message);
    // If we cannot connect to the database, the application should not start
    process.exit(1);
  }
}

testDbConnection(); // Call the test function immediately

export default db;