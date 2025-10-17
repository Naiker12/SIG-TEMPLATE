// frontend/src/services/apiService.ts

import { API_BASE_URL } from '@/lib/api-config';
import { fetchWithAuth } from './userService';

/**
 * Define el tipo de dato para una petición a una API personalizada.
 * Corresponde con el esquema `CustomApiRequest` en el backend.
 */
export type CustomApiRequest = {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: Record<string, any>;
}

export type TempApiData = {
    id: string;
    userId: string;
    apiUrl: string;
    responseData: any;
    createdAt: string;
    expiresAt: string;
};

/**
 * Realiza una petición a nuestro endpoint proxy para interactuar con una API externa.
 * 
 * @param requestData Los datos de la petición a la API externa.
 * @returns La respuesta de la API externa (ya parseada como JSON).
 * @throws Lanza un error si la petición al proxy falla.
 */
export async function fetchCustomApi(requestData: CustomApiRequest): Promise<any> {
    const endpoint = `${API_BASE_URL}/api/custom-api/proxy`;

    try {
        const response = await fetchWithAuth(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
        
        return response;

    } catch (error) {
        console.error("Error al llamar al servicio proxy de API personalizada:", error);
        throw error;
    }
}

/**
 * Recupera los últimos datos guardados temporalmente para el usuario.
 */
export async function getLatestApiData(): Promise<TempApiData> {
    const endpoint = `${API_BASE_URL}/api/custom-api/latest`;
    return fetchWithAuth(endpoint, { method: 'GET' });
}

/**
 * Limpia los datos temporales del usuario en el backend.
 */
export async function clearTempApiData(): Promise<void> {
    const endpoint = `${API_BASE_URL}/api/custom-api/clear`;
    await fetchWithAuth(endpoint, { method: 'DELETE' });
}
