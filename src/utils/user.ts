import { v4 as uuidv4 } from 'uuid';

export function getUserId(): string {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') {
    // Return a temporary ID for SSR, will be replaced on client side
    return 'temp-ssr-id';
  }

  try {
    let id = localStorage.getItem('user_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('user_id', id);
    }
    return id;
  } catch (error) {
    // Fallback if localStorage is not available
    console.warn('localStorage not available:', error);
    return uuidv4();
  }
}