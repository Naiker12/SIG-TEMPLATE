
import { API_BASE_URL } from '@/lib/api-config';

export async function fetchWithAuth(url: string, options: RequestInit) {
    const token = await import('@/hooks/useAuthStore').then(m => m.useAuthStore.getState().token);
    
    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
        if (response.status === 401) {
            // Option: auto-logout on 401
            // (await import('@/hooks/useAuthStore')).useAuthStore.getState().clearSession();
            throw new Error("Could not validate credentials");
        }
        const errorData = await response.json().catch(() => ({ detail: 'Ocurrió un error inesperado.' }));
        throw new Error(errorData.detail || `Error: ${response.status}`);
    }
    
    // Handle responses with no content
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
    const payload: UserUpdateData = {};
    if (data.name) {
        payload.name = data.name;
    }
    // Only include bio if it's not undefined (allows clearing it with empty string)
    if (data.bio !== undefined) {
        payload.bio = data.bio;
    }

    return fetchWithAuth(`${API_BASE_URL}/auth/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}

type PasswordUpdateData = {
    current_password: string;
    new_password: string;
};

export async function updateUserPassword(data: PasswordUpdateData) {
    return fetchWithAuth(`${API_BASE_URL}/auth/me/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}
