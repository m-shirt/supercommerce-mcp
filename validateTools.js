// validateTools.js
import Ajv from "ajv";
import { discoverTools } from "./lib/tools.js";

const ajv = new Ajv({ strict: true, allErrors: true });

console.log("🔍 Validating MCP tool schemas...\n");

const tools = await discoverTools();

let hasError = false;

for (const tool of tools) {
  try {
    ajv.compile(tool.definition.function.parameters);
    console.log(`✅ ${tool.definition.function.name} is valid`);
  } catch (err) {
    hasError = true;
    console.error(`❌ Invalid schema for: ${tool.definition.function.name}`);
    console.error(err.message, "\n");
  }
}

if (!hasError) {
  console.log("\n🎉 All tool schemas are valid!");
} else {
  console.log("\n⚠️  Some tool schemas are invalid — fix them before deploying.");
  process.exit(1);
}
