// This file can be used to define shared types that are used across multiple services.

// For example, from excelService.ts:
export type DuplicateRowPayload = {
    file_id: string;
    row_id: number;
    count: number;
};
