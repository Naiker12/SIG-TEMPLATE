from pathlib import Path
import uuid
import shutil
import os
import zipfile
from fastapi import UploadFile
from typing import List, Tuple
from pdf2docx import Converter

TEMP_DIR = Path("temp_files")
OUTPUT_DIR = Path("outputs")
TEMP_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

async def convert_pdfs_to_word_service(files: List[UploadFile]) -> Tuple[str, str, bool]:
    """
    Convierte archivos PDF a DOCX. Si es uno, devuelve el DOCX. Si son varios, un ZIP.
    Retorna: (ruta_resultado, ruta_temporal, es_zip)
    """
    session_id = str(uuid.uuid4())
    temp_folder = TEMP_DIR / session_id
    temp_folder.mkdir()

    processed_files = []
    
    # Guardar todos los archivos subidos
    for file in files:
        if file.filename and file.filename.lower().endswith('.pdf'):
            file_path = temp_folder / file.filename
            with open(file_path, "wb") as f:
                shutil.copyfileobj(file.file, f)
            processed_files.append(file_path)

    if not processed_files:
        shutil.rmtree(temp_folder)
        raise ValueError("No se proporcionaron archivos PDF válidos.")

    if len(processed_files) == 1:
        pdf_path = processed_files[0]
        docx_path = OUTPUT_DIR / f"{pdf_path.stem}.docx"
        
        try:
            cv = Converter(str(pdf_path))
            cv.convert(str(docx_path), start=0, end=None)
            cv.close()
        except Exception as e:
            shutil.rmtree(temp_folder)
            raise ValueError(f"Error al convertir el archivo {pdf_path.name}: {e}")

        shutil.rmtree(temp_folder)
        return str(docx_path), "", False
    else:
        docx_files_in_temp = []
        for pdf_path in processed_files:
            docx_path_temp = temp_folder / f"{pdf_path.stem}.docx"
            try:
                cv = Converter(str(pdf_path))
                cv.convert(str(docx_path_temp), start=0, end=None)
                cv.close()
                docx_files_in_temp.append(docx_path_temp)
            except Exception as e:
                print(f"Omitiendo archivo {pdf_path.name} por error de conversión: {e}")
                continue # Omitir archivo si falla la conversión
        
        zip_filename = f"convertidos_word_{session_id}.zip"
        zip_path = OUTPUT_DIR / zip_filename

        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for docx_path in docx_files_in_temp:
                if docx_path.exists():
                    zipf.write(docx_path, arcname=docx_path.name)
        
        return str(zip_path), str(temp_folder), True
