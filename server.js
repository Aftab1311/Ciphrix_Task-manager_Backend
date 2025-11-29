require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const app = express();

const authRoutes = require('./src/routes/auth');
const taskRoutes = require('./src/routes/tasks');

let isconnected = false;

async function initializeDBConnection() {
  try {
    await connectDB();
    isconnected = true;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

app.use(async (req, res, next) => {
  if (!isconnected) {
    await initializeDBConnection();
  }
  next();
});

const allowedOrigins = [
  "https://ciphrix-task-manager-frontend.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors()); // Important for preflight

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Task Manager API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on ${PORT}`));

module.exports = app;
