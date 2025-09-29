import { API_BASE_URL } from '@/lib/api-config';

export async function convertFilesToPdf(files: File[]): Promise<Blob> {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));
  
  const endpoint = `${API_BASE_URL}/files/convert-to-pdf`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Error response from backend:", errorBody);
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return await res.blob();
  } catch (error) {
    console.error("Failed to fetch from conversion service:", error);
    if (error instanceof Error) {
       throw new Error(`Error al conectar con el servicio de conversión: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido al convertir los archivos.");
  }
}
