from cryptography.fernet import Fernet
from fastapi import HTTPException

from decouple import config
# ENV Variable load from .env file
DB_SECRET = config("DB_SECRET")


# encrypt the data connection password before saving
def encrypt_password(raw_pass: str) -> str:
    try:
        encoded_raw_pass = raw_pass.encode("utf-8")  # to bytes
        f = Fernet(DB_SECRET)
        encrypted_pass = f.encrypt(encoded_raw_pass)  # encryption
        decoded_encrypted_pass = encrypted_pass.decode(
            "utf-8")  # to strings
        return decoded_encrypted_pass
    except:
        raise HTTPException(
            status_code=403, detail="Encryption error")


# decrypt the encrypted saved password while creating data connection pool
def decrypt_password(decoded_encrypted_pass: str) -> str:
    try:
        f = Fernet(DB_SECRET)

        encoded_encrypted_pass = decoded_encrypted_pass.encode(
            "utf-8")  # to bytes
        encoded_decrypted_pass = f.decrypt(encoded_encrypted_pass)  # decoding
        decoded_decrypted_pass = encoded_decrypted_pass.decode(
            "utf-8")  # to string
        return decoded_decrypted_pass
    except:
        raise HTTPException(
            status_code=500, detail="Decryption error")
