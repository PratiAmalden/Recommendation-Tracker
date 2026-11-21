import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET_KEY = "test-secret";

const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};
const mockDb = {
  connect: jest.fn().mockResolvedValue(mockClient),
  query: jest.fn(),
};

jest.unstable_mockModule("../db/db.js", () => ({ default: mockDb }));

const { default: recommendationsRouter } = await import("../routes/recommendations.js");
const { default: sharedRecommendationsRouter } = await import("../routes/sharedRecommendations.js");
const { getRecommendationsByUserId } = await import("../models/recommendationModel.js");

const app = express();
app.use(express.json());
app.use("/api/recommendations", recommendationsRouter);
app.use("/api/shared/recommendations", sharedRecommendationsRouter);

function authHeader() {
  return `Bearer ${jwt.sign({ userId: 7 }, process.env.JWT_SECRET_KEY)}`;
}

describe("recommendation completion API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("requires authentication", async () => {
    const response = await request(app)
      .put("/api/recommendations/12/completion")
      .send({ rating: 4 });

    expect(response.status).toBe(401);
    expect(mockDb.query).not.toHaveBeenCalled();
  });

  test("rejects ratings outside 1 through 5", async () => {
    const response = await request(app)
      .put("/api/recommendations/12/completion")
      .set("Authorization", authHeader())
      .send({ rating: 6, review: "Too much." });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/between 1 and 5/);
  });

  test("completes a recommendation with a rating and review", async () => {
    mockDb.query.mockResolvedValueOnce({
      rows: [{
        id: 12,
        status: "completed",
        rating: 4,
        review: "Loved it",
        completed_at: "2026-09-27T12:00:00.000Z",
      }],
    });

    const response = await request(app)
      .put("/api/recommendations/12/completion")
      .set("Authorization", authHeader())
      .send({ rating: 4, review: "  Loved it " });

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({ id: 12, status: "completed", rating: 4 });
    expect(mockDb.query).toHaveBeenCalledWith(
      expect.stringContaining("status = 'completed'"),
      [4, "Loved it", "12", 7]
    );
  });

  test("supports completing without a rating", async () => {
    mockDb.query.mockResolvedValueOnce({
      rows: [{ id: 12, status: "completed", rating: null, review: null }],
    });

    const response = await request(app)
      .put("/api/recommendations/12/completion")
      .set("Authorization", authHeader())
      .send({ rating: null, review: "" });

    expect(response.status).toBe(200);
    expect(mockDb.query.mock.calls[0][1]).toEqual([null, null, "12", 7]);
  });
});

describe("recommendation reload query", () => {
  test("selects persisted completion fields", async () => {
    mockClient.query.mockResolvedValueOnce({ rows: [] });

    await getRecommendationsByUserId(7);

    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining("r.rating"),
      [7]
    );
    expect(mockClient.query.mock.calls[0][0]).toEqual(expect.stringContaining("r.review"));
    expect(mockClient.query.mock.calls[0][0]).toEqual(expect.stringContaining("r.completed_at"));
  });
});

describe("recommendation sharing API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates a server-generated share link for the owner", async () => {
    mockDb.query.mockResolvedValueOnce({ rows: [{ share_token: "server-token" }] });

    const response = await request(app)
      .post("/api/recommendations/12/share")
      .set("Authorization", authHeader());

    expect(response.status).toBe(200);
    expect(response.body.shareUrl).toMatch(/\/share\/server-token$/);
    expect(mockDb.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE id = $2 AND user_id = $3"),
      [expect.stringMatching(/^[a-f0-9]{48}$/), "12", 7]
    );
  });

  test("does not require authentication to retrieve a public recommendation", async () => {
    mockDb.query.mockResolvedValueOnce({
      rows: [{
        item_name: "Past Lives",
        category: "Movie",
        recommender: "Bree",
        status: "pending",
        rating: null,
        review: null,
        image_url: null,
        moods: ["Thoughtful"],
      }],
    });

    const response = await request(app).get("/api/shared/recommendations/server-token");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(expect.objectContaining({
      item_name: "Past Lives",
      moods: ["Thoughtful"],
    }));
    expect(response.body.data).not.toHaveProperty("id");
    expect(response.body.data).not.toHaveProperty("user_id");
  });

  test("returns 404 for an unknown public token", async () => {
    mockDb.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get("/api/shared/recommendations/unknown");

    expect(response.status).toBe(404);
  });
});
