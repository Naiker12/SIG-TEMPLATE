# backend/app/services/custom_api_service.py

import httpx
from fastapi import HTTPException, status
from typing import Any, Dict, Optional, Literal
from datetime import datetime, timedelta
from db.database import prisma
from app import schemas

# Usar un cliente asíncrono para mejor rendimiento con FastAPI
async_client = httpx.AsyncClient(timeout=15.0)

async def make_request(
    url: str,
    method: Literal['GET', 'POST', 'PUT', 'DELETE'],
    headers: Optional[Dict[str, str]] = None,
    json_body: Optional[Dict[str, Any]] = None
) -> Any:
    """
    Realiza una petición HTTP a una URL externa usando httpx.
    Devuelve directamente los datos de la respuesta JSON o lanza una excepción.
    """
    try:
        request_args = {"method": method, "url": url, "headers": headers}
        if method in ['POST', 'PUT'] and json_body:
            request_args["json"] = json_body
        
        response = await async_client.request(**request_args)
        response.raise_for_status()

        if not response.content:
            return None
            
        return response.json()

    except httpx.HTTPStatusError as exc:
        try:
            error_details = exc.response.json()
        except Exception:
            error_details = {"detail": exc.response.text or "Error sin detalles."}
        raise HTTPException(status_code=exc.response.status_code, detail=error_details)
    except httpx.RequestError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Error de red al contactar la API: {exc}")
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado al procesar la respuesta: {exc}")

async def save_temp_api_data(user_id: str, api_url: str, response_data: Any) -> schemas.TempApiData:
    """
    Guarda la respuesta de la API en la tabla temporal `TempApiData`.
    """
    # Define la expiración para 30 minutos a partir de ahora
    expires_at = datetime.utcnow() + timedelta(minutes=30)
    
    # Primero, limpia los datos viejos para este usuario para mantener solo el último resultado.
    await prisma.tempapidata.delete_many(where={"userId": user_id})

    new_temp_data = await prisma.tempapidata.create(
        data={
            "userId": user_id,
            "apiUrl": api_url,
            "responseData": response_data,
            "expiresAt": expires_at
        }
    )
    return schemas.TempApiData.model_validate(new_temp_data)

async def get_latest_temp_api_data(user_id: str) -> Optional[schemas.TempApiData]:
    """
    Obtiene el último registro de datos temporales para un usuario.
    """

    latest_data = await prisma.tempapidata.find_first(
        where={"userId": user_id},
        order={"createdAt": "desc"}
    )
    if not latest_data:
        return None
    
    return schemas.TempApiData.model_validate(latest_data)

async def clear_temp_api_data(user_id: str):
    """
    Elimina todos los datos temporales para un usuario.
    """
    await prisma.tempapidata.delete_many(where={"userId": user_id})
