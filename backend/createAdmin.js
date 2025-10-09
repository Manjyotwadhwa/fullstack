import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import User from "./models/userModel.js"; // This is your user model

const run = async () => {
  try {
    // Connect to your MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ DB Connected");

    // Hash the password
    const hashedPassword = await bcrypt.hash("admin123", Number(process.env.SALT));

    // Create admin user
    const newUser = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      cartData: {},
    });

    console.log("✅ Admin user created!");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
