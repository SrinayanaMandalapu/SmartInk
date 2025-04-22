import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/auth.js';
import docRoutes from "./routes/documents.js";

dotenv.config();
console.log("Environment Variables Loaded:", process.env);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/documents", docRoutes);


mongoose.connect('mongodb://127.0.0.1:27017/smartink')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('DB connection error:', err));

app.listen(5000, () => console.log("Server running on port 5000"));

