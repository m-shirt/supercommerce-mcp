import { discoverTools } from "./tools.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { setupServerHandlers } from "../mcpServer.js";

let serverInstance = null;
let transportInstance = null;

export async function getMCPInstance() {
  if (!serverInstance || !transportInstance) {
    const tools = await discoverTools();

    const server = new Server(
      { name: "supercommerce", version: "0.1.0" },
      { capabilities: { tools: {} } }
    );
    await setupServerHandlers(server, tools);

    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);

    serverInstance = server;
    transportInstance = transport;
  }

  return { server: serverInstance, transport: transportInstance };
}

export async function closeMCPInstance() {
  if (transportInstance) {
    await transportInstance.close();
    transportInstance = null;
  }
  if (serverInstance) {
    await serverInstance.close();
    serverInstance = null;
  }
}
