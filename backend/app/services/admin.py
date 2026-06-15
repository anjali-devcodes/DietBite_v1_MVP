from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.schemas.user import AdminUpdateUserRequest

def get_all_users(db: Session, skip: int = 0, limit: int = 50):
    users = db.query(User).offset(skip).limit(limit).all()
    total = db.query(User).count()
    return {"users": users, "total": total}

def get_user_by_id(db: Session, user_id: str) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def update_user(db: Session, user_id: str, data: AdminUpdateUserRequest) -> User:
    user = get_user_by_id(db, user_id)
    if data.role is not None:
        user.role = data.role
    if data.is_active is not None:
        user.is_active = data.is_active
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user_id: str, current_user: User) -> dict:
    if str(current_user.id) == user_id:
        raise HTTPException(status_code=400, detail="You cannot delete your own account")
    user = get_user_by_id(db, user_id)
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}