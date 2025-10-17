# backend/app/services/custom_api_service.py

import httpx
from fastapi import HTTPException, status
from typing import Any, Dict, Optional, Literal

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
        # Prepara los argumentos para la petición
        request_args: Dict[str, Any] = {"method": method, "url": url}
        if headers:
            request_args["headers"] = headers
        
        # Añade el cuerpo solo para los métodos que lo permiten y si se ha proporcionado
        if method in ['POST', 'PUT'] and json_body:
            request_args["json"] = json_body
        
        response = await async_client.request(**request_args)
        
        # Lanza una excepción para respuestas de error (4xx, 5xx)
        response.raise_for_status()

        # Si no hay contenido, devuelve None (p. ej. para un status 204)
        if not response.content:
            return None
            
        # Devuelve el contenido JSON
        return response.json()

    except httpx.HTTPStatusError as exc:
        # Intenta obtener detalles del error desde el cuerpo de la respuesta
        try:
            error_details = exc.response.json()
        except Exception:
            error_details = {"detail": exc.response.text or "Error sin detalles."}
        raise HTTPException(status_code=exc.response.status_code, detail=error_details)
    except httpx.RequestError as exc:
        # Errores de red (DNS, conexión rechazada, etc.)
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Error de red al contactar la API: {exc}")
    except Exception as exc:
        # Otros errores inesperados
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado al procesar la respuesta: {exc}")
