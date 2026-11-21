import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import recommendationsRouter from './routes/recommendations.js';
import sharedRecommendationsRouter from './routes/sharedRecommendations.js';
import moodsRouter from './routes/moods.js';
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';


dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/test-persistence', (req, res) => {
  const testPath = path.join(__dirname, 'uploads', 'test.txt');
  if (fs.existsSync(testPath)) {
    return res.send('test.txt exists! Persistent storage is working.');
  } else {
    return res.send('test.txt NOT found. Volume mount may not be working.');
  }
});

const port = process.env.PORT || 3000;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
  })
);

app.use(express.json());

// Mount the recommendation routes under the '/api/recommendations' path
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/shared/recommendations', sharedRecommendationsRouter);

app.use('/uploads', express.static(path.join(__dirname, "uploads")))

app.use('/api/moods', moodsRouter);

app.use("/api/auth", authRoutes);

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));
app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
    return next();
  }

  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(port, () => {
  console.log("App listening on: ", port);
});
