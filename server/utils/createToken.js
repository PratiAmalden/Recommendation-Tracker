import jwt from "jsonwebtoken";

export function createToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );
}
