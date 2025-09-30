import { API_BASE_URL } from '@/lib/api-config';
import { fetchWithAuth } from './userService';

export async function registerUser(userData: any) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Failed to register');
  }
  return res.json();
}

export async function loginUser(credentials: any) {
    const params = new URLSearchParams();
    params.append('username', credentials.email);
    params.append('password', credentials.password);
  
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to login');
    }
    const tokenData = await res.json();
    const accessToken = tokenData.access_token;

    // After getting token, fetch user details using the NEW token
    const user = await fetchWithAuth(`${API_BASE_URL}/auth/me`, {
        method: 'GET'
    }, accessToken);
    
    if (!user) {
        throw new Error('Failed to fetch user details');
    }

    return { token: accessToken, user };
}
