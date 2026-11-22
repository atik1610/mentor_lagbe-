require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getDb } = require("./config/db");

const app = express();
app.disable("x-powered-by");
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "MentorLagbe API is running" });
});

app.get("/api/db-health", async (req, res) => {
  if (!process.env.MONGODB_URI) {
    return res.status(503).json({ status: "not_configured", message: "Set MONGODB_URI in server/.env" });
  }
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    res.json({ status: "connected", database: db.databaseName });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    res.status(503).json({ status: "unavailable", message: "Could not reach database" });
  }
});

app.use((req, res) => res.status(404).json({ message: "API route not found" }));
app.use((err, req, res, next) => {
  console.error("API error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => console.log(`MentorLagbe API listening on http://localhost:${PORT}`));
