
export async function compressFiles(files: File[]): Promise<Blob> {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const res = await fetch(`${apiUrl}/files/compress-files`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    // Intentar leer el error del backend para dar más contexto
    const errorBody = await res.text();
    console.error("Error del backend:", errorBody);
    throw new Error(`Error al optimizar archivos: ${res.statusText}`);
  }

  return await res.blob();
}
