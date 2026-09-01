#--------Pydantic schemas for validation -----------

from pydantic import BaseModel, EmailStr

class Signup(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    confirm_password: str

class Login(BaseModel):
    email: EmailStr
    password: str

class RefreshToken(BaseModel):
    refresh_token: str

class GoogleLogin(BaseModel):
    google_access_token: str

class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    token: str
    new_password: str
    confirm_password: str

# New schema for Resend Verification
class ResendVerificationRequest(BaseModel):
    email: EmailStr