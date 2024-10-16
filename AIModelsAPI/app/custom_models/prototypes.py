from pydantic import BaseModel


# prototype for user credentials to get files
class UserCredentials(BaseModel):
    access_id: str
    access_key: str


# prototype for admin credentials inherit from user credentials
class AdminCredentials(UserCredentials):
    username: str


# prototype for register new user
class NewUser(BaseModel):
    username: str


# prototype for model predictions
class OccurrencePredictions(BaseModel):
    imageUrl: str
    DateTime: str
    GPSCoordinates: dict
    Class: str
    TrustLevel: float


# prototype of predictions filename
class PredictionsFile(BaseModel):
    predictionsDate: str
    fromEntity: str


# prototype of JWT Authorization
class JWTCredentials(BaseModel):
    accessToken: str


class Coordinates(BaseModel):
    lat: float
    long: float
