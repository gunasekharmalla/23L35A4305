// logger.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); 

const LOG_SERVER_URL = "http://20.244.56.144/evaluation-service/logs";
const ACCESS_TOKEN =
  process.env.ACCESS_TOKEN;
  

if (!ACCESS_TOKEN) {
  console.warn("[LOGGER WARNING] No ACCESS_TOKEN found. Logs will fail with 401.");
}


const VALID_STACKS = ["backend", "frontend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = [
  "cache", "controller", "cron_job", "db", "domain", "handler",
  "repository", "route", "service", // backend
  "api", "component", "hook", "page", "state", "style", // frontend
  "auth", "config", "middleware", "utils" // shared
];

/**
 * Logs application events to the external server
 * @param {string} stack - "backend" | "frontend"
 * @param {string} level - "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} pkg - one of the allowed package names
 * @param {string} message - descriptive log message
 */
export async function log(stack, level, pkg, message) {
  try {
    // Validate inputs
    if (!VALID_STACKS.includes(stack)) throw new Error(`Invalid stack: ${stack}`);
    if (!VALID_LEVELS.includes(level)) throw new Error(`Invalid level: ${level}`);
    if (!VALID_PACKAGES.includes(pkg)) throw new Error(`Invalid package: ${pkg}`);
    if (typeof message !== "string" || message.trim() === "")
      throw new Error("Message must be a non-empty string");

    // Make API call
    const response = await axios.post(
      LOG_SERVER_URL,
      { stack, level, package: pkg, message },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`[LOGGER] Log sent: ${response.data.logID}`);
    return response.data;
  } catch (error) {
    console.error(`[LOGGER ERROR]  ${error.response?.status || ""} ${error.message}`);
    return null;
  }
}
