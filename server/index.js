import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import recommendationsRouter from './routes/recommendations.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Mount the recommendation routes under the '/api/recommendations' path
app.use('/api/recommendations', recommendationsRouter);

app.use("/api", authRoutes);

app.listen(port, () => {
  console.log("App listening on: ", port);
});
