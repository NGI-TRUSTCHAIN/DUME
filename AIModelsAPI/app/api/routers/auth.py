from datetime import datetime
from os import path as op
from typing import Annotated

from colorama import Fore
from fastapi import APIRouter, Depends, status, Response

from api import config
from api.cached_settings import get_directory_settings
from jwt.handler import create_access_token
from custom_models.prototypes import UserCredentials
from utils_lib.rw_files import read_json_file

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
    dependencies=[],
    responses={404: {"description": "Not found"}},
)


@router.post("/jwt", status_code=status.HTTP_202_ACCEPTED)
def get_files_token(response: Response, credentials: UserCredentials,
                    settings: Annotated[config.DirectorySettings, Depends(get_directory_settings)]):
    # get users allowed to access files
    root_directory = settings.root_directory
    print(root_directory)
    try:
        users_allowed = read_json_file(op.join(root_directory, 'resources/keys/Access_Keys.json'))

        # check if the credential id is registed
        access_id_index = next((index for (index, d) in enumerate(users_allowed['allowed']) if
                                d["accessId"] == credentials.access_id), None)

        if access_id_index is None:
            response.status_code = status.HTTP_406_NOT_ACCEPTABLE
            print(Fore.RED + "Someone try to access to token without permission")
            print(Fore.RESET)
            return {"Message": "Not Valid Credentials"}

        if users_allowed["allowed"][access_id_index]["accessSecretKey"] != credentials.access_key:
            response.status_code = status.HTTP_406_NOT_ACCEPTABLE
            print(Fore.RED + "Someone try to access to token without permission")
            print(Fore.RESET)
            return {"Message": "Not Valid Credentials"}

        access_token = create_access_token(data={"sub": users_allowed["allowed"][access_id_index]["username"]})
        print(
            Fore.GREEN + f'{users_allowed["allowed"][access_id_index]["username"]} requested token at {datetime.now()} to '
                         f'files access')
        print(Fore.RESET)
        return {'token_type': 'bearer', 'access_token': access_token}

    except FileNotFoundError:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        print(Fore.RED + "File not found: Access_Keys.json")
        return {"Message": "Internal Server Error: File not found"}
