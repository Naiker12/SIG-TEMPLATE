from pydantic import BaseModel, EmailStr, ConfigDict, Field, HttpUrl
from typing import Optional, List, Any, Dict, Literal
from datetime import datetime

# --- Esquemas Base ---
class Role(BaseModel):
    name: str
    model_config = ConfigDict(from_attributes=True)

class UserBase(BaseModel):
    email: EmailStr
    name: str

# --- Esquemas de Usuario ---
class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    role: Role
    bio: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)
    
class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None

# --- Esquemas de Autenticación y Seguridad ---
class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Esquemas de Archivos (Herramientas Legadas) ---
class FileBase(BaseModel):
    filename: str
    fileType: str
    size: int
    status: str

class FileCreate(FileBase):
    pass

class File(FileBase):
    id: str
    createdAt: datetime
    userId: str
    model_config = ConfigDict(from_attributes=True)

# --- Esquemas para Nuevos Flujos de Análisis ---

# Metadatos de un archivo subido
class FileMetadata(BaseModel):
    id: str
    filename: str
    filetype: str
    columns: List[str]
    rows_count: int
    size: int
    uploadedAt: datetime
    userId: str
    model_config = ConfigDict(from_attributes=True)

# Respuesta del endpoint de subida de archivo
class UploadResponse(BaseModel):
    message: str
    file_metadata: FileMetadata

# Respuesta del endpoint de análisis
class AnalysisResult(BaseModel):
    columns: List[str] = Field(..., description="Lista de todas las columnas en el archivo.")
    numerical_columns: List[str] = Field(..., description="Columnas que contienen datos numéricos.")
    categorical_columns: List[str] = Field(..., description="Columnas que contienen datos categóricos.")
    total_rows: int = Field(..., description="Número total de filas.")
    basic_stats: Dict[str, Dict[str, Any]] = Field(..., description="Estadísticas descriptivas para columnas numéricas.")
    sample_data: List[Dict[str, Any]] = Field(..., description="Una muestra de las primeras 100 filas de datos.")
    
# Creación de un Proyecto de Análisis
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    fileId: str
    config: Dict[str, Any]

# Proyecto de Análisis (Respuesta)
class Project(ProjectCreate):
    id: str
    userId: str
    createdAt: datetime
    updatedAt: datetime
    model_config = ConfigDict(from_attributes=True)


# --- Esquemas de Excel (Herramienta Legada) ---
class DuplicateRowPayload(BaseModel):
    file_id: str
    row_id: int
    count: int

# --- Esquemas para API Personalizada ---
class CustomApiRequest(BaseModel):
    url: HttpUrl = Field(..., description="La URL del endpoint de la API externa a la que se va a llamar.")
    method: Literal['GET', 'POST', 'PUT', 'DELETE'] = Field(..., description="El método HTTP a utilizar para la petición.")
    headers: Optional[Dict[str, str]] = Field(None, description="Cabeceras opcionales para la petición (ej. 'Authorization').")
    body: Optional[Dict[str, Any]] = Field(None, description="Cuerpo opcional de la petición en formato JSON (para POST, PUT).")
