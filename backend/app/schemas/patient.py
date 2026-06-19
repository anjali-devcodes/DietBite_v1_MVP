from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.models.patient import Gender, Goal


class PatientCreate(BaseModel):
    full_name: str
    age: Optional[int] = None
    gender: Optional[Gender] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    height_cm: Optional[float] = None
    current_weight_kg: Optional[float] = None
    target_weight_kg: Optional[float] = None
    medical_conditions: Optional[str] = None
    dietary_preferences: Optional[str] = None
    goal: Optional[Goal] = Goal.maintenance
    notes: Optional[str] = None


class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[Gender] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    height_cm: Optional[float] = None
    current_weight_kg: Optional[float] = None
    target_weight_kg: Optional[float] = None
    medical_conditions: Optional[str] = None
    dietary_preferences: Optional[str] = None
    goal: Optional[Goal] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class PatientResponse(BaseModel):
    id: UUID
    full_name: str
    age: Optional[int]
    gender: Optional[Gender]
    phone: Optional[str]
    email: Optional[str]
    height_cm: Optional[float]
    current_weight_kg: Optional[float]
    target_weight_kg: Optional[float]
    medical_conditions: Optional[str]
    dietary_preferences: Optional[str]
    goal: Goal
    notes: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class PatientListResponse(BaseModel):
    patients: List[PatientResponse]
    total: int


class MeasurementCreate(BaseModel):
    weight_kg: float
    height_cm: Optional[float] = None
    notes: Optional[str] = None


class MeasurementResponse(BaseModel):
    id: UUID
    weight_kg: float
    height_cm: Optional[float]
    bmi: Optional[float]
    notes: Optional[str]
    recorded_at: datetime

    class Config:
        from_attributes = True


class PatientDetailResponse(PatientResponse):
    measurements: List[MeasurementResponse] = []

    class Config:
        from_attributes = True