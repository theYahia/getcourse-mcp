#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getUsersSchema, handleGetUsers } from "./tools/users.js";
import { createUserSchema, handleCreateUser } from "./tools/create_user.js";
import { getDealsSchema, handleGetDeals } from "./tools/deals.js";

const server = new McpServer({ name: "getcourse-mcp", version: "1.1.0" });

server.tool("get_users", "Получение списка пользователей GetCourse.", getUsersSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetUsers(params) }] }));

server.tool("create_user", "Создание или обновление пользователя в GetCourse.", createUserSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateUser(params) }] }));

server.tool("get_deals", "Получение списка заказов (сделок) GetCourse.", getDealsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetDeals(params) }] }));

async function main() {
  const httpPort = process.env.HTTP_PORT || (process.argv.includes("--http") ? process.argv[process.argv.indexOf("--http") + 1] : null);
  if (httpPort) {
    const port = parseInt(String(httpPort), 10) || 3000;
    await startHttpTransport(port);
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[getcourse-mcp] Сервер запущен (stdio). 3 инструмента.");
  }
}

async function startHttpTransport(port: number) {
  const { createServer } = await import("node:http");
  const { StreamableHTTPServerTransport } = await import("@modelcontextprotocol/sdk/server/streamableHttp.js");
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined as unknown as (() => string) });
  const httpServer = createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", tools: 3, transport: "streamable-http" }));
      return;
    }
    if (req.url === "/mcp") { await transport.handleRequest(req, res); return; }
    res.writeHead(404); res.end("Not found. Use /mcp or /health.");
  });
  await server.connect(transport);
  httpServer.listen(port, () => {
    console.error(`[getcourse-mcp] HTTP server on port ${port}. 3 tools available.`);
  });
}

const isDirectRun = process.argv[1]?.endsWith("index.js") || process.argv[1]?.endsWith("index.ts");
if (isDirectRun) {
  main().catch((error) => { console.error("[getcourse-mcp] Ошибка:", error); process.exit(1); });
}

export { server };
