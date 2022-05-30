from decouple import config
import time
from datetime import datetime, timedelta
import jwt
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict

# variables loaded from .env file
JWT_SECRET = config("JWT_SECRET")
ACCESS_TOKEN_EXPIRE_MINUTES = config("ACCESS_TOKEN_EXPIRE_MINUTES")
JWT_ALGORITHM = config("JWT_ALGORITHM")


# user for the class method
def decode_JWT(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload["exp"] >= time.time():
            return payload
        else:
            None
    except:
        return {}


# USED as AUTH MIDDLEWARE
class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=403, detail="Invalid authentication scheme")
            if not self.verify_jwt(request=request, jwtoken=credentials.credentials):
                raise HTTPException(
                    status_code=403, detail="Invalid token or expired token")
            return credentials.credentials
        else:
            raise HTTPException(
                status_code=403, detail="Invalid authorization code")

    def verify_jwt(self, request: Request, jwtoken: str) -> bool:
        is_token_valid: bool = False
        try:
            payload = decode_JWT(jwtoken)
            request.state.uid = payload.get("uid")
        except:
            payload = None
        if payload:
            is_token_valid = True
        return is_token_valid


# takes user id and gives TOKEN
# used by /signin route
def signJWT(uid: str) -> Dict[str, str]:
    cur_time = datetime.utcnow()
    exp_time = cur_time + timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))
    payload = {"uid": uid, "iat": cur_time, "exp": exp_time}
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {"access_token": token, "token_type": "Bearer"}
