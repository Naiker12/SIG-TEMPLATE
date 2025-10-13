import { API_BASE_URL } from '@/lib/api-config';

export async function splitPdf(file: File, ranges: string): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("ranges", ranges);

  const endpoint = `${API_BASE_URL}/files/split-pdf`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.detail || `API Error: ${res.status}`);
    }

    return await res.blob();
  } catch (error) {
    console.error("Failed to fetch from split PDF service:", error);
    if (error instanceof Error) {
       throw new Error(`Error al conectar con el servicio: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido al dividir el PDF.");
  }
}

export async function mergePdfs(files: File[]): Promise<Blob> {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));
  
  const endpoint = `${API_BASE_URL}/files/merge-pdfs`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.detail || `API Error: ${res.status}`);
    }

    return await res.blob();
  } catch (error) {
    console.error("Failed to fetch from merge PDF service:", error);
    if (error instanceof Error) {
       throw new Error(`Error al conectar con el servicio: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido al unir los PDFs.");
  }
}

/**
 * Generates a base64 preview of the first page of a PDF file.
 * @param file The PDF file to preview.
 * @returns A base64 encoded string of the preview image.
 */
export async function generatePdfPreview(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const endpoint = `${API_BASE_URL}/files/pdf-preview`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.detail || `API Error: ${res.status}`);
    }

    const data = await res.json();
    return data.preview;
  } catch (error) {
    console.error("Failed to generate PDF preview:", error);
    if (error instanceof Error) {
       throw new Error(`Error al generar la previsualización: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido al generar la previsualización.");
  }
}
