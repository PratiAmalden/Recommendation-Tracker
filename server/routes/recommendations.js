import express from 'express';
import { createRecommendation, getRecommendationsByUserId } from '../models/recommendationModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; 
import db from '../db/db.js';

const router = express.Router();

// POST /api/recommendations route
router.post('/', async(req, res) => {
  // Extract data from the request body
  const { item_name, category, recommender, user_id, moods } = req.body;

  if (!item_name || !category || !user_id) {
    return res.status(400).json({
      success: false,
      message: 'Item name, category, and user ID are required fields.',
    });
  }

  try {

    // Call the createRecommendation function from the model, passing only the data it needs
    const newRecommendation = await createRecommendation({
      item_name,
      category,
      recommender,
      user_id,
      moods,
    });

    res.status(201).json({
      success: true,
      message: 'Recommendation created successfully!',
      data: newRecommendation,
    });

  } catch (error) {

    console.error('Error in POST /api/recommendations route handler:', error);

    if (error.message.includes('A recommendation with the same item name and category already exists')) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }
      res.status(500).json({
        success: false,
        message: 'Failed to create recommendation.',
        error: error.message,
      });
    }
});

// GET /api/recommendations route
// This route fetches all recommendations for a specific user.
router.get('/', authMiddleware, async (req, res) => {
  // Get the logged-in user's ID from the token
  const user_id = req.user.userId;

  // Extract filter parameters from the URL query string
  const { category, mood, recommender } = req.query;

  try {
    // Call the model function to get recommendations for the specified user
    const recommendations = await getRecommendationsByUserId(user_id, {
      category,
      mood,
      recommender
    });

    res.status(200).json({
      success: true,
      message: 'Recommendations fetched successfully!',
      data: recommendations,
    });
  } catch (error) {
    console.error('Error in GET /api/recommendations route handler:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations.',
      error: error.message,
    });
  }

});

router.put('/:id', authMiddleware , async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.userId;
  const { item_name, category, moods, recommender } = req.body;

  const client = await db.connect();

  try{
    await client.query("BEGIN");

    const newData = await client.query(
      `UPDATE recommendations
      SET 
      item_name = $1,
      category = $2,
      recommender = $3,
      updated_at = now()
      WHERE id = $4 AND user_id = $5
      RETURNING *`,
      [item_name, category, recommender, id, user_id]
    );

    if (newData.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Recommendation not found" });
    }

    await client.query(
      'DELETE FROM recommendation_moods WHERE recommendation_id = $1',
      [id]
    )

    for(const moodId of moods){
      await client.query(
        'INSERT INTO recommendation_moods (recommendation_id, mood_id) VALUES ($1, $2)',
        [id, moodId]
      );
    }

    await client.query("COMMIT");

    res.json({ ...newData.rows[0], moods })

  } catch(error){
    await client.query("ROLLBACK");

    console.error(error)

    res.status(500).json({ 
      success: false,
      message: 'Failed to update recommendations.',
      error: error.message
    });
  } finally{
    client.release();
  }
});


router.delete('/:id', authMiddleware, async (req, res) => {
  const user_id = req.user.userId;
  const { id } = req.params;
  try{
    await db.query("DELETE FROM recommendations WHERE id = $1 AND user_id = $2",
    [id, user_id]);

    await db.query(
      'DELETE FROM recommendation_moods WHERE recommendation_id = $1',
      [id]
    )

    res.status(200).json({
      success: true,
      message: 'Recommendation deleted',
    });

  } catch (err){
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations.',
      error: err.message,
    });
  }
});

export default router;