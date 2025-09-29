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
