
import { API_BASE_URL } from '@/lib/api-config';
import { fetchWithAuth } from './userService';

// Type definitions based on backend schemas
export type File = {
  id: string;
  filename: string;
  fileType: string;
  size: number;
  status: string;
  createdAt: string; // ISO date string
  userId: string;
};

type FileCreate = Omit<File, 'id' | 'createdAt' | 'userId'>;


/**
 * Fetches the list of files for the currently authenticated user.
 * Throws an error if the request fails.
 */
export async function getUserFiles(): Promise<File[]> {
    const files = await fetchWithAuth(`${API_BASE_URL}/files`, {
        method: 'GET',
    });
    return files || [];
}

/**
 * Uploads metadata for a processed file.
 * Throws an error if the request fails.
 * @param fileData - The metadata of the file to save.
 */
export async function uploadFileMetadata(fileData: FileCreate): Promise<File | null> {
    const token = await import('@/hooks/useAuthStore').then(m => m.useAuthStore.getState().token);
    if (!token) {
        console.warn("User not logged in, skipping metadata upload.");
        return null;
    }
    
    return fetchWithAuth(`${API_BASE_URL}/files/metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fileData),
    });
}
