const TIMEOUT = 15_000;

export class GetCourseClient {
  private domain: string;
  private apiKey: string;

  constructor() {
    this.domain = process.env.GETCOURSE_DOMAIN ?? "";
    this.apiKey = process.env.GETCOURSE_API_KEY ?? "";
    if (!this.domain || !this.apiKey) {
      throw new Error(
        "Переменные окружения GETCOURSE_DOMAIN и GETCOURSE_API_KEY обязательны. " +
        "GETCOURSE_DOMAIN — домен аккаунта (например, myschool.getcourse.ru). " +
        "GETCOURSE_API_KEY — секретный ключ из настроек аккаунта."
      );
    }
  }

  private get baseUrl(): string {
    return `https://${this.domain}/pl/api`;
  }

  async get(path: string, params?: Record<string, string>): Promise<unknown> {
    const allParams = { ...params, key: this.apiKey };
    const query = "?" + new URLSearchParams(allParams).toString();
    const url = `${this.baseUrl}${path}${query}`;
    return this.request("GET", url);
  }

  async post(path: string, body?: Record<string, unknown>): Promise<unknown> {
    const url = `${this.baseUrl}${path}?key=${encodeURIComponent(this.apiKey)}`;
    return this.request("POST", url, body);
  }

  private async request(method: string, url: string, body?: unknown): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`GetCourse HTTP ${response.status}: ${text}`);
      }

      const data = await response.json() as Record<string, unknown>;

      if (data.error_code || data.success === false) {
        const msg = (data.error_message as string) || (data.message as string) || JSON.stringify(data);
        throw new Error(`GetCourse: ${msg}`);
      }

      return data;
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("GetCourse: таймаут запроса (15 секунд). Попробуйте позже.");
      }
      throw error;
    }
  }
}
