from functools import lru_cache
from typing import Annotated
from os import path as op

from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer

from api import config
from api.cached_settings import get_directory_settings
from jwt.handler import decode_access_token
from custom_models.prototypes import AdminCredentials
from utils_lib.rw_files import read_json_file

oauth2_schema = OAuth2PasswordBearer(tokenUrl="token")


def get_current_user_from_token(token: str = Depends(oauth2_schema)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    return token


def is_admin(settings: Annotated[config.DirectorySettings, Depends(get_directory_settings)],
             credentials: AdminCredentials):
    root_directory = settings.root_directory
    print(root_directory)
    try:
        keys = read_json_file(op.join(root_directory, 'resources/keys/Access_Keys.json'))

        # check if the credential id is registed
        admin_credentials = keys.get("admin", {})
        if credentials.access_id == admin_credentials.get("accessId") and \
                credentials.access_key == admin_credentials.get("accessSecretKey"):
            # If credentials match the admin credentials
            print(f"Admin {admin_credentials['username']} accessed the system")
            return True

        return False

    except FileNotFoundError:
        raise FileNotFoundError
