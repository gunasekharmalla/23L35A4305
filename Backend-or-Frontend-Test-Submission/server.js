// app.js
import express from "express";
import { log } from "./logger.js";

const app = express();

app.use(express.json());

// Example logging on each request
app.use(async (req, res, next) => {
  await log("backend", "info", "middleware", `Incoming request: ${req.method} ${req.url}`);
  next();
});

// Example route
app.get("/users", async (req, res) => {
  try {
    await log("backend", "debug", "route", "Fetching users from database");
    const users = []; // your DB logic here
    await log("backend", "info", "route", `Fetched ${users.length} users`);
    res.json(users);
  } catch (err) {
    await log("backend", "error", "handler", `Failed to fetch users: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3000, async () => {
  await log("backend", "info", "config", "Server started on port 3000");
  console.log("Server running on port 3000");
});
