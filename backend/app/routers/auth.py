from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..database.connection import get_db
from ..models.database import User as UserModel
from ..models.schemas import User, UserCreate, Token
from ..auth.security import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from ..pterodactyl.client import pterodactyl_client

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/register", response_model=User)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(UserModel).filter(
        (UserModel.email == user.email) | (UserModel.username == user.username)
    ).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already registered"
        )
    
    # Create user in Pterodactyl first
    pterodactyl_user = await pterodactyl_client.create_user(
        username=user.username,
        email=user.email,
        password=user.password
    )
    
    if not pterodactyl_user:
        raise HTTPException(
            status_code=500,
            detail="Failed to create user in Pterodactyl panel"
        )
    
    # Create user in local database
    hashed_password = get_password_hash(user.password)
    db_user = UserModel(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        pterodactyl_id=pterodactyl_user["attributes"]["id"]
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: UserModel = Depends(get_current_active_user)):
    return current_user

@router.post("/logout")
async def logout():
    # In a real application, you might want to blacklist the token
    return {"message": "Successfully logged out"}