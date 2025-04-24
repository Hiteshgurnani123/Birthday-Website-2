import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Environment-based setup
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
})();

// Global error handlers for uncaught exceptions and unhandled rejections
process.on("uncaughtException", (err) => {
  log(`Uncaught Exception: ${err.message}`, "error");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  log(`Unhandled Rejection: ${reason}`, "error");
  process.exit(1);
});

// Start server after async setup is done
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[express] serving on port ${PORT}`);
});

// Express error handler (for routes or middleware errors)
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  log(`Unhandled error: ${err.message}`, "express");
  res.status(500).json({ message: "Internal Server Error" });
});