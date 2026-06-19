from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from fastapi import HTTPException
from app.models.patient import Patient, PatientMeasurement
from app.models.user import User


def _calculate_bmi(weight_kg: float, height_cm: float) -> float:
    if not weight_kg or not height_cm:
        return None
    height_m = height_cm / 100
    return round(weight_kg / (height_m ** 2), 1)


def create_patient(db: Session, dietitian: User, data) -> Patient:
    patient = Patient(**data.dict(), dietitian_id=dietitian.id)
    db.add(patient)
    db.commit()
    db.refresh(patient)

    # Create initial measurement if weight provided
    if patient.current_weight_kg:
        bmi = _calculate_bmi(patient.current_weight_kg, patient.height_cm)
        db.add(PatientMeasurement(
            patient_id=patient.id,
            weight_kg=patient.current_weight_kg,
            height_cm=patient.height_cm,
            bmi=bmi,
        ))
        db.commit()

    return patient


def get_patients_for_dietitian(db: Session, dietitian_id, skip: int = 0, limit: int = 50, search: str = None):
    q = db.query(Patient).filter(Patient.dietitian_id == dietitian_id)

    if search:
        q = q.filter(func.lower(Patient.full_name).like(f"%{search.lower()}%"))

    total = q.count()
    patients = q.order_by(Patient.created_at.desc()).offset(skip).limit(limit).all()
    return {"patients": patients, "total": total}


def get_patient_by_id(db: Session, patient_id: str, dietitian_id) -> Patient:
    patient = db.query(Patient).options(
        joinedload(Patient.measurements)
    ).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Ownership check — dietitians can only access their own patients
    if patient.dietitian_id != dietitian_id:
        raise HTTPException(status_code=403, detail="You do not have access to this patient")

    return patient


def update_patient(db: Session, patient_id: str, dietitian_id, data) -> Patient:
    patient = get_patient_by_id(db, patient_id, dietitian_id)

    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)

    db.commit()
    db.refresh(patient)
    return patient


def delete_patient(db: Session, patient_id: str, dietitian_id) -> dict:
    patient = get_patient_by_id(db, patient_id, dietitian_id)
    db.delete(patient)
    db.commit()
    return {"message": "Patient deleted successfully"}


def add_measurement(db: Session, patient_id: str, dietitian_id, data) -> PatientMeasurement:
    patient = get_patient_by_id(db, patient_id, dietitian_id)

    height = data.height_cm or patient.height_cm
    bmi = _calculate_bmi(data.weight_kg, height)

    measurement = PatientMeasurement(
        patient_id=patient.id,
        weight_kg=data.weight_kg,
        height_cm=height,
        bmi=bmi,
        notes=data.notes,
    )
    db.add(measurement)

    # Update patient's current stats
    patient.current_weight_kg = data.weight_kg
    if data.height_cm:
        patient.height_cm = data.height_cm

    db.commit()
    db.refresh(measurement)
    return measurement


def get_measurements(db: Session, patient_id: str, dietitian_id):
    patient = get_patient_by_id(db, patient_id, dietitian_id)
    return sorted(patient.measurements, key=lambda m: m.recorded_at)