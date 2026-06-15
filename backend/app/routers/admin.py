from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import require_role
from app.models.user import User, UserRole
from app.schemas.user import UserResponse, UserListResponse, AdminUpdateUserRequest
from app.services import admin as admin_service

router = APIRouter(prefix="/admin", tags=["Admin"])

# All admin routes require admin role
admin_only = require_role(UserRole.admin)

@router.get("/users", response_model=UserListResponse)
def list_users(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _: User = Depends(admin_only)
):
    return admin_service.get_all_users(db, skip, limit)

@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(admin_only)
):
    return admin_service.get_user_by_id(db, user_id)

@router.patch("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    data: AdminUpdateUserRequest,
    db: Session = Depends(get_db),
    _: User = Depends(admin_only)
):
    return admin_service.update_user(db, user_id, data)

@router.delete("/users/{user_id}")
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    return admin_service.delete_user(db, user_id, current_user)