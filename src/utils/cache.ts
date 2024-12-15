import { API_CONFIG } from '../config/constants';

export function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < API_CONFIG.CACHE_TIME;
}

export function updateCache<T>(data: T): { data: T; timestamp: number } {
  return {
    data,
    timestamp: Date.now()
  };
}