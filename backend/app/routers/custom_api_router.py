# backend/app/routers/custom_api_router.py

from fastapi import APIRouter, Depends, HTTPException, status
from app.services.auth_service import get_current_user
from app.services import custom_api_service
from app import schemas
from typing import Any

custom_api_router = APIRouter(
    prefix="/custom-api",
    tags=["Custom API"]
)

@custom_api_router.post(
    "/proxy",
    summary="Realiza una petición a una API externa de forma segura"
)
async def proxy_external_api_request(
    request_data: schemas.CustomApiRequest,
    current_user: schemas.User = Depends(get_current_user)
) -> Any:
    """
    Este endpoint actúa como un proxy seguro para realizar peticiones a APIs externas.
    Previene problemas de CORS en el frontend y permite un futuro manejo de claves de API
    de forma segura en el backend.

    - **url**: La URL completa del endpoint externo.
    - **method**: Método HTTP (GET, POST, PUT, DELETE).
    - **headers**: Diccionario opcional de cabeceras.
    - **body**: Cuerpo opcional de la petición en formato JSON.

    Requiere autenticación de usuario. Devuelve directamente la respuesta de la API externa.
    """
    try:
        # El servicio ahora devuelve directamente los datos o lanza una excepción.
        response_data = await custom_api_service.make_request(
            url=str(request_data.url),
            method=request_data.method,
            headers=request_data.headers,
            json_body=request_data.body
        )
        return response_data
    except HTTPException as e:
        # Re-lanzar las excepciones HTTP que el servicio ya ha preparado.
        raise e
    except Exception as e:
        # Capturar cualquier otro error inesperado.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado en el proxy de la API: {e}"
        )
