import { getMCPInstance, closeMCPInstance } from "../../lib/mcpInstance.js";

export const config = {
  api: {
    bodyParser: false,
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

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
  });

  // Send initial connected event
  res.write(`event: connected\n`);
  res.write(`data: ${JSON.stringify({ status: "ok", time: new Date().toISOString() })}\n\n`);
  if (res.flush) res.flush();

  const heartbeat = setInterval(() => {
    res.write(`: ping - ${new Date().toISOString()}\n\n`);
    if (res.flush) res.flush();
  }, 30000);

  req.on("close", async () => {
    clearInterval(heartbeat);
    await closeMCPInstance();
  });

  // Optionally comment out if it interferes with streaming
  // const { transport } = await getMCPInstance();
  // await transport.handleRequest(req, res);
}
