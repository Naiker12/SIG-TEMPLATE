import base64
from io import BytesIO
from fastapi import UploadFile, HTTPException
import pypdfium2 as pdfium
from docx2pdf import convert
import tempfile
import os
import shutil
import subprocess

async def create_pdf_preview(file: UploadFile, page_number: int = 1) -> str:
    """
    Convierte una página específica de un PDF o DOCX a una imagen PNG y la codifica en base64.
    Compatible con PDF y DOCX.
    """
    file_bytes = await file.read()
    await file.seek(0)

    temp_pdf_path = None
    temp_docx_path = None
    pdf_source_bytes = file_bytes

    try:
        # Si el archivo es un Word (DOCX)
        if file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as temp_docx:
                temp_docx.write(file_bytes)
                temp_docx_path = temp_docx.name

            temp_pdf_path = temp_docx_path.replace(".docx", ".pdf")

            try:
                convert(temp_docx_path, temp_pdf_path)
            except Exception as e:
                # En Linux o servidores sin Word, puede fallar la conversión
                raise HTTPException(
                    status_code=500,
                    detail=f"No se pudo convertir el archivo DOCX a PDF. Asegúrate de ejecutar en Windows/macOS o instalar LibreOffice. Error: {e}"
                )

            # Leer el PDF convertido
            with open(temp_pdf_path, "rb") as f:
                pdf_source_bytes = f.read()

        # Procesar el PDF (original o convertido)
        pdf = pdfium.PdfDocument(BytesIO(pdf_source_bytes))

        if len(pdf) == 0:
            raise HTTPException(status_code=400, detail="El archivo PDF está vacío o corrupto.")

        page_index = page_number - 1
        if not (0 <= page_index < len(pdf)):
            raise HTTPException(
                status_code=400,
                detail=f"Número de página inválido ({page_number}). El documento tiene {len(pdf)} páginas."
            )

        # Renderizar la página a imagen
        page = pdf[page_index]
        bitmap = page.render(scale=1.5)
        image = bitmap.to_pil()

        # Convertir a base64
        img_buffer = BytesIO()
        image.save(img_buffer, format="PNG")
        base64_encoded = base64.b64encode(img_buffer.getvalue()).decode("utf-8")

        return f"data:image/png;base64,{base64_encoded}"

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error al generar la previsualización: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

    finally:
        # Limpieza de archivos temporales
        for path in [temp_pdf_path, temp_docx_path]:
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                except Exception:
                    pass


async def count_pdf_pages(file: UploadFile) -> int:
    """
    Calcula el número de páginas en un PDF.
    """
    pdf_bytes = await file.read()
    await file.seek(0)

    try:
        pdf = pdfium.PdfDocument(BytesIO(pdf_bytes))
        return len(pdf)
    except Exception as e:
        print(f"Error al contar las páginas del PDF: {e}")
        raise HTTPException(status_code=500, detail=f"No se pudo contar las páginas del PDF: {e}")
