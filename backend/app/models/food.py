from sqlalchemy import (
    Column, String, Float, Boolean, Text,
    Integer, ForeignKey, Enum as SAEnum
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import DateTime
import uuid
import enum
from app.database import Base


class FoodType(str, enum.Enum):
    raw = "raw"
    cooked = "cooked"
    processed = "processed"
    beverage = "beverage"
    recipe = "recipe"


class FoodCategory(Base):
    __tablename__ = "food_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)

    foods = relationship("Food", back_populates="category")


class Food(Base):
    __tablename__ = "foods"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, index=True)
    name_hindi = Column(String, nullable=True)
    name_local = Column(String, nullable=True)
    description = Column(Text, nullable=True)

    category_id = Column(UUID(as_uuid=True), ForeignKey("food_categories.id"), nullable=True)
    category = relationship("FoodCategory", back_populates="foods")

    food_type = Column(SAEnum(FoodType), default=FoodType.raw, nullable=False)
    serving_size_g = Column(Float, default=100.0)
    serving_unit = Column(String, default="g")

    is_indian = Column(Boolean, default=True)
    region = Column(String, nullable=True)   # e.g. "North India", "South India", "Pan-India"
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    nutrients = relationship("FoodNutrient", back_populates="food", cascade="all, delete-orphan")


class FoodNutrient(Base):
    __tablename__ = "food_nutrients"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    food_id = Column(UUID(as_uuid=True), ForeignKey("foods.id", ondelete="CASCADE"), nullable=False)
    food = relationship("Food", back_populates="nutrients")

    nutrient_name = Column(String, nullable=False)   # e.g. "energy_kcal", "protein_g"
    value = Column(Float, nullable=False)
    unit = Column(String, nullable=False)            # e.g. "kcal", "g", "mg", "mcg"