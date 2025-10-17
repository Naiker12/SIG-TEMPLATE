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

    Args:
        url (str): La URL a la que se hará la petición.
        method (str): El método HTTP (GET, POST, PUT, DELETE).
        headers (dict, optional): Cabeceras de la petición.
        json_body (dict, optional): Cuerpo de la petición en formato JSON.

    Returns:
        Los datos de la respuesta de la API externa, parseados como JSON.

    Raises:
        HTTPException: Si la petición falla o la respuesta no es un JSON válido.
    """
    try:
        # Prepara los argumentos de la petición
        request_args = {
            "method": method,
            "url": url,
            "headers": headers,
        }
        # Incluye el cuerpo solo para los métodos que lo admiten
        if method in ['POST', 'PUT'] and json_body:
            request_args["json"] = json_body
        
        response = await async_client.request(**request_args)

        # Lanza una excepción para códigos de error (4xx o 5xx)
        response.raise_for_status()

        # Intenta parsear la respuesta como JSON
        # Si la respuesta está vacía (ej. 204 No Content), devuelve None.
        if not response.content:
            return None
            
        return response.json()

    except httpx.HTTPStatusError as exc:
        # El servidor respondió con un código de error (4xx, 5xx)
        # Intentamos devolver el detalle del error que proporciona la API externa.
        try:
            error_details = exc.response.json()
        except Exception:
            error_details = {"detail": exc.response.text or "Error sin detalles."}
        
        raise HTTPException(
            status_code=exc.response.status_code,
            detail=error_details,
        )
    except httpx.RequestError as exc:
        # Errores de red, DNS, timeouts, etc.
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error de red al intentar contactar la API: {exc}",
        )
    except Exception as exc:
        # Cualquier otro error inesperado, como un JSON mal formado en la respuesta.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ocurrió un error inesperado al procesar la respuesta: {exc}"
        )

