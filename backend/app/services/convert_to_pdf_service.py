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

def cleanup_temp_folder(path: str):
    """Elimina un directorio de forma segura."""
    if os.path.isdir(path):
        shutil.rmtree(path)

async def save_uploaded_file(file: UploadFile, directory: Path) -> Path:
    """Guarda un archivo subido en un directorio específico."""
    file_path = directory / file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return file_path

async def convert_file_to_pdf(original_path: Path, output_pdf_path: Path):
    """Convierte un único archivo (DOCX o imagen) a PDF."""
    if original_path.suffix.lower() == '.docx':
        try:
            convert_docx(str(original_path), str(output_pdf_path))
        except Exception as e:
            print(f"Error converting DOCX {original_path.name}: {e}")
            raise ValueError(f"No se pudo convertir el archivo {original_path.name}.")

    elif original_path.suffix.lower() in ['.jpg', '.jpeg', '.png']:
        try:
            image = Image.open(original_path)
            if image.mode == 'RGBA':
                image = image.convert('RGB')
            image.save(output_pdf_path, "PDF", resolution=100.0)
        except Exception as e:
            print(f"Error converting image {original_path.name}: {e}")
            raise ValueError(f"No se pudo convertir la imagen {original_path.name}.")
    else:
        raise ValueError(f"Formato de archivo no soportado: {original_path.suffix}")

async def convert_files_to_pdf_service(files: List[UploadFile]) -> Tuple[str, str, bool]:
    """
    Convierte archivos a PDF. Si es uno, devuelve el PDF. Si son varios, un ZIP.
    Retorna: (ruta_resultado, ruta_temporal, es_zip)
    """
    session_id = str(uuid.uuid4())
    temp_folder = TEMP_DIR / session_id
    temp_folder.mkdir()

    if len(files) == 1:
        file = files[0]
        original_path = await save_uploaded_file(file, temp_folder)
        output_pdf_path = OUTPUT_DIR / f"{session_id}_{original_path.stem}.pdf"
        
        await convert_file_to_pdf(original_path, output_pdf_path)
        
        # No se necesita la carpeta temporal si es un solo archivo
        shutil.rmtree(temp_folder)
        
        return str(output_pdf_path), str(temp_folder), False

    else: # Múltiples archivos, se empaquetan en ZIP
        pdf_files = []
        for file in files:
            original_path = await save_uploaded_file(file, temp_folder)
            output_pdf_path = temp_folder / f"{original_path.stem}.pdf"
            try:
                await convert_file_to_pdf(original_path, output_pdf_path)
                pdf_files.append(output_pdf_path)
            except ValueError as e:
                print(e) # Opcional: registrar que un archivo fue omitido
            finally:
                if original_path.exists():
                    os.remove(original_path)
        
        zip_filename = f"convertidos_{session_id}.zip"
        zip_path = OUTPUT_DIR / zip_filename

        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for pdf_path in pdf_files:
                if pdf_path.exists():
                    zipf.write(pdf_path, arcname=pdf_path.name)
        
        return str(zip_path), str(temp_folder), True
