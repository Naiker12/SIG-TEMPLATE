
import base64
from io import BytesIO
from fastapi import UploadFile
import pypdfium2 as pdfium

async def create_pdf_preview(file: UploadFile) -> str:
    """
    Convierte la primera página de un archivo PDF a una imagen PNG y la codifica en base64.
    Utiliza pypdfium2 que no tiene dependencias externas.
    """
    pdf_bytes = await file.read()
    
    try:
        # Cargar el PDF desde los bytes y renderizar la primera página
        # El índice de página es base 0, así que la primera página es [0]
        # scale=0.3 reduce la calidad para una previsualización más rápida y ligera (30% del tamaño original)
        images = pdfium.render_pdf_to_pil(pdf_bytes, page_indices=[0], scale=0.3)
        
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
