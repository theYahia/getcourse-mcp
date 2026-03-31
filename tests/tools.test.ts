import { describe, it, expect, vi } from "vitest";

vi.mock("../src/client.js", () => ({
  GetCourseClient: class {
    get = vi.fn();
    post = vi.fn();
  },
}));

import { getUsersSchema } from "../src/tools/users.js";
import { getDealsSchema } from "../src/tools/deals.js";
import { createUserSchema } from "../src/tools/create_user.js";

describe("getUsersSchema", () => {
  it("accepts valid status filters", () => {
    const result = getUsersSchema.safeParse({ status: "active" });
    expect(result.success).toBe(true);
  });

  it("accepts empty params", () => {
    const result = getUsersSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = getUsersSchema.safeParse({ status: "invalid" });
    expect(result.success).toBe(false);
  });

  it("accepts date range", () => {
    const result = getUsersSchema.safeParse({
      status: "in_base",
      created_from: "2025-01-01",
      created_to: "2025-12-31",
    });
    expect(result.success).toBe(true);
  });
});

describe("getDealsSchema", () => {
  it("accepts valid deal status", () => {
    const result = getDealsSchema.safeParse({ status: "finished" });
    expect(result.success).toBe(true);
  });

  it("accepts all deal statuses", () => {
    for (const s of ["new", "in_work", "payment_waiting", "finished", "cancelled", "false_deal"]) {
      expect(getDealsSchema.safeParse({ status: s }).success).toBe(true);
    }
  });

  it("accepts date range filters", () => {
    const result = getDealsSchema.safeParse({
      created_from: "2025-01-01",
      created_to: "2025-12-31",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = getDealsSchema.safeParse({ status: "unknown" });
    expect(result.success).toBe(false);
  });
});

describe("createUserSchema", () => {
  it("requires email", () => {
    const result = createUserSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = createUserSchema.safeParse({ email: "not-email" });
    expect(result.success).toBe(false);
  });

  it("accepts full user params", () => {
    const result = createUserSchema.safeParse({
      email: "test@example.com",
      first_name: "Ivan",
      last_name: "Petrov",
      phone: "+79001234567",
      city: "Moscow",
      group_name: "VIP",
      deal_offer_code: "OFFER1",
    });
    expect(result.success).toBe(true);
  });

  it("accepts minimal params", () => {
    const result = createUserSchema.safeParse({ email: "min@test.com" });
    expect(result.success).toBe(true);
  });
});
