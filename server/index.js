// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import recommendationsRouter from './routes/recommendations.js';

const app = express();

// Middleware Setup
app.use(cors());
app.use(express.json());

app.get("/", (res, req) => {
    res.send("Welcome to the Recommendation Tracker API!");
});

// Mount the recommendation routes under the '/api/recommendations' path
app.use('/api/recommendations', recommendationsRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
    console.log(`Access the API at http://localhost:${port}`);
})