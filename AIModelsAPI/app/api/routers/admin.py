from typing import Annotated

from fastapi import APIRouter, Depends
from os import urandom
from os import path as op
import hashlib
import json

from api import config
from api.cached_settings import get_directory_settings
from api.dependencies import is_admin
from custom_models.prototypes import NewUser
from utils_lib.rw_files import read_json_file

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(is_admin)],
    responses={404: {"description": "Not found"}},
)


@router.post("/create-user")
def create_new_user(user: NewUser,
                    settings: Annotated[config.DirectorySettings, Depends(get_directory_settings)]):
    root_directory = settings.root_directory
    print(root_directory)
    keys_file_directory = op.join(root_directory, 'resources/keys/Access_Keys.json')
    try:
        keys_file = read_json_file(keys_file_directory)

        # generate random access id
        access_id = hashlib.md5(urandom(32)).hexdigest()[:16]

        # generate random access key
        access_key = hashlib.md5(urandom(256)).hexdigest()

        users_access = dict()

        # add new data to json file
        users_access['allowed'] = [
            {'id': len(keys_file['allowed']) + 1, 'username': user.username, 'accessId': access_id,
             'accessSecretKey': access_key}]

        keys_file['allowed'].extend(users_access['allowed'])

        with open(keys_file_directory, 'w') as json_file:
            json_file.write(json.dumps(keys_file, indent=4))
            json_file.close()

    except FileNotFoundError:
        raise FileNotFoundError
