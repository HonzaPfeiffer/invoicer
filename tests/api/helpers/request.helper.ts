import { NextRequest } from 'next/server';

/**
 * Base URL for API tests - from environment variable or default
 */
export const BASE_URL = process.env.BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

/**
 * Create a mock NextRequest for testing API routes
 */
export function createMockRequest(options: {
  method?: string;
  url?: string;
  body?: any;
  headers?: Record<string, string>;
  searchParams?: Record<string, string>;
}): NextRequest {
  const {
    method = 'GET',
    url = `${BASE_URL}/api/test`,
    body,
    headers = {},
    searchParams = {},
  } = options;

  const urlWithParams = new URL(url);
  Object.entries(searchParams).forEach(([key, value]) => {
    urlWithParams.searchParams.set(key, value);
  });

  const requestInit: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    requestInit.body = JSON.stringify(body);
  }

  return new NextRequest(urlWithParams.toString(), requestInit);
}

/**
 * Mock NextAuth session for testing authenticated routes
 */
export function mockSession(userId: string, userEmail: string, userName: string) {
  return {
    user: {
      id: userId,
      email: userEmail,
      name: userName,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

/**
 * Parse response from NextResponse
 */
export async function parseResponse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
