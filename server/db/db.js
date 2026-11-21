import dotenv from 'dotenv';
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: [
    path.resolve(serverDirectory, "../../.env.local"),
    path.resolve(serverDirectory, "../.env"),
  ],
});

const db = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
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