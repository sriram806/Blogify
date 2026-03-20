type ApiRequestOptions = Omit<RequestInit, "credentials"> & {
  timeoutMs?: number;
};

export const AUTH_TOKEN_KEY = "blogify.auth.token";

const DEFAULT_TIMEOUT_MS = 12000;

const getStoredAuthToken = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(AUTH_TOKEN_KEY) || "";
};

const parseJsonSafe = async <T>(response: Response): Promise<T | null> => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;

  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export const getAuthorBlogApiBase = () => {
  const rawApiBase = process.env.NEXT_PUBLIC_AUTHER_API_URL || "http://localhost:5001/api/v1/blog";
  const apiBase = rawApiBase.replace(/\/api\/v1\/auther\/?$/i, "/api/v1/blog");
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && apiBase.startsWith("http://")) {
    return apiBase.replace("http://", "https://");
  }

  return apiBase;
};

export const secureApiFetch = async <T>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<{ ok: boolean; status: number; data: T | null; message: string }> => {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");

    const token = getStoredAuthToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      credentials: "include",
      mode: "cors",
      cache: "no-store",
      redirect: "follow",
      referrerPolicy: "strict-origin-when-cross-origin",
      signal: controller.signal,
      headers,
    });

    const data = await parseJsonSafe<T>(response);

    if (!response.ok) {
      const messageFromData =
        typeof data === "object" && data !== null && "message" in data
          ? String((data as { message?: string }).message || "Request failed")
          : "Request failed";

      return {
        ok: false,
        status: response.status,
        data,
        message: messageFromData,
      };
    }

    return {
      ok: true,
      status: response.status,
      data,
      message: "OK",
    };
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "AbortError"
        ? "Request timeout. Please try again."
        : "Network error. Please check your connection and service availability.";

    return {
      ok: false,
      status: 0,
      data: null,
      message,
    };
  } finally {
    clearTimeout(timer);
  }
};
