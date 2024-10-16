from fastapi import APIRouter, Depends

from api.dependencies import get_current_user_from_token

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(get_current_user_from_token)],
    responses={404: {"description": "Not found"}},
)


@router.get("/me")
def get_user_info():
    return {'user': "a"}

