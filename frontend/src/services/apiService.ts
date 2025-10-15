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

/**
 * Define el tipo de dato para la respuesta de una API personalizada.
 * Corresponde con el esquema `CustomApiResponse` en el backend.
 */
export type CustomApiResponse = {
    status_code: number;
    data: any;
}

/**
 * Realiza una petición a nuestro endpoint proxy para interactuar con una API externa.
 * 
 * @param requestData Los datos de la petición a la API externa.
 * @returns La respuesta de la API externa, encapsulada por nuestro backend.
 * @throws Lanza un error si la petición al proxy falla.
 */
export async function fetchCustomApi(requestData: CustomApiRequest): Promise<CustomApiResponse> {
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
        // Lanza el error para que el componente que llama pueda manejarlo (ej. mostrar un toast).
        throw error;
    }
}
