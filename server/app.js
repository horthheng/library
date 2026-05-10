import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import routes from "./routes/index.js";       // centralized routes
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import './cron/sendReminders.js';
import './cron/sendEmailUser.js';
import db from './models/index.js'; // Import database models

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files for uploads (adjust folder names exactly)
app.use("/uploads", express.static(path.join(process.cwd(), "Uploads")));
app.use("/uploads/users", express.static(path.join(process.cwd(), "Uploads/users")));

app.use('/api', routes);
// Routes registration user
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Database synchronization
db.sequelize.sync({ force: false, alter: true }) // force: false prevents dropping tables, alter: true updates schema
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

export default app;