// pages/api/mcp/sse.js (or wherever your SSE endpoint is)
import { discoverTools } from "../../lib/tools.js";

export const config = {
  api: {
    bodyParser: false, // Required for streaming SSE
  },
};

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  // Send endpoint event with the POST URL for JSON-RPC calls
  res.write(`event: endpoint\n`);
  res.write(`data: https://supercommerce-mcp.vercel.app/api/mcp\n\n`);

//   // Send server info event (id: 0)
//   res.write(`event: message\n`);
//   res.write(
//     `data: ${JSON.stringify({
//       jsonrpc: "2.0",
//       id: 0,
//       result: {
//         protocolVersion: "2025-08-09",
//         capabilities: { experimental: {}, tools: { listChanged: false } },
//         serverInfo: { name: "SuperCommerce", version: "1.0.0" },
//       },
//     })}\n\n`
//   );

//   // Dynamically fetch tools list
//   const tools = await discoverTools();
// console.log("Discovered tools:", tools);

//   // Send tools list event (id: 1)
//   res.write(`event: message\n`);
//   res.write(
//     `data: ${JSON.stringify({
//       jsonrpc: "2.0",
//       id: 1,
//       result: { tools: tools },
//     })}\n\n`
//   );

  // Heartbeat every 30 seconds to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(`: ping - ${new Date().toISOString()}\n\n`);
  }, 30000);

  req.on("close", () => {
    clearInterval(heartbeat);
    res.end();
  });
}
