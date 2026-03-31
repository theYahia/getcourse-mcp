#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getUsersSchema, handleGetUsers } from "./tools/users.js";
import { createUserSchema, handleCreateUser } from "./tools/create_user.js";
import { getDealsSchema, handleGetDeals } from "./tools/deals.js";

const server = new McpServer({ name: "getcourse-mcp", version: "1.0.0" });

server.tool("get_users", "Получение списка пользователей GetCourse.", getUsersSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetUsers(params) }] }));

server.tool("create_user", "Создание или обновление пользователя в GetCourse.", createUserSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateUser(params) }] }));

server.tool("get_deals", "Получение списка заказов (сделок) GetCourse.", getDealsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetDeals(params) }] }));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[getcourse-mcp] Сервер запущен. 3 инструмента.");
}

main().catch((error) => { console.error("[getcourse-mcp] Ошибка:", error); process.exit(1); });
