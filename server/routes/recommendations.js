import express from 'express';
import { createRecommendation, getRecommendationsByUserId } from '../models/recommendationModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; 
import db from '../db/db.js';
import { recommendationSchema } from '../utils/validationSchemas.js'; 
import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";
import crypto from "crypto";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, ".." , "uploads");

if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${crypto.randomUUID()}${ext}`)
  }
})

function fileFilter (req, file, cb) {
  const allowed = ["image/png", "image/jpeg"];

  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(null, false);
}

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 },
  fileFilter,
});

router.post('/:recommendationId/image', upload.single('recoImg'), async (req, res) => {
  const recommendationId = Number(req.params.recommendationId)
  if(!req.file){
    return res.status(400).json({
    success: false,
    message: "No file uploaded",
    });
  }

  try{
    const filePath = `/uploads/${req.file.filename}`;
    const mimeType = req.file.mimetype;
    const fileSize = req.file.size;

    const result = await db.query(
      `INSERT INTO images (recommendation_id, file_path, mime_type, file_size)
      VALUES ($1, $2, $3, $4)
      RETURNING id, file_path`,
      [recommendationId, filePath, mimeType, fileSize]
    );
    
    const image = result.rows[0];

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      image: {
        imgId: image.id,
        url: image.file_path,
      },
    });
  } catch (err) {
    console.error('Error uploading image', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }

})

router.get("/:recommendationId/image", async (req, res) => {
  const recommendationId = Number(req.params.recommendationId);

  try{
    const result = await db.query(
    `SELECT id, file_path, mime_type, file_size
    FROM images
    WHERE recommendation_id = $1`, [recommendationId]
    );

    if(result.rows.length === 0) return res.status(400).json({
      success: false,
      message: "Image not found"
    });

    res.json({
      success: true,
      message: "image uploaded",
      image: result.rows[0]
    });
  } catch (err){
    console.error('Error fetching image', err);
    return res.status(500).json({ success: false });
  }
  
})

// POST /api/recommendations route
router.post('/', authMiddleware, async(req, res) => {

  const validation = recommendationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validation.error.issues
    });
  }

  const { item_name, category, recommender, moods } = validation.data;
  const user_id = req.user.userId;

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
  const validation = recommendationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validation.error.issues
    });
  }

  const { item_name, category, moods, recommender } = validation.data;

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

    const moodsData = await client.query(
      `SELECT m.id, m.name
       FROM recommendation_moods rm
       JOIN moods m ON m.id = rm.mood_id
       WHERE rm.recommendation_id = $1`,
      [id]
    );

    await client.query("COMMIT");

    res.json({ ...newData.rows[0], moods: moodsData.rows })

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
    const img = await db.query(
      "SELECT file_path FROM images WHERE recommendation_id = $1",
      [id]
    );

    const imgPath = img.rows[0]?.file_path;
    const filename = path.basename(imgPath);

    await db.query("DELETE FROM recommendations WHERE id = $1 AND user_id = $2",
    [id, user_id]);

    await db.query(
      'DELETE FROM recommendation_moods WHERE recommendation_id = $1',
      [id]
    )

    await db.query(
      'DELETE FROM images WHERE recommendation_id = $1',
      [id]
    );

    if(filename){
      const fullPath = path.join(__dirname, "..", "uploads", filename);
      fs.promises.unlink(fullPath);
    }

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