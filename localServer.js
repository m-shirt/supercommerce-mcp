import express from "express";
import mcpHandler from "./api/mcp.js";       // POST handler for /api/mcp
import sseHandler from "./api/mcp/sse.js";   // GET handler for /api/mcp/sse

const app = express();
app.use(express.json());

app.post("/api/mcp", (req, res) => {
  mcpHandler(req, res);
});

app.get("/api/mcp/sse", (req, res) => {
  sseHandler(req, res);
});

app.listen(3002, () => {
  console.log("Local MCP API running at http://localhost:3002");
});
