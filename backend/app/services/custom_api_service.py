# backend/app/services/custom_api_service.py

import httpx
from fastapi import HTTPException, status
from typing import Any, Dict, Optional, Literal
from app import schemas

# Usar un cliente asíncrono para mejor rendimiento con FastAPI
async_client = httpx.AsyncClient(timeout=15.0)

async def make_request(
    url: str,
    method: Literal['GET', 'POST', 'PUT', 'DELETE'],
    headers: Optional[Dict[str, str]] = None,
    json_body: Optional[Dict[str, Any]] = None
) -> schemas.CustomApiResponse:
    """
    Realiza una petición HTTP a una URL externa usando httpx.

    Args:
        url (str): La URL a la que se hará la petición.
        method (str): El método HTTP (GET, POST, PUT, DELETE).
        headers (dict, optional): Cabeceras de la petición.
        json_body (dict, optional): Cuerpo de la petición en formato JSON.

    Returns:
        schemas.CustomApiResponse: Un objeto con el status_code y los datos de la respuesta.

    Raises:
        HTTPException: Si la petición falla o la respuesta no es un JSON válido.
    """
    try:
        response = await async_client.request(
            method=method,
            url=url,
            headers=headers,
            json=json_body,
        )

        # Intenta parsear la respuesta como JSON
        try:
            response_data = response.json()
        except Exception:
            # Si no es un JSON válido, pero la petición fue exitosa (ej. 204 No Content),
            # devuelve un cuerpo vacío. Si fue un error, usa el texto de la respuesta.
            if response.is_success:
                response_data = None
            else:
                response_data = {"error_details": response.text}
        
        # Devuelve la respuesta en el formato esperado por el frontend
        return schemas.CustomApiResponse(
            status_code=response.status_code,
            data=response_data,
        )

    except httpx.RequestError as exc:
        # Errores de red, DNS, timeouts, etc.
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error de red al intentar contactar la API: {exc}",
        )
    except Exception as exc:
        # Cualquier otro error inesperado.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ocurrió un error inesperado: {exc}"
        )
