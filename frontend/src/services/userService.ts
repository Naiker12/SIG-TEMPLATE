
import { API_BASE_URL } from '@/lib/api-config';
import { useAuthStore } from '@/hooks/useAuthStore';

async function fetchWithAuth(url: string, options: RequestInit) {
    const token = useAuthStore.getState().token;
    if (!token) {
        throw new Error("No estás autenticado.");
    }

    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Ocurrió un error inesperado.' }));
        throw new Error(errorData.detail || `Error: ${response.status}`);
    }
    
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
    }
    
    return response.json();
}

type UserUpdateData = {
    name?: string;
    bio?: string;
};

export async function updateUserProfile(data: UserUpdateData) {
    return fetchWithAuth(`${API_BASE_URL}/auth/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

type PasswordUpdateData = {
    current_password: string;
    new_password: string;
};

export async function updateUserPassword(data: PasswordUpdateData) {
    const res = await fetchWithAuth(`${API_BASE_URL}/auth/me/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    // For password, we don't expect a user object back, just a success message
    return res;
}
