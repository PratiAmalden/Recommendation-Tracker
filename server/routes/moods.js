import express from 'express';
import { getAllMoods } from '../models/moodModel.js';

const router = express.Router();

// GET /api/moods
router.get('/', async (req, res) => {
  try {
    const moods = await getAllMoods();
    res.status(200).json({
      success: true,
      data: moods,
    });
  } catch (error) {
    console.error('Error in GET /api/moods:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch moods',
    });
  }
});

export default router;