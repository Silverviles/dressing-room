require("dotenv").config();

const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const { hashPassword } = require("../src/utils/hash");

const seedAdmin = async () => {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in environment");
  }

  await connectDB();

  const normalizedUsername = username.trim().toLowerCase();
  const existingAdmin = await User.findOne({ username: normalizedUsername });

  if (existingAdmin) {
    console.log(`Admin user "${normalizedUsername}" already exists`);
    process.exit(0);
  }

  const passwordHash = await hashPassword(password);
  await User.create({
    username: normalizedUsername,
    passwordHash,
    role: "admin",
  });

  console.log(`Admin user "${normalizedUsername}" created`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error("Failed to seed admin:", error.message);
  process.exit(1);
});
