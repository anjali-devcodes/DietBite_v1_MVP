from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import require_role
from app.models.user import User, UserRole
from app.schemas.meal_plan import (
    MealPlanCreate, MealPlanUpdate, MealPlanListResponse, MealPlanDetailResponse,
    MealPlanDayCreate, MealPlanItemCreate
)
from app.services import meal_plan as plan_service

router = APIRouter(prefix="/meal-plans", tags=["Meal Plans"])
dietitian_only = require_role(UserRole.dietitian, UserRole.admin)


@router.post("", status_code=201)
def create_plan(data: MealPlanCreate, db: Session = Depends(get_db), current_user: User = Depends(dietitian_only)):
    plan = plan_service.create_meal_plan(db, current_user.id, data)
    return plan_service.get_plan_detail(db, plan.id, current_user.id)


@router.get("/by-patient/{patient_id}", response_model=MealPlanListResponse)
def list_plans_for_patient(
    patient_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(dietitian_only),
):
    return plan_service.get_plans_for_patient(db, patient_id, current_user.id, skip, limit)


@router.get("/{plan_id}", response_model=MealPlanDetailResponse)
def get_plan(plan_id: str, db: Session = Depends(get_db), current_user: User = Depends(dietitian_only)):
    return plan_service.get_plan_detail(db, plan_id, current_user.id)


@router.patch("/{plan_id}")
def update_plan(plan_id: str, data: MealPlanUpdate, db: Session = Depends(get_db), current_user: User = Depends(dietitian_only)):
    plan_service.update_plan(db, plan_id, current_user.id, data)
    return plan_service.get_plan_detail(db, plan_id, current_user.id)


@router.delete("/{plan_id}")
def delete_plan(plan_id: str, db: Session = Depends(get_db), current_user: User = Depends(dietitian_only)):
    return plan_service.delete_plan(db, plan_id, current_user.id)


@router.post("/{plan_id}/days", status_code=201)
def add_day(plan_id: str, data: MealPlanDayCreate, db: Session = Depends(get_db), current_user: User = Depends(dietitian_only)):
    plan_service.add_day(db, plan_id, current_user.id, data)
    return plan_service.get_plan_detail(db, plan_id, current_user.id)


@router.delete("/days/{day_id}")
def delete_day(day_id: str, db: Session = Depends(get_db), current_user: User = Depends(dietitian_only)):
    return plan_service.delete_day(db, day_id, current_user.id)


@router.post("/days/{day_id}/items", status_code=201)
def add_item(day_id: str, data: MealPlanItemCreate, db: Session = Depends(get_db), current_user: User = Depends(dietitian_only)):
    return plan_service.add_item(db, day_id, current_user.id, data)


@router.delete("/items/{item_id}")
def remove_item(item_id: str, db: Session = Depends(get_db), current_user: User = Depends(dietitian_only)):
    return plan_service.remove_item(db, item_id, current_user.id)