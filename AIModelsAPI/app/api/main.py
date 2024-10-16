from functools import lru_cache
from typing import Annotated

import uvicorn
from fastapi import FastAPI, Depends

from api import config
from routers import users, ai_models, auth, admin

app = FastAPI()

app.include_router(ai_models.router)
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}


@lru_cache
def get_settings():
    return config.SolidCredentials()


@app.get("/info")
async def info(settings: Annotated[config.SolidCredentials, Depends(get_settings)]):
    return {
        "settings": settings
    }


# limiter = Limiter(key_func=get_remote_address)
# # app = FastAPI(docs_url=None, redoc_url=None)
# app = FastAPI(root_path='/server/api')  # for docs page behind proxy
# app.state.limiter = limiter
# app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000", "https://roadtorecovery.logimade.com"],  # Your Next.js app's origin
#     allow_credentials=True,
#     allow_methods=["*"],  # Allows all HTTP methods
#     allow_headers=["*"],  # Allows all headers
# )
#
# oauth2_schema = OAuth2PasswordBearer(tokenUrl="token")
#
#
# @app.get("/test/", status_code=status.HTTP_201_CREATED)
# def hello_root():
#     return {"name": 'name'}
#
#
# # new function, It works as a dependency to verify the validity of the token
# def get_current_user_from_token(token: str = Depends(oauth2_schema)):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#     )
#     print(token)
#     payload = decode_access_token(token)
#     if payload is None:
#         raise credentials_exception
#
#     return token
#
#
# # new function, It works as a dependency to verify the validity of the token
# def get_current_rsa_user_from_token(token: str = Depends(oauth2_schema)):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#     )
#
#     payload = decode_rsa_access_token(token)
#     if payload is None:
#         raise credentials_exception
#
#     return token
#
#
# @app.post("/token_test/", status_code=status.HTTP_226_IM_USED)
# def validate_token(current_user: str = Depends(get_current_user_from_token)):
#     return {'detail': "valid credentials"}
#
#
# @app.get("/token_files/", status_code=status.HTTP_202_ACCEPTED)
# def get_files_token(response: Response, credentials: UserCredentials):
#     # get users allowed to access files
#     users_allowed = json_file_operations(op.join('app', 'Access_Keys.json'), operation='R')
#
#     # check if the credential id is registed
#     access_id_index = next((index for (index, d) in enumerate(users_allowed['allowed']) if
#                             d["accessId"] == credentials.access_id), None)
#
#     if access_id_index is None:
#         response.status_code = status.HTTP_406_NOT_ACCEPTABLE
#         print(Fore.RED + "Someone try to acces to token without permission")
#         print(Fore.RESET)
#         return {"Message": "Not Valid Credentials"}
#     else:
#         if users_allowed["allowed"][access_id_index]["accessSecretKey"] == credentials.access_key:
#             access_token = create_access_token(data={"sub": users_allowed["allowed"][access_id_index]["username"]})
#             print(
#                 Fore.GREEN + f'{users_allowed["allowed"][access_id_index]["username"]} requested token at {datetime.now()} to files access')
#             print(Fore.RESET)
#             return {'token_type': 'bearer', 'access_token': access_token}
#         else:
#             response.status_code = status.HTTP_406_NOT_ACCEPTABLE
#             print(Fore.RED + "Someone try to acces to token without permission")
#             print(Fore.RESET)
#             return {"Message": "Not Valid Credentials"}


if __name__ == '__main__':
    uvicorn.run('main:app', host='127.0.0.1', port=8000, reload=True)
