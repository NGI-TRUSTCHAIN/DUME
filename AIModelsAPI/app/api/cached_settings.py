from functools import lru_cache
from typing import Annotated

import torch
from fastapi import Depends

from api import config


@lru_cache
def get_directory_settings():
    return config.DirectorySettings()

@lru_cache
def load_yolov7_model():
    weights = config.ModelWeightsDirectorySettings().weights_directory
    model = torch.hub.load('WongKinYiu/yolov7', 'custom', weights,
                           force_reload=True, trust_repo=True)
    return model


@lru_cache
def get_solid_credentials():
    return config.SolidCredentials()
