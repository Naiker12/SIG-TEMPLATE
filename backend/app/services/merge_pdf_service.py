from pathlib import Path
import uuid
import shutil
from fastapi import UploadFile
from pypdf import PdfWriter
from typing import List, Tuple

TEMP_DIR = Path("temp_files")
OUTPUT_DIR = Path("outputs")
TEMP_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

async def merge_pdfs_service(files: List[UploadFile]) -> Tuple[str, str]:
    """
    Une una lista de archivos PDF en uno solo.
    Devuelve la ruta del archivo unido y la de la carpeta temporal.
    """
    temp_folder = TEMP_DIR / str(uuid.uuid4())
    temp_folder.mkdir()
    
    merger = PdfWriter()
    
    for file in files:
        file_path = temp_folder / file.filename
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        try:
            merger.append(str(file_path))
        except Exception as e:
            # Si un archivo no es un PDF válido, lo omitimos y continuamos
            print(f"Error al procesar el archivo {file.filename}: {e}")
            continue

    if len(merger.pages) == 0:
        shutil.rmtree(temp_folder)
        raise ValueError("No se proporcionaron archivos PDF válidos para unir.")

    output_filename = f"merged_{uuid.uuid4().hex}.pdf"
    output_path = OUTPUT_DIR / output_filename

    with open(output_path, "wb") as f_out:
        merger.write(f_out)
        
    merger.close()

    return str(output_path), str(temp_folder)
