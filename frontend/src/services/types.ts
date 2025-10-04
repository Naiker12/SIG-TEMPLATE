
// This file can be used to define shared types that are used across multiple services.
import type { z } from 'zod';

// --- Excel Processing ---
export type DuplicateRowPayload = {
    file_id: string;
    row_id: number;
    count: number;
};


// --- Data Analysis ---

// Corresponds to FileMetadata in backend schemas.py
export type FileMetadata = {
    id: string;
    filename: string;
    filetype: string;
    columns: string[];
    rows_count: number;
    size: number;
    uploadedAt: string; // ISO datetime string
    userId: string;
}

// Corresponds to UploadResponse in backend schemas.py
export type UploadResponse = {
    message: string;
    file_metadata: FileMetadata;
}

// Corresponds to AnalysisResult in backend schemas.py
export type AnalysisResult = {
    columns: string[];
    numerical_columns: string[];
    categorical_columns: string[];
    total_rows: number;
    basic_stats: Record<string, Record<string, any>>;
}

// Corresponds to ProjectCreate in backend schemas.py
export type ProjectCreate = {
    name: string;
    description?: string | null;
    fileId: string;
    config: Record<string, any>;
};

// Corresponds to Project in backend schemas.py
export type Project = {
    id: string;
    userId: string;
    createdAt: string; // ISO datetime string
    updatedAt: string; // ISO datetime string
} & ProjectCreate;

    