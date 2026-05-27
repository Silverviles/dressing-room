const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
}

export interface Cloth {
  id: string;
  clothName: string;
  clothType: string;
  brand: string;
  imageUrl: string;
  storeUrl: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

type RequestOptions = {
  method?: string;
  token?: string | null;
  body?: unknown;
  formData?: FormData;
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const headers: Record<string, string> = {};

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let body: BodyInit | undefined;
  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data as T;
};

const requestBlob = async (path: string, options: RequestOptions = {}): Promise<Blob> => {
  const headers: Record<string, string> = {};
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let body: BodyInit | undefined;
  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }

  return response.blob();
};

export const resolveAssetUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};

export const api = {
  register: (username: string, password: string) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: { username, password },
    }),

  login: (username: string, password: string) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: { username, password },
    }),

  getMe: (token: string) =>
    request<{ user: AuthUser }>("/api/auth/me", { token }),

  getClothes: (token: string) =>
    request<Cloth[]>("/api/clothes", { token }),

  createCloth: (token: string, formData: FormData) =>
    request<Cloth>("/api/clothes", {
      method: "POST",
      token,
      formData,
    }),

  updateCloth: (token: string, id: string, formData: FormData) =>
    request<Cloth>(`/api/clothes/${id}`, {
      method: "PATCH",
      token,
      formData,
    }),

  deleteCloth: (token: string, id: string) =>
    request<{ message: string }>(`/api/clothes/${id}`, {
      method: "DELETE",
      token,
    }),

  getFavorites: (token: string) =>
    request<Cloth[]>("/api/favorites", { token }),

  addFavorite: (token: string, clothId: string) =>
    request<{ message: string }>(`/api/favorites/${clothId}`, {
      method: "POST",
      token,
    }),

  removeFavorite: (token: string, clothId: string) =>
    request<{ message: string }>(`/api/favorites/${clothId}`, {
      method: "DELETE",
      token,
    }),

  sendChatMessage: (token: string, message: string) =>
    request<{ reply: string }>("/api/chat", {
      method: "POST",
      token,
      body: { message },
    }),

  downloadClothReport: (token: string) =>
    requestBlob("/api/reports/cloths", { token }),

  downloadTryoutReport: (token: string) =>
    requestBlob("/api/reports/tryouts", { token }),

  downloadRecommendationReport: (
    token: string,
    payload: { items: unknown[]; filters: { gender?: string; occasion?: string; culture?: string } }
  ) =>
    requestBlob("/api/reports/recommendations", {
      method: "POST",
      token,
      body: payload,
    }),

};
