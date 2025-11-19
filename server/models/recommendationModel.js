// Import the database pool to interact with the PostgreSQL database
import pool from '../db/database.js';

// Adds a new recommendation to the database, including associated moods
export async function createRecommendation(recommendationData) {
  
  const { item_name, category, recommender, user_id, moods } = recommendationData;
  let client; // Declare client outside try-catch to ensure it's accessible in finally for release
  
  try {
    // Get a client from the connection pool for transaction management
    client = await pool.connect();
    
    // Start a database transaction
    await client.query('BEGIN');

    const insertRecommendationQuery = `
        INSERT INTO recommendations (item_name, category, recommender, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [item_name, category, recommender || null, user_id];
    const result = await client.query(insertRecommendationQuery, values);

    const newRecommendation = result.rows[0]; // Get the newly created recommendation

    // If moods were provided, save them to recommendation_moods junction table
    if (moods && Array.isArray(moods) && moods.length > 0) {
      for (const moodId of moods) {
        const insertMoodQuery = `
            INSERT INTO recommendation_moods (recommendation_id, mood_id)
            VALUES ($1, $2);
        `;
        await client.query(insertMoodQuery, [newRecommendation.id, moodId]);
      }
    }

    // If all database operations within the transaction are successful, commit the changes
    await client.query('COMMIT');

    return newRecommendation;

  } catch (error) {

    // If an error occurs at any point in the transaction, rollback all changes
    if (client) {
      await client.query('ROLLBACK'); 
    }
    console.error('Database transaction failed for createRecommendation:', error);

    // Re-throw the error so the calling function (route handler) can catch and respond
    throw error;

  } finally {
    // Always release the database client back to the pool, regardless of success or failure
    if (client) {
      client.release();
    }
  }
}
