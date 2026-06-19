from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.schemas.food import FoodSearchResponse, FoodDetail, CategoryResponse, CalculatorRequest, CalculatorResponse
from app.services.food import search_foods, get_food_by_id, get_all_categories, get_nutrient_summary,  calculate_nutrition
from app.core.dependencies import get_current_user
from app.models.user import User
from typing import List


router = APIRouter(prefix="/foods", tags=["Foods"])


@router.get("/search", response_model=FoodSearchResponse)
def search(
    q: Optional[str] = Query(None, description="Search by name or Hindi name"),
    category: Optional[str] = Query(None, description="Filter by category slug"),
    food_type: Optional[str] = Query(None, description="raw | cooked | processed | beverage | recipe"),
    region: Optional[str] = Query(None, description="Filter by region"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return search_foods(db, query=q, category_slug=category, food_type=food_type, region=region, skip=skip, limit=limit)


@router.get("/categories", response_model=List[CategoryResponse])
def categories(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return get_all_categories(db)


@router.get("/{food_id}", response_model=FoodDetail)
def get_food(
    food_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return get_food_by_id(db, food_id)


@router.get("/{food_id}/nutrients")
def get_nutrients(
    food_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return get_nutrient_summary(db, food_id)

@router.post("/calculate", response_model=CalculatorResponse)
def calculate(
    request: CalculatorRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return calculate_nutrition(db, request.items)