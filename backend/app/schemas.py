from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime

# --- Role Schemas ---
class Role(BaseModel):
    name: str
    
    model_config = ConfigDict(from_attributes=True)

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    name: str

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

# --- File Schemas ---
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

# --- Password Schemas ---
class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
