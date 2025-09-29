from pathlib import Path
import uuid
from fastapi import UploadFile
from pypdf import PdfReader, PdfWriter

TEMP_DIR = Path("temp_files")
OUTPUT_DIR = Path("outputs")
TEMP_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

def parse_page_ranges(ranges_str: str) -> list[int]:
    """
    Parsea un string de rangos como "1-3,5,8-10" a una lista de números de página.
    Los números de página en PyPDF son base 0.
    """
    pages = set()
    parts = ranges_str.split(',')
    for part in parts:
        part = part.strip()
        if '-' in part:
            try:
                start, end = map(int, part.split('-'))
                if start > end:
                    continue # Ignorar rangos inválidos
                # Restamos 1 porque los usuarios piensan en base 1, PyPDF en base 0
                for i in range(start - 1, end):
                    pages.add(i)
            except ValueError:
                continue # Ignorar partes mal formadas
        else:
            try:
                # Restamos 1 por la misma razón
                pages.add(int(part) - 1)
            except ValueError:
                continue
    return sorted(list(pages))

async def split_pdf_service(file: UploadFile, ranges: str) -> str:
    """
    Extrae páginas de un PDF según los rangos especificados y devuelve la ruta del nuevo PDF.
    """
    # Guardar el archivo subido temporalmente
    temp_file_path = TEMP_DIR / f"{uuid.uuid4().hex}_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        
    reader = PdfReader(temp_file_path)
    writer = PdfWriter()
    
    pages_to_extract = parse_page_ranges(ranges)
    total_pages = len(reader.pages)

    for page_num in pages_to_extract:
        if 0 <= page_num < total_pages:
            writer.add_page(reader.pages[page_num])
            
    # Si no se extrajeron páginas, no crear archivo
    if len(writer.pages) == 0:
        temp_file_path.unlink() # Limpiar el archivo temporal
        raise ValueError("No se especificaron páginas válidas para extraer.")

    # Guardar el PDF resultante
    output_filename = f"split_{uuid.uuid4().hex}.pdf"
    output_path = OUTPUT_DIR / output_filename
    
    with open(output_path, "wb") as f_out:
        writer.write(f_out)
        
    # Limpiar el archivo temporal subido
    temp_file_path.unlink()
    
    return str(output_path)
