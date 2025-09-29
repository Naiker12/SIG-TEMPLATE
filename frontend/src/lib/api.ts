export async function compressFiles(files: File[]): Promise<Blob> {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/compress-files`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Error al optimizar archivos");
  }

  return await res.blob();
}
