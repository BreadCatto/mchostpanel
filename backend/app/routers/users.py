from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database.connection import get_db
from ..models.database import User as UserModel, Server as ServerModel
from ..models.schemas import User, UserUpdate
from ..auth.security import get_current_active_user, get_current_admin_user

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/profile", response_model=User)
async def get_profile(current_user: UserModel = Depends(get_current_active_user)):
    return current_user

@router.put("/profile", response_model=User)
async def update_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    # Check if username or email is already taken by another user
    if user_update.username and user_update.username != current_user.username:
        existing_user = db.query(UserModel).filter(
            UserModel.username == user_update.username,
            UserModel.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")
    
    if user_update.email and user_update.email != current_user.email:
        existing_user = db.query(UserModel).filter(
            UserModel.email == user_update.email,
            UserModel.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already taken")
    
    # Update user
    if user_update.username:
        current_user.username = user_update.username
    if user_update.email:
        current_user.email = user_update.email
    if user_update.password:
        from ..auth.security import get_password_hash
        current_user.hashed_password = get_password_hash(user_update.password)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/", response_model=List[User])
async def get_all_users(
    db: Session = Depends(get_db),
    admin_user: UserModel = Depends(get_current_admin_user)
):
    users = db.query(UserModel).all()
    return users

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: UserModel = Depends(get_current_admin_user)
):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete user's servers first
    servers = db.query(ServerModel).filter(ServerModel.user_id == user_id).all()
    for server in servers:
        db.delete(server)
    
    # Delete user
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}