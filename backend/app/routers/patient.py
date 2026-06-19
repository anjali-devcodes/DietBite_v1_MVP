from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.core.dependencies import require_role
from app.models.user import User, UserRole
from app.schemas.patient import (
    PatientCreate, PatientUpdate, PatientResponse, PatientListResponse,
    PatientDetailResponse, MeasurementCreate, MeasurementResponse
)
from app.services import patient as patient_service

router = APIRouter(prefix="/patients", tags=["Patients"])

dietitian_only = require_role(UserRole.dietitian, UserRole.admin)


@router.post("", response_model=PatientResponse, status_code=201)
def create_patient(
    data: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dietitian_only),
):
    return patient_service.create_patient(db, current_user, data)


@router.get("", response_model=PatientListResponse)
def list_patients(
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(dietitian_only),
):
    return patient_service.get_patients_for_dietitian(db, current_user.id, skip, limit, search)


@router.get("/{patient_id}", response_model=PatientDetailResponse)
def get_patient(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(dietitian_only),
):
    return patient_service.get_patient_by_id(db, patient_id, current_user.id)


@router.patch("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: str,
    data: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dietitian_only),
):
    return patient_service.update_patient(db, patient_id, current_user.id, data)


@router.delete("/{patient_id}")
def delete_patient(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(dietitian_only),
):
    return patient_service.delete_patient(db, patient_id, current_user.id)


@router.post("/{patient_id}/measurements", response_model=MeasurementResponse, status_code=201)
def add_measurement(
    patient_id: str,
    data: MeasurementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dietitian_only),
):
    return patient_service.add_measurement(db, patient_id, current_user.id, data)


@router.get("/{patient_id}/measurements", response_model=List[MeasurementResponse])
def get_measurements(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(dietitian_only),
):
    return patient_service.get_measurements(db, patient_id, current_user.id)