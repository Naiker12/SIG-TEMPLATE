import { API_BASE_URL } from '@/lib/api-config';
import { useAuthStore } from '@/hooks/useAuthStore';

export async function fetchWithAuth(url: string, options: RequestInit, explicitToken?: string) {
    const token = explicitToken ?? useAuthStore.getState().token;
    
    const headers = new Headers(options.headers || {});

    // Do not set Authorization header if the body is FormData.
    // The browser will handle the multipart boundary and our token will be sent
    // as part of the form data if needed, or in this case, the server will
    // correctly parse the multipart request and then check for auth.
    // The main issue is that setting headers manually breaks FormData requests.
    if (token && !(options.body instanceof FormData)) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
        if (response.status === 401) {
            // This is a critical error, often meaning the token is expired or invalid.
            // Forcing a logout might be a good strategy here.
            // useAuthStore.getState().clearSession();
            throw new Error("Could not validate credentials");
        }
        // Try to parse the error message from the backend
        const errorData = await response.json().catch(() => ({ detail: 'An unexpected error occurred.' }));
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
