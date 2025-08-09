import { getMCPInstance, closeMCPInstance } from "../../lib/mcpInstance.js";

export const config = {
  api: {
    bodyParser: false, // Required for streaming
  },
};

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
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

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  const { transport } = await getMCPInstance();

  // Send initial connection message
  res.write(`event: connected\n`);
  res.write(`data: ${JSON.stringify({ status: "ok", time: new Date().toISOString() })}\n\n`);

  // Heartbeat to keep SSE alive
  const heartbeat = setInterval(() => {
    res.write(`: ping - ${new Date().toISOString()}\n\n`);
  }, 30000);

  res.on("close", async () => {
    clearInterval(heartbeat);
    await closeMCPInstance();
  });

  await transport.handleRequest(req, res);
}
