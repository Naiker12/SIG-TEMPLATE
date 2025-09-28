import zipfile
from pathlib import Path
import shutil
import uuid
from fastapi import UploadFile

# Rutas según la estructura del proyecto
UPLOAD_DIR = Path("uploads")
TEMP_DIR = Path("temp_files")
OUTPUT_DIR = Path("outputs")

# Crear carpetas si no existen
for folder in [UPLOAD_DIR, TEMP_DIR, OUTPUT_DIR]:
    folder.mkdir(exist_ok=True)

async def compress_files(files: list[UploadFile]) -> str:
    """
    Guarda los archivos subidos temporalmente y los comprime en un ZIP.
    Devuelve la ruta del archivo ZIP.
    """
    temp_folder = TEMP_DIR / str(uuid.uuid4())
    temp_folder.mkdir()

    try:
        # Guardar archivos subidos temporalmente
        for file in files:
            file_path = temp_folder / file.filename
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)

        # Crear ZIP final en outputs
        zip_filename = f"archivos_comprimidos_{uuid.uuid4().hex}.zip"
        zip_path = OUTPUT_DIR / zip_filename

        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for file_path in temp_folder.iterdir():
                zipf.write(file_path, arcname=file_path.name)

        return str(zip_path)

    finally:
        # Limpiar archivos temporales
        shutil.rmtree(temp_folder, ignore_errors=True)
