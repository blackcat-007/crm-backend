import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || "defaultSecret",
  refreshSecret:process.env.JWT_REFRESH_SECRET || "",
};

export default config;
