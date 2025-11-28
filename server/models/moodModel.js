import db from '../db/db.js';

// Get all moods from the database
export async function getAllMoods() {
  try {
    const query = 'SELECT * FROM moods ORDER BY id ASC';
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error getting moods:', error);
    throw error;
  }
}