from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, BigInteger
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# ---------- DATABASE CONFIGURATION ----------
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in environment variables. Check your .env file")

engine = create_engine(DATABASE_URL, pool_pre_ping=True, echo=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


class User(Base):
    """Users table"""
    __tablename__ = "users"

    id                 = Column(Integer,     primary_key=True)
    email              = Column(String(255), unique=True, nullable=False)
    full_name          = Column(String(255), nullable=False)
    hashed_password    = Column(String(255))
    is_verified        = Column(Boolean,     default=False)
    is_google_user     = Column(Boolean,     default=False)
    # Storage quota tracking — max 100 MB per user (104_857_600 bytes)
    used_storage_bytes = Column(BigInteger,  default=0, nullable=False)
    created_at         = Column(DateTime,    default=datetime.utcnow)


class RevokedToken(Base):
    """
    Blacklist for revoked JWTs.

    Both the access token and the refresh token are stored here on logout.
    The get_current_user dependency and the /refresh endpoint reject any
    token whose jti appears in this table.

    expires_at is stored so a periodic cleanup job can delete rows that are
    past their natural expiry — they can never be used again anyway.
    """
    __tablename__ = "revoked_tokens"

    id         = Column(Integer,    primary_key=True, autoincrement=True)
    jti        = Column(String(36), unique=True, nullable=False, index=True)  # UUID per token
    token_type = Column(String(20), nullable=False)   # "access" | "refresh"
    expires_at = Column(DateTime,   nullable=False)    # natural JWT expiry
    revoked_at = Column(DateTime,   default=datetime.utcnow)


# Create tables
Base.metadata.create_all(bind=engine)