from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from app.models.food import FoodType


class NutrientResponse(BaseModel):
    nutrient_name: str
    value: float
    unit: str

    class Config:
        from_attributes = True


class CategoryResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class FoodSummary(BaseModel):
    id: UUID
    name: str
    name_hindi: Optional[str] = None
    food_type: FoodType
    region: Optional[str] = None
    serving_size_g: float
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True


class FoodDetail(FoodSummary):
    description: Optional[str] = None
    name_local: Optional[str] = None
    nutrients: List[NutrientResponse] = []

    class Config:
        from_attributes = True


class FoodSearchResponse(BaseModel):
    foods: List[FoodSummary]
    total: int
    query: Optional[str] = None

class CalculatorItem(BaseModel):
    food_id: UUID
    quantity_g: float  # amount in grams the user is consuming


class CalculatorRequest(BaseModel):
    items: List[CalculatorItem]


class CalculatorItemResult(BaseModel):
    food_id: UUID
    food_name: str
    quantity_g: float
    nutrients: dict  # nutrient_name -> {value, unit}


class CalculatorResponse(BaseModel):
    items: List[CalculatorItemResult]
    totals: dict  # nutrient_name -> {value, unit}