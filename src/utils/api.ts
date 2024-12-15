import { API_CONFIG } from '../config/constants';

export async function fetchWithHeaders(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = {
    'Content-Type': 'application/json',
    'X-Master-Key': import.meta.env.VITE_JSONBIN_API_KEY,
    'X-Bin-Meta': 'false'
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export function getLeaderboardUrl(): string {
  return `${API_CONFIG.BASE_URL}/${import.meta.env.VITE_JSONBIN_BIN_ID}/latest`;
}

export function getUpdateUrl(): string {
  return `${API_CONFIG.BASE_URL}/${import.meta.env.VITE_JSONBIN_BIN_ID}`;
}