import { authSchema, recommendationSchema, resetPasswordSchema } from "../utils/validationSchemas.js";

describe("backend validation schemas", () => {
  test("accepts valid recommendation data", () => {
    expect(recommendationSchema.safeParse({
      item_name: "Past Lives",
      recommender: "Alex",
      category: "Movie",
      moods: [1, 2],
    }).success).toBe(true);
  });

  test("rejects empty moods and invalid categories", () => {
    const result = recommendationSchema.safeParse({
      item_name: "Past Lives",
      recommender: "Alex",
      category: "Podcast",
      moods: [],
    });

    expect(result.success).toBe(false);
  });

  test("requires a strong password and matching reset confirmation", () => {
    expect(authSchema.safeParse({
      username: "alex-1",
      email: "alex@example.com",
      password: "Password1",
    }).success).toBe(true);

    expect(resetPasswordSchema.safeParse({
      password: "Password1",
      confirmPassword: "Different1",
    }).success).toBe(false);
  });
});
