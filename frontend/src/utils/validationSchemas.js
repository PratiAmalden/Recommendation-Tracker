import { z } from "zod";

export const authSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9-]+$/, "Username can only contain letters, numbers, or dashes"),
  
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

const categoryOptions = ["Movie", "Book", "TV show", "Others"];

export const recommendationSchema = z.object({
  item_name: z
    .string()
    .min(1, "Item name is required")
    .max(100, "Item name is too long (max 100 chars)"),

  recommender: z
    .string()
    .min(1, "Recommender name is required")
    .max(50, "Recommender name is too long (max 50 chars)"),

  category: z
    .enum(categoryOptions, {
      errorMap: () => ({ message: "Please select a valid category" }),
    }),

  moods: z
    .array(z.number()) 
    .min(1, "Please select at least one mood"), 
});