
import { API_BASE_URL } from '@/lib/api-config';
import { useAuthStore } from '@/hooks/useAuthStore';

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
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error("No estás autenticado.");
  }

  const res = await fetch(`${API_BASE_URL}/files`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Failed to fetch files.' }));
    throw new Error(errorData.detail || "Could not validate credentials");
  }

  return res.json();
}

/**
 * Uploads metadata for a processed file.
 * Throws an error if the request fails.
 * @param fileData - The metadata of the file to save.
 */
export async function uploadFileMetadata(fileData: FileCreate): Promise<File> {
  const token = useAuthStore.getState().token;
   if (!token) {
    // Cannot upload metadata if not logged in.
    // We can just skip this without throwing an error.
    console.warn("User not logged in, skipping metadata upload.");
    // Return a mock object that satisfies the type, but indicates it's not a real DB entry.
    return { ...fileData, id: '', createdAt: new Date().toISOString(), userId: '' };
  }

  const res = await fetch(`${API_BASE_URL}/files/metadata`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(fileData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Failed to upload metadata.' }));
    throw new Error(errorData.detail || "Could not validate credentials");
  }

  return res.json();
}
