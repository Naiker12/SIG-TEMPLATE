import { API_BASE_URL } from '@/lib/api-config';
import type { DuplicateRowPayload } from './types';

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

    const response = await fetch(`${API_BASE_URL}/excel/upload/`, {
        method: 'POST',
        body: formData,
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to process the error response.' }));
        throw new Error(errorData.detail || `Error: ${response.status}`);
    }

    return response.json();
}

/**
 * Fetches a paginated preview of a processed Excel file.
 * @param fileId The ID of the processed file.
 * @param page The page number to fetch.
 * @param pageSize The number of rows per page.
 * @returns The paginated data and metadata for the Excel file.
 */
export async function getExcelPreview(fileId: string, page: number, pageSize: number): Promise<ExcelPreview> {
    const response = await fetch(`${API_BASE_URL}/excel/preview?file_id=${fileId}&page=${page}&page_size=${pageSize}`, {
        method: 'GET',
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to process the error response.' }));
        throw new Error(errorData.detail || `Error: ${response.status}`);
    }
    
    const data = await response.json();
    data.fileId = fileId;
    return data;
}

/**
 * Sends a request to duplicate a row in an Excel file.
 * @param payload - The data for the duplication request.
 */
export async function duplicateExcelRow(payload: DuplicateRowPayload): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/excel/duplicate_row`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to process the duplication error response.' }));
        throw new Error(errorData.detail || `Error: ${response.status}`);
    }

    return response.json();
}
