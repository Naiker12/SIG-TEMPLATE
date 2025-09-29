import { API_BASE_URL } from '@/lib/api-config';

export type ConversionResult = {
  blob: Blob;
  filename: string;
  contentType: string;
};

export async function convertFilesToPdf(files: File[]): Promise<ConversionResult> {
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
    
    const blob = await res.blob();
    const contentDisposition = res.headers.get('content-disposition');
    let filename = files.length > 1 ? "archivos_convertidos.zip" : "archivo.pdf";

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }
    
    const contentType = res.headers.get('content-type') || 'application/octet-stream';

    return { blob, filename, contentType };

  } catch (error) {
    console.error("Failed to fetch from conversion service:", error);
    if (error instanceof Error) {
       throw new Error(`Error al conectar con el servicio de conversión: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido al convertir los archivos.");
  }
}
