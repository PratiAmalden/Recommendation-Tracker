import {
  authSchema,
  recommendationSchema,
  resetPasswordSchema,
  zodToFieldErrors,
} from "../utils/validationSchemas";

describe("frontend validation schemas", () => {
  test("accepts a valid recommendation", () => {
    const result = recommendationSchema.safeParse({
      item_name: "Past Lives",
      recommender: "Alex",
      category: "Movie",
      moods: [1],
    });

    expect(result.success).toBe(true);
  });

  test("rejects an invalid recommendation", () => {
    const result = recommendationSchema.safeParse({
      item_name: "",
      recommender: "",
      category: "Invalid",
      moods: [],
    });

    expect(result.success).toBe(false);
    expect(zodToFieldErrors(result.error.issues)).toEqual(
      expect.objectContaining({
        item_name: expect.any(String),
        recommender: expect.any(String),
        category: expect.any(String),
        moods: expect.any(String),
      })
    );
  });

  test("validates authentication and matching reset passwords", () => {
    expect(
      authSchema.safeParse({
        username: "alex-1",
        email: "alex@example.com",
        password: "Password1",
      }).success
    ).toBe(true);

    expect(
      resetPasswordSchema.safeParse({
        password: "Password1",
        confirmPassword: "Password2",
      }).success
    ).toBe(false);
  });
});
