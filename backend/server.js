import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import "dotenv/config";
import http from "http";
import { initSocket } from "./socket.js";

const app = express();
const port = process.env.PORT || 4000;

// ✅ CORS configuration — allow frontend from Vercel + local
app.use(
  cors({
    origin: [
      "http://localhost:5173", // for local frontend
      "https://fullstack-six-eta.vercel.app/", // 👉 replace with your actual Vercel frontend URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Middleware to parse JSON requests
app.use(express.json());

// ✅ Connect Database
connectDB();

// ✅ Routes
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ✅ Root endpoint
app.get("/", (req, res) => res.send("API Working ✅"));

// ✅ Socket.io setup
const server = http.createServer(app);
initSocket(server);

// ✅ Start server
server.listen(port, () => console.log(`✅ Server running on port ${port}`));
