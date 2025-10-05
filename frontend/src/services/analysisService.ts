
import { API_BASE_URL } from '@/lib/api-config';
import { fetchWithAuth } from './userService';
import type { UploadResponse, AnalysisResult, Project, ProjectCreate } from './types';


export async function uploadFileForAnalysis(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return fetchWithAuth(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
    });
}

export async function getFileAnalysis(fileId: string): Promise<AnalysisResult> {
    return fetchWithAuth(`${API_BASE_URL}/api/analyze/${fileId}`, {
        method: 'GET',
    });
}

export async function createProject(projectData: ProjectCreate): Promise<Project> {
    return fetchWithAuth(`${API_BASE_URL}/api/project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
    });
}

export async function getProjects(): Promise<Project[]> {
    return fetchWithAuth(`${API_BASE_URL}/api/project`, {
        method: 'GET',
    });
}

export async function getProjectById(projectId: string): Promise<Project> {
     return fetchWithAuth(`${API_BASE_URL}/api/project/${projectId}`, {
        method: 'GET',
    });
}
