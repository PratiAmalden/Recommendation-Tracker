import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import recommendationsRouter from './routes/recommendations.js';
import moodsRouter from './routes/moods.js';
dotenv.config();

const app = express();

// Root route to check if server is running
app.get('/', (req, res) => {
  res.send('Recommendation Tracker API is up and running!');
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

app.use('/api/moods', moodsRouter);

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log("App listening on: ", port);
});
