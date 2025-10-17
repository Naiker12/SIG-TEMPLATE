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
    summary="Realiza una petición a una API externa y guarda el resultado temporalmente"
)
async def proxy_external_api_request(
    request_data: schemas.CustomApiRequest,
    current_user: schemas.User = Depends(get_current_user)
) -> Any:
    """
    Este endpoint actúa como un proxy seguro para realizar peticiones a APIs externas.
    Al recibir una respuesta exitosa, la guarda en una tabla temporal asociada al usuario.

    - **url**: La URL completa del endpoint externo.
    - **method**: Método HTTP (GET, POST, PUT, DELETE).
    - **headers**: Diccionario opcional de cabeceras.
    - **body**: Cuerpo opcional de la petición en formato JSON.

    Requiere autenticación. Devuelve directamente la respuesta de la API externa para visualización inmediata.
    """
    try:
        response_data = await custom_api_service.make_request(
            url=str(request_data.url),
            method=request_data.method,
            headers=request_data.headers,
            json_body=request_data.body
        )
        
        # Si la petición fue exitosa, guardar los datos en la tabla temporal.
        await custom_api_service.save_temp_api_data(
            user_id=current_user.id,
            api_url=str(request_data.url),
            response_data=response_data
        )

        return response_data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado en el proxy de la API: {e}"
        )

@custom_api_router.get(
    "/latest",
    response_model=schemas.TempApiData,
    summary="Obtiene el último resultado de API guardado para el usuario"
)
async def get_latest_api_data(
    current_user: schemas.User = Depends(get_current_user)
):
    """
    Recupera el conjunto de datos más reciente guardado por el usuario
    desde la tabla temporal `TempApiData`. Útil para funciones de descarga.
    """
    latest_data = await custom_api_service.get_latest_temp_api_data(current_user.id)
    if not latest_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron datos de API recientes.")
    return latest_data

@custom_api_router.delete(
    "/clear",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Limpia los datos temporales de API para el usuario"
)
async def clear_user_temp_data(
    current_user: schemas.User = Depends(get_current_user)
):
    """
    Elimina todos los registros de `TempApiData` para el usuario autenticado.
    Se recomienda llamar a este endpoint después de que el usuario descargue los datos.
    """
    await custom_api_service.clear_temp_api_data(current_user.id)
    return
