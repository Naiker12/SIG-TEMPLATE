import zipfile
from pathlib import Path
import shutil
import uuid
import os
from fastapi import UploadFile
from typing import Tuple, List
from docx2pdf import convert as convert_docx
from PIL import Image

# Rutas según la estructura del proyecto
TEMP_DIR = Path("temp_files")
OUTPUT_DIR = Path("outputs")

# Asegurarse de que las carpetas existan
TEMP_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

async def save_uploaded_file(file: UploadFile, directory: Path) -> Path:
    """Guarda un archivo subido en un directorio específico."""
    file_path = directory / file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return file_path

async def convert_files_to_pdf_service(files: List[UploadFile]) -> Tuple[str, str]:
    """
    Convierte una lista de archivos (DOCX, imágenes) a PDF y los empaqueta en un ZIP.
    """
    session_id = str(uuid.uuid4())
    temp_folder = TEMP_DIR / session_id
    temp_folder.mkdir()

    pdf_files = []

    for file in files:
        original_path = await save_uploaded_file(file, temp_folder)
        output_pdf_path = temp_folder / f"{original_path.stem}.pdf"

        if original_path.suffix.lower() == '.docx':
            try:
                convert_docx(str(original_path), str(output_pdf_path))
                pdf_files.append(output_pdf_path)
            except Exception as e:
                print(f"Error converting DOCX {original_path.name}: {e}")
                # Opcional: manejar el error, por ahora lo omitimos de la salida
                continue
        
        elif original_path.suffix.lower() in ['.jpg', '.jpeg', '.png']:
            try:
                image = Image.open(original_path)
                # Asegurarse de que la imagen no tenga canal alfa para guardar como PDF
                if image.mode == 'RGBA':
                    image = image.convert('RGB')
                image.save(output_pdf_path, "PDF", resolution=100.0)
                pdf_files.append(output_pdf_path)
            except Exception as e:
                print(f"Error converting image {original_path.name}: {e}")
                continue
        
        # Eliminar el archivo original después de la conversión
        os.remove(original_path)


    # Crear el archivo ZIP final con los PDFs generados
    zip_filename = f"convertidos_{session_id}.zip"
    zip_path = OUTPUT_DIR / zip_filename

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for pdf_path in pdf_files:
            if pdf_path.exists():
                zipf.write(pdf_path, arcname=pdf_path.name)

    return str(zip_path), str(temp_folder)
