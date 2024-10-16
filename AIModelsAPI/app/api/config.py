from os import path as op

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import ClassVar


class SolidCredentials(BaseSettings):
    username: str = ""
    password: str = ""
    webId: str = ""

    root_directory: ClassVar[str] = op.dirname(op.dirname(op.abspath(__file__)))

    env_file_directory: ClassVar[str] = op.join(root_directory, ".env")

    model_config = SettingsConfigDict(env_file=env_file_directory,
                                      env_prefix='SOLID_')


class DirectorySettings(BaseSettings):
    root_directory: str = op.dirname(op.dirname(op.abspath(__file__)))


class ModelWeightsDirectorySettings(BaseSettings):
    root_directory: ClassVar[str] = op.dirname(op.dirname(op.abspath(__file__)))
    weights_directory: str = op.join(root_directory, 'resources/ai-models/latest_yolov7/yolov7_e6e_8classes.pt')
