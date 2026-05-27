const jwt = require("jsonwebtoken");

const signToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment");
  }

  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment");
  }

  return jwt.verify(token, secret);
};

module.exports = { signToken, verifyToken };
