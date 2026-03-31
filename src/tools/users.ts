import { z } from "zod";
import { GetCourseClient } from "../client.js";
import type { GetCourseExportResponse, GetCourseExportResult } from "../types.js";

const client = new GetCourseClient();

export const getUsersSchema = z.object({
  status: z.enum(["active", "in_base", "blocked"]).optional().describe("Фильтр по статусу пользователя"),
  created_from: z.string().optional().describe("Дата регистрации от (YYYY-MM-DD)"),
  created_to: z.string().optional().describe("Дата регистрации до (YYYY-MM-DD)"),
});

export async function handleGetUsers(params: z.infer<typeof getUsersSchema>): Promise<string> {
  const filters: Record<string, unknown> = {};
  if (params.status) filters.status = params.status;
  if (params.created_from) filters.created_at = { from: params.created_from, to: params.created_to };

  const exportResp = (await client.get("/account/users", {
    ...(Object.keys(filters).length > 0 ? { filters: JSON.stringify(filters) } : {}),
  })) as GetCourseExportResponse;

  if (!exportResp.success && exportResp.info?.export_id) {
    // Async export — need to poll
    const exportId = exportResp.info.export_id;
    let attempts = 0;
    while (attempts < 10) {
      await new Promise(r => setTimeout(r, 2000));
      const statusResp = (await client.get(`/account/exports/${exportId}`)) as GetCourseExportResult;
      if (statusResp.success && statusResp.info?.items) {
        return JSON.stringify(statusResp.info.items.slice(0, 50), null, 2);
      }
      attempts++;
    }
    return "Экспорт пользователей занимает слишком долго. Попробуйте позже.";
  }

  if (exportResp.success && (exportResp as unknown as GetCourseExportResult).info?.items) {
    const items = ((exportResp as unknown as GetCourseExportResult).info?.items ?? []).slice(0, 50);
    return JSON.stringify(items, null, 2);
  }

  return JSON.stringify(exportResp, null, 2);
}
