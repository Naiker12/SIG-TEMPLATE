
import base64
from io import BytesIO
from fastapi import UploadFile
from pdf2image import convert_from_bytes

async def create_pdf_preview(file: UploadFile) -> str:
    """
    Convierte la primera página de un archivo PDF a una imagen PNG y la codifica en base64.
    """
    pdf_bytes = await file.read()
    
    try:
        # Convertir la primera página del PDF a una imagen
        # dpi=72 reduce la calidad para una previsualización más rápida y ligera
        images = convert_from_bytes(pdf_bytes, first_page=1, last_page=1, fmt='png', dpi=72)
        
        if not images:
            raise ValueError("No se pudo extraer ninguna página del PDF.")
            
        # Guardar la imagen en un buffer en memoria
        img_byte_arr = BytesIO()
        images[0].save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        # Codificar a base64
        base64_encoded_image = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')
        
        return f"data:image/png;base64,{base64_encoded_image}"

    except Exception as e:
        print(f"Error al generar la previsualización del PDF: {e}")
        raise e

