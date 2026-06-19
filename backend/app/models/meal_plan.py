from sqlalchemy import (
    Column, String, Integer, Float, Text, Date, DateTime,
    Boolean, ForeignKey, Enum as SAEnum
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.database import Base


class MealSlot(str, enum.Enum):
    breakfast = "breakfast"
    mid_morning = "mid_morning"
    lunch = "lunch"
    evening_snack = "evening_snack"
    dinner = "dinner"
    bedtime = "bedtime"


class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    dietitian_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    title = Column(String, nullable=False)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    patient = relationship("Patient")
    days = relationship("MealPlanDay", back_populates="meal_plan", cascade="all, delete-orphan", order_by="MealPlanDay.day_number")


class MealPlanDay(Base):
    __tablename__ = "meal_plan_days"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meal_plan_id = Column(UUID(as_uuid=True), ForeignKey("meal_plans.id", ondelete="CASCADE"), nullable=False)

    day_number = Column(Integer, nullable=False)   # 1, 2, 3...
    label = Column(String, nullable=True)           # e.g. "Day 1 - Monday"
    notes = Column(Text, nullable=True)

    meal_plan = relationship("MealPlan", back_populates="days")
    items = relationship("MealPlanItem", back_populates="day", cascade="all, delete-orphan")


class MealPlanItem(Base):
    __tablename__ = "meal_plan_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meal_plan_day_id = Column(UUID(as_uuid=True), ForeignKey("meal_plan_days.id", ondelete="CASCADE"), nullable=False)
    food_id = Column(UUID(as_uuid=True), ForeignKey("foods.id"), nullable=False)

    meal_slot = Column(SAEnum(MealSlot), nullable=False)
    quantity_g = Column(Float, nullable=False)
    notes = Column(Text, nullable=True)

    day = relationship("MealPlanDay", back_populates="items")
    food = relationship("Food")