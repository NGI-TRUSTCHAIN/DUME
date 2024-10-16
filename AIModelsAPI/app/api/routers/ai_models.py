from typing import Annotated

import torch
from fastapi import APIRouter, Depends, HTTPException
from functools import lru_cache

from api import config
from api.cached_settings import load_yolov7_model, get_solid_credentials
from api.dependencies import get_current_user_from_token
from ai_manager.inference_yolov7_multiple import inference_images, authenticate_solid_account

router = APIRouter(
    prefix="/ai-models",
    tags=["AIModels"],
    # dependencies=[Depends(get_current_user_from_token)],
    responses={404: {"description": "Not found"}},
)

fake_items_db = {"plumbus": {"name": "Plumbus"}, "gun": {"name": "Portal Gun"}}


@router.get("/")
async def read_items():
    return fake_items_db


@router.post("/run-inference")
async def run_ai_inference(model: Annotated[torch.nn.Module, Depends(load_yolov7_model)],
                           credentials: Annotated[config.SolidCredentials, Depends(get_solid_credentials)]):
    try:
        await inference_images(model, credentials)
        return fake_items_db
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
