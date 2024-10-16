"""
Code responsible for:
    1. Signing certificates
    2. Encrypting certificates
    3. Decrypting certificates
    4. Returning certificates
"""

# required imports
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from base64 import b64decode
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.x509.oid import NameOID

JWT_SECRET_KEY = "ae77d0a14df77f6d22f5be15df1aa11260a894e60b975ad1aa28875abd327081"
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_IN = 60 * 48  # token only valid for 12 hours
password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password, hashed_pass)


def create_access_token(data: dict, expires_delta: int = None):
    to_encode = data.copy()

    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRES_IN)

    to_encode.update({"exp": expires_delta})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, JWT_ALGORITHM)

    return encoded_jwt


def decode_access_token(token):
    try:
        decoded_token = jwt.decode(token, JWT_SECRET_KEY, JWT_ALGORITHM)
        return decoded_token
    except Exception as e:
        print('a', e)
        return None


def decode_rsa_access_token(token):
    try:
        x5c = jwt.get_unverified_header(token)['x5c'][0]
        cert = x509.load_der_x509_certificate(b64decode(x5c), default_backend())
        aud = cert.subject.get_attributes_for_oid(NameOID.SERIAL_NUMBER)[0].value
        pem = cert.public_key().public_bytes(encoding=serialization.Encoding.PEM,
                                             format=serialization.PublicFormat.SubjectPublicKeyInfo)
        authorization = jwt.decode(token, pem, algorithms=['RS256'], audience=aud)
        print(authorization)
        return authorization
    except Exception as e:
        print(e)
        return None
