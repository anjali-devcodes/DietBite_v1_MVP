from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.database import Base


class Gender(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"


class Goal(str, enum.Enum):
    weight_loss = "weight_loss"
    weight_gain = "weight_gain"
    muscle_gain = "muscle_gain"
    maintenance = "maintenance"
    clinical_management = "clinical_management"


class Patient(Base):
    __tablename__ = "patients"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dietitian_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    dietitian = relationship("User")

    full_name = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(SAEnum(Gender), nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)

    height_cm = Column(Float, nullable=True)
    current_weight_kg = Column(Float, nullable=True)
    target_weight_kg = Column(Float, nullable=True)

    medical_conditions = Column(Text, nullable=True)   # comma-separated or free text
    dietary_preferences = Column(Text, nullable=True)  # e.g. "vegetarian, no dairy"
    goal = Column(SAEnum(Goal), default=Goal.maintenance)
    notes = Column(Text, nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    measurements = relationship("PatientMeasurement", back_populates="patient", cascade="all, delete-orphan")


class PatientMeasurement(Base):
    __tablename__ = "patient_measurements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    patient = relationship("Patient", back_populates="measurements")

    weight_kg = Column(Float, nullable=False)
    height_cm = Column(Float, nullable=True)
    bmi = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)

    recorded_at = Column(DateTime(timezone=True), server_default=func.now())