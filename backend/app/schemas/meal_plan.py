from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import date, datetime
from app.models.meal_plan import MealSlot


# ── Items ──
class MealPlanItemCreate(BaseModel):
    food_id: UUID
    meal_slot: MealSlot
    quantity_g: float
    notes: Optional[str] = None


class MealPlanItemResponse(BaseModel):
    id: UUID
    food_id: UUID
    food_name: str
    meal_slot: MealSlot
    quantity_g: float
    notes: Optional[str] = None
    nutrients: dict = {}   # populated at read-time

    class Config:
        from_attributes = True


# ── Days ──
class MealPlanDayCreate(BaseModel):
    day_number: int
    label: Optional[str] = None
    notes: Optional[str] = None


class MealPlanDayResponse(BaseModel):
    id: UUID
    day_number: int
    label: Optional[str] = None
    notes: Optional[str] = None
    items: List[MealPlanItemResponse] = []
    totals: dict = {}   # populated at read-time

    class Config:
        from_attributes = True


# ── Plans ──
class MealPlanCreate(BaseModel):
    patient_id: UUID
    title: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None
    num_days: int = 1   # how many empty days to scaffold on creation


class MealPlanUpdate(BaseModel):
    title: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class MealPlanSummary(BaseModel):
    id: UUID
    patient_id: UUID
    title: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: bool
    created_at: datetime
    day_count: int = 0

    class Config:
        from_attributes = True


class MealPlanListResponse(BaseModel):
    plans: List[MealPlanSummary]
    total: int


class MealPlanDetailResponse(BaseModel):
    id: UUID
    patient_id: UUID
    title: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None
    is_active: bool
    created_at: datetime
    days: List[MealPlanDayResponse] = []

    class Config:
        from_attributes = True