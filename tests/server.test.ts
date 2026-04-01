import { describe, it, expect, vi } from "vitest";

vi.mock("@modelcontextprotocol/sdk/server/stdio.js", () => ({
  StdioServerTransport: vi.fn(),
}));

vi.mock("../src/client.js", () => ({
  GetCourseClient: class {
    get = vi.fn();
    post = vi.fn();
  },
}));

vi.spyOn(process, "exit").mockImplementation((() => {}) as any);

describe("server smoke test", () => {
  it("registers exactly 3 tools", async () => {
    const { server } = await import("../src/index.js");
    const s = server as any;
    expect(s._registeredTools).toBeDefined();
    const toolNames = Object.keys(s._registeredTools);
    expect(toolNames.length).toBe(3);
    const expected = ["get_users", "create_user", "get_deals"];
    for (const n of expected) {
      expect(toolNames).toContain(n);
    }
  });
});
