import base64
from io import BytesIO
from fastapi import UploadFile
import pypdfium2 as pdfium

async def create_pdf_preview(file: UploadFile) -> str:
    """
    Convierte la primera página de un archivo PDF a una imagen PNG y la codifica en base64.
    Compatible con pypdfium2 >= 4.30.0
    """
    pdf_bytes = await file.read()

    try:
        # Cargar el PDF desde memoria
        pdf = pdfium.PdfDocument(BytesIO(pdf_bytes))

        # Obtener la primera página
        page = pdf[0]

        # Renderizar la página (scale ajusta resolución)
        bitmap = page.render(scale=1.5)
        image = bitmap.to_pil()  # convierte a imagen PIL (Pillow)

        # Guardar la imagen en un buffer
        img_buffer = BytesIO()
        image.save(img_buffer, format="PNG")
        img_buffer.seek(0)

        # Codificar a base64
        base64_encoded = base64.b64encode(img_buffer.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{base64_encoded}"

    except Exception as e:
        print(f"Error al generar la previsualización del PDF: {e}")
        raise e
