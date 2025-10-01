
import { API_BASE_URL } from '@/lib/api-config';
import { fetchWithAuth } from './userService';

export type ExcelColumn = {
    accessorKey: string;
    header: string;
};

export type ExcelPreview = {
    page: number;
    pageSize: number;
    totalRows: number;
    totalPages: number;
    columns: ExcelColumn[];
    data: any[];
    fileId?: string; // Add fileId to the response for subsequent calls
};

/**
 * Uploads and processes an Excel file.
 * The backend will duplicate rows and save the processed file.
 * @param file The Excel file to upload.
 * @returns An object containing the file_id of the processed file.
 */
export async function uploadAndProcessExcel(file: File): Promise<{ file_id: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetchWithAuth(`${API_BASE_URL}/excel/upload`, {
        method: 'POST',
        body: formData,
    });
    
    if (!response) {
        throw new Error('No se recibió respuesta del servidor al subir el archivo.');
    }

    return response;
}

/**
 * Fetches a paginated preview of a processed Excel file.
 * @param fileId The ID of the processed file.
 * @param page The page number to fetch.
 * @param pageSize The number of rows per page.
 * @returns The paginated data and metadata for the Excel file.
 */
export async function getExcelPreview(fileId: string, page: number, pageSize: number): Promise<ExcelPreview> {
    const response = await fetchWithAuth(`${API_BASE_URL}/excel/preview?file_id=${fileId}&page=${page}&page_size=${pageSize}`, {
        method: 'GET',
    });
    
    if (!response) {
        throw new Error('No se recibió respuesta del servidor al obtener la vista previa.');
    }
    
    // Add fileId to the response for state management
    response.fileId = fileId;
    return response;
}
