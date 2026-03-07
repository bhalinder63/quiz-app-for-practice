import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

const historyFile = path.resolve("quiz-history.json");

function readHistory() {
  try {
    if (fs.existsSync(historyFile)) {
      const text = fs.readFileSync(historyFile, "utf-8").trim();
      if (text) return JSON.parse(text);
    }
  } catch { /* ignore corrupt file */ }
  return [];
}

function historyApi() {
  return {
    name: "history-api",
    configureServer(server) {
      server.middlewares.use("/api/history", (req, res) => {
        if (req.method === "GET") {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(readHistory()));
        } else if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", () => {
            try {
              if (!body.trim()) {
                res.end("{}");
                return;
              }
              const data = readHistory();
              data.push(JSON.parse(body));
              fs.writeFileSync(historyFile, JSON.stringify(data, null, 2));
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        }
      });
    },
  };
}

export default defineConfig({
  base: "/quiz-app-for-practice/",
  plugins: [react(), historyApi()],
});
