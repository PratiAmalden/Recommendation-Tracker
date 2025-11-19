import express from 'express';
import { createRecommendation } from '../models/recommendationModel.js';

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
  
      res.status(500).json({
        success: false,
        message: 'Failed to create recommendation.',
        error: error.message,
      });
    }
});

export default router;