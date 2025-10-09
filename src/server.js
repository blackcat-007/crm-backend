import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import customerRoutes from "./routes/customers.js";
import leadRoutes from "./routes/leads.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/leads", leadRoutes);
app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true
}));

// Connect MongoDB only in non-test env
if (process.env.NODE_ENV !== "test") {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
