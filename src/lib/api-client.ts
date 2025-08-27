"use client";

/**
 * Lightweight API client for calling server routes without authentication.
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    } as Record<string, string>;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error_description ||
        errorData.message ||
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }

  // Notice endpoints removed; will be reintroduced with Firebase

  // Add other API helpers as needed
}
