import { z } from "zod";
import { GetCourseClient } from "../client.js";
import type { GetCourseCreateUserResponse } from "../types.js";

const client = new GetCourseClient();

export const createUserSchema = z.object({
  email: z.string().email().describe("Email пользователя"),
  first_name: z.string().optional().describe("Имя"),
  last_name: z.string().optional().describe("Фамилия"),
  phone: z.string().optional().describe("Телефон"),
  city: z.string().optional().describe("Город"),
  group_name: z.string().optional().describe("Название группы для добавления"),
  deal_offer_code: z.string().optional().describe("Код предложения для создания заказа"),
});

export async function handleCreateUser(params: z.infer<typeof createUserSchema>): Promise<string> {
  const user: Record<string, unknown> = {
    email: params.email,
  };
  if (params.first_name) user.first_name = params.first_name;
  if (params.last_name) user.last_name = params.last_name;
  if (params.phone) user.phone = params.phone;
  if (params.city) user.city = params.city;

  const body: Record<string, unknown> = { user };
  if (params.group_name) {
    body.system = { ...(body.system as Record<string, unknown> ?? {}), addToGroup: params.group_name };
  }
  if (params.deal_offer_code) {
    body.system = { ...(body.system as Record<string, unknown> ?? {}), deal_offer_code: params.deal_offer_code };
  }

  const result = (await client.post("/account/users", body)) as GetCourseCreateUserResponse;

  if (!result.success) {
    return `Ошибка создания пользователя: ${result.error_message || "неизвестная ошибка"}`;
  }

  return JSON.stringify({
    успех: true,
    user_id: result.result?.user_id,
    добавлен_в_группу: result.result?.added_to_group,
    создан_заказ: result.result?.added_to_deal,
  }, null, 2);
}
