
import base64
from io import BytesIO
from fastapi import UploadFile, HTTPException
import pypdfium2 as pdfium
from docx2pdf import convert
import tempfile
import os
import shutil

async def create_pdf_preview(file: UploadFile, page_number: int = 1) -> str:
    """
    Convierte una página específica de un PDF o DOCX a una imagen PNG y la codifica en base64.
    """
    file_bytes = await file.read()
    await file.seek(0)

    temp_pdf_path = None
    pdf_source_bytes = file_bytes

    try:
        if file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            # Si es un DOCX, lo convertimos a PDF temporalmente
            with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as temp_docx:
                temp_docx.write(file_bytes)
                temp_docx_path = temp_docx.name
            
            temp_pdf_path = temp_docx_path.replace(".docx", ".pdf")
            convert(temp_docx_path, temp_pdf_path)

            with open(temp_pdf_path, "rb") as f:
                pdf_source_bytes = f.read()

        # Procesar el PDF (original o el convertido desde DOCX)
        pdf = pdfium.PdfDocument(BytesIO(pdf_source_bytes))
        
        page_index = page_number - 1
        if not (0 <= page_index < len(pdf)):
            raise ValueError(f"Número de página inválido: {page_number}. El documento tiene {len(pdf)} páginas.")

        page = pdf[page_index]
        bitmap = page.render(scale=1.5)
        image = bitmap.to_pil()

        img_buffer = BytesIO()
        image.save(img_buffer, format="PNG")
        img_buffer.seek(0)

        base64_encoded = base64.b64encode(img_buffer.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{base64_encoded}"

    except Exception as e:
        print(f"Error al generar la previsualización: {e}")
        raise e
    finally:
        # Limpieza de archivos temporales si se convirtió un DOCX
        if temp_pdf_path and os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)
        if 'temp_docx_path' in locals() and os.path.exists(temp_docx_path):
            os.remove(temp_docx_path)


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
