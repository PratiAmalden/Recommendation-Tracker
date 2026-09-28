import express from "express";
import { getSharedRecommendation } from "../models/recommendationModel.js";

const router = express.Router();

router.get("/:shareToken", async (req, res) => {
  try {
    const recommendation = await getSharedRecommendation(req.params.shareToken);

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: "Shared recommendation not found",
      });
    }

    return res.status(200).json({ success: true, data: recommendation });
  } catch (error) {
    console.error("Error loading shared recommendation", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load shared recommendation",
    });
  }
});

export default router;