import express from 'express';
import { createRecommendation, getRecommendationsByUserId } from '../models/recommendationModel.js';

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
router.get('/', async (req, res) => {
  // Get user_id from query parameters (e.g., /api/recommendations?user_id=1)
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required as a query parameter (e.g., ?user_id=1).',
    });
  }

  // Validate user_id is a valid number
  const parsedUserId = parseInt(user_id);
  if (isNaN(parsedUserId)) {
    return res.status(400).json({
      success: false,
      message: 'User ID must be a valid number.',
    });
  }

  try {
    // Call the model function to get recommendations for the specified user
    const recommendations = await getRecommendationsByUserId(parsedUserId);

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

export default router;