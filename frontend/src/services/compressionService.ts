import { API_BASE_URL } from '@/lib/api-config';
import { uploadFileMetadata } from './fileService';

export async function compressFiles(files: File[], compressionLevel: number): Promise<Blob> {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));
  formData.append("compression_level", compressionLevel.toString());
  
  const endpoint = `${API_BASE_URL}/files/compress-files`;

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
    
    // Log metadata for each file
    const originalSize = files.reduce((acc, file) => acc + file.size, 0);
    await uploadFileMetadata({
        filename: files.length > 1 ? "archivos_comprimidos.zip" : files[0].name,
        fileType: files.length > 1 ? 'zip' : files[0].type,
        size: originalSize,
        status: "COMPLETED",
    });

    return blob;
  } catch (error) {
    console.error("Failed to fetch from compression service:", error);
    if (error instanceof Error) {
       throw new Error(`Error al conectar con el servicio de compresión: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido al comprimir los archivos.");
  }
}
