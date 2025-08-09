// pages/api/mcp.js
import { discoverTools } from "../lib/tools.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { setupServerHandlers } from "../mcpServer.js";

export const config = {
  api: {
    bodyParser: false, // must be false for SSE
  },
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Expecting SSE
    if (!(req.headers["accept"] || "").toLowerCase().includes("text/event-stream")) {
      return res.status(406).json({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Not Acceptable: Client must accept text/event-stream" },
        id: null
      });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");

    const tools = await discoverTools();
    const server = new Server({ name: "supercommerce", version: "0.1.0" }, { capabilities: { tools: {} } });
    await setupServerHandlers(server, tools);

    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

    res.on("close", async () => {
      await transport.close();
      await server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res);
    return;
  }

  if (req.method === "POST") {
    // Expecting JSON
    if (!(req.headers["accept"] || "").toLowerCase().includes("application/json")) {
      return res.status(406).json({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Not Acceptable: Client must accept application/json" },
        id: null
      });
    }

    let body = "";
    await new Promise((resolve) => {
      req.on("data", (chunk) => { body += chunk; });
      req.on("end", resolve);
    });

    try {
      req.body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON" });
    }

    const tools = await discoverTools();
    const server = new Server({ name: "supercommerce", version: "0.1.0" }, { capabilities: { tools: {} } });
    await setupServerHandlers(server, tools);

    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

    res.on("close", async () => {
      await transport.close();
      await server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    return;
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end("Method Not Allowed");
}
