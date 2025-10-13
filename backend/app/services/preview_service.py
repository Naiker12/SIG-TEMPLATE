
import base64
from io import BytesIO
from fastapi import UploadFile
import pypdfium2 as pdfium

async def create_pdf_preview(file: UploadFile, page_number: int = 1) -> str:
    """
    Convierte una página específica de un PDF a una imagen PNG y la codifica en base64.
    """
    pdf_bytes = await file.read()
    await file.seek(0) # Reset file pointer in case it's used again

    try:
        pdf = pdfium.PdfDocument(BytesIO(pdf_bytes))
        
        # page_number is 1-based, pdfium index is 0-based
        page_index = page_number - 1
        if not (0 <= page_index < len(pdf)):
            raise ValueError(f"Número de página inválido: {page_number}. El PDF tiene {len(pdf)} páginas.")

        page = pdf[page_index]
        bitmap = page.render(scale=1.5)
        image = bitmap.to_pil()

        img_buffer = BytesIO()
        image.save(img_buffer, format="PNG")
        img_buffer.seek(0)

        base64_encoded = base64.b64encode(img_buffer.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{base64_encoded}"

    except Exception as e:
        print(f"Error al generar la previsualización del PDF: {e}")
        raise e


async def count_pdf_pages(file: UploadFile) -> int:
    """
    Calcula el número de páginas en un PDF.
    """
    pdf_bytes = await file.read()
    await file.seek(0) # Reset file pointer

    try:
        pdf = pdfium.PdfDocument(BytesIO(pdf_bytes))
        return len(pdf)
    except Exception as e:
        print(f"Error al contar las páginas del PDF: {e}")
        raise e
