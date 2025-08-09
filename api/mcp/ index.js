import { getMCPInstance } from "../../lib/mcpInstance.js";

export const config = {
  api: {
    bodyParser: false, // Required for streaming
  },
};

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    // Preflight CORS request
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  let rawBody = "";
  await new Promise((resolve) => {
    req.on("data", (chunk) => (rawBody += chunk));
    req.on("end", resolve);
  });

  let parsed;
  try {
    parsed = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }

  const { transport } = await getMCPInstance();
  await transport.handleRequest(req, res, parsed);
}
