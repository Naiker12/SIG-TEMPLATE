import { API_BASE_URL } from '@/lib/api-config';

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

    // After getting token, fetch user details
    const userRes = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    
    if (!userRes.ok) {
        throw new Error('Failed to fetch user details');
    }

    const user = await userRes.json();
    return { token: tokenData.access_token, user };
}
