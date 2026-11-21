// Import the database pool to interact with the PostgreSQL database
import db from '../db/db.js';

// Adds a new recommendation to the database, including associated moods
export async function createRecommendation(recommendationData) {
  
  const { item_name, category, recommender, user_id, moods } = recommendationData;
  let client; // Declare client outside try-catch to ensure it's accessible in finally for release
  
  try {
    // Get a client from the connection pool for transaction management
    client = await db.connect();
    
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

    const moodsData = await client.query(
      `SELECT m.id, m.name
      FROM recommendation_moods rm
      JOIN moods m ON m.id = rm.mood_id
      WHERE rm.recommendation_id = $1`,
      [newRecommendation.id]
    )
    // If all database operations within the transaction are successful, commit the changes
    await client.query('COMMIT');

    return {
      ...newRecommendation,
      moods: moodsData.rows,
    }

  } catch (error) {

    // If an error occurs at any point in the transaction, rollback all changes
    if (client) {
      await client.query('ROLLBACK'); 
    }
    console.error('Database transaction failed for createRecommendation:', error);

    // Check for unique constraint violation error
    if (error.code === '23505') {
      throw new Error('A recommendation with the same item name and category already exists for this user.');
    }

    // Re-throw the error so the calling function (route handler) can catch and respond
    throw error;

  } finally {
    // Always release the database client back to the pool, regardless of success or failure
    if (client) {
      client.release();
    }
  }
}

// Gets all recommendations for a user, optionally filtered by category, recommender, or mood.
export async function getRecommendationsByUserId(userId, filters = {}) {
  let client;

  try {
    client = await db.connect(); // Get a database client from the pool

    // We select recommendations and join them with moods to get the full list of moods for each item.
    let query = `
      SELECT
        r.id,
        r.item_name,
        r.category,
        r.recommender,
        r.user_id,
        r.status,
        r.created_at,
        r.updated_at,
        i.file_path AS image_url,
        COALESCE(JSON_AGG(json_build_object('id', m.id, 'name', m.name)) FILTER (WHERE m.id IS NOT NULL), '[]') AS moods
      FROM
        recommendations r
      LEFT JOIN
        recommendation_moods rm ON r.id = rm.recommendation_id
      LEFT JOIN
        moods m ON rm.mood_id = m.id
      LEFT JOIN
        images i ON i.recommendation_id = r.id
    `;

    // $1 will always be the userId
    const values = [userId]; 
    const conditions = ['r.user_id = $1']; 

    // Filter by Category 
    if (filters.category) {
      conditions.push(`r.category = $${values.length + 1}`);
      values.push(filters.category);
    }

    // Filter by Recommender
    if (filters.recommender) {
      conditions.push(`r.recommender = $${values.length + 1}`);
      values.push(filters.recommender);
    }

    // Filter by Mood 
    // We use a subquery (EXISTS) to check if the recommendation is associated with the specific mood ID.
    // This ensures we filter the items correctly but still fetch ALL moods associated with that item for display.
    if (filters.mood) {
        conditions.push(`EXISTS (
            SELECT 1 FROM recommendation_moods rm_filter 
            WHERE rm_filter.recommendation_id = r.id 
            AND rm_filter.mood_id = $${values.length + 1}
        )`);
        values.push(filters.mood); 
    }

    // Construct the final WHERE clause
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Grouping and Ordering
    query += `
      GROUP BY
        r.id, r.item_name, r.category, r.recommender, r.user_id, r.status, r.created_at, r.updated_at, i.file_path
      ORDER BY
        r.created_at DESC;
    `;

    // $1 will be replaced by the userId value
    const result = await client.query(query, values);
    
    return result.rows; // Return the fetched recommendations

  } catch (error) {
    console.error('Database error in getRecommendationsByUserId:', error);
    throw error; // Re-throw the error for the calling function to handle
  } finally {
    if (client) {
      client.release(); // Always release the client back to the pool
    }
  }
  
}