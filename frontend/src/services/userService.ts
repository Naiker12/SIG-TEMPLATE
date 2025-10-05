import { API_BASE_URL } from '@/lib/api-config';
import { useAuthStore } from '@/hooks/useAuthStore';

export async function fetchWithAuth(url: string, options: RequestInit, explicitToken?: string) {
    const token = explicitToken ?? useAuthStore.getState().token;
    
    const headers = new Headers(options.headers || {});

    // Siempre añadir el token si está disponible. FastAPI/Uvicorn manejan correctamente
    // las cabeceras de autorización incluso con peticiones multipart/form-data.
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    
    // No establecer 'Content-Type' manualmente si el cuerpo es FormData,
    // el navegador lo hará con el boundary correcto.
    if (!(options.body instanceof FormData)) {
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }
    }

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
        // Si el error es 401 (Unauthorized), el token es inválido o el usuario no existe.
        // Cerramos la sesión del frontend para forzar un nuevo login.
        if (response.status === 401) {
            useAuthStore.getState().clearSession();
            // Refrescar la página podría ser una opción para redirigir a la home.
            // window.location.reload(); 
        }
        
        // Intentar parsear el mensaje de error del backend
        const errorData = await response.json().catch(() => ({ detail: `Error del servidor: ${response.statusText}` }));
        throw new Error(errorData.detail || `Error: ${response.status}`);
    }
    
    // Manejar respuestas sin contenido
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
        body: JSON.stringify(data),
    });
}
