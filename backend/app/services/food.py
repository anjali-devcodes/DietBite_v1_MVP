from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func
from fastapi import HTTPException
from app.models.food import Food, FoodCategory, FoodNutrient


def search_foods(
    db: Session,
    query: str = None,
    category_slug: str = None,
    food_type: str = None,
    region: str = None,
    skip: int = 0,
    limit: int = 20,
):
    q = db.query(Food).options(
        joinedload(Food.category),
        joinedload(Food.nutrients)
    ).filter(Food.is_active == True)

    if query:
        search = f"%{query.lower()}%"
        q = q.filter(
            or_(
                func.lower(Food.name).like(search),
                func.lower(Food.name_hindi).like(search),
                func.lower(Food.name_local).like(search),
            )
        )

    if category_slug:
        q = q.join(Food.category).filter(
            func.lower(FoodCategory.slug) == category_slug.lower()
        )

    if food_type:
        q = q.filter(Food.food_type == food_type)

    if region:
        q = q.filter(func.lower(Food.region).like(f"%{region.lower()}%"))

    total = q.count()
    foods = q.order_by(Food.name).offset(skip).limit(limit).all()
    return {"foods": foods, "total": total, "query": query}


def get_food_by_id(db: Session, food_id: str) -> Food:
    food = db.query(Food).options(
        joinedload(Food.category),
        joinedload(Food.nutrients)
    ).filter(Food.id == food_id, Food.is_active == True).first()

    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    return food


def get_all_categories(db: Session):
    return db.query(FoodCategory).order_by(FoodCategory.name).all()


def get_nutrient_summary(db: Session, food_id: str) -> dict:
    food = get_food_by_id(db, food_id)
    nutrients = {n.nutrient_name: {"value": n.value, "unit": n.unit} for n in food.nutrients}
    return {"food": food.name, "per_100g": nutrients}

def calculate_nutrition(db: Session, items: list) -> dict:
    results = []
    totals = {}

    for item in items:
        food = db.query(Food).options(joinedload(Food.nutrients)).filter(
            Food.id == item.food_id, Food.is_active == True
        ).first()

        if not food:
            raise HTTPException(status_code=404, detail=f"Food with id {item.food_id} not found")

        scale = item.quantity_g / 100.0
        item_nutrients = {}

        for n in food.nutrients:
            scaled_value = round(n.value * scale, 2)
            item_nutrients[n.nutrient_name] = {"value": scaled_value, "unit": n.unit}

            if n.nutrient_name not in totals:
                totals[n.nutrient_name] = {"value": 0.0, "unit": n.unit}
            totals[n.nutrient_name]["value"] = round(totals[n.nutrient_name]["value"] + scaled_value, 2)

        results.append({
            "food_id": food.id,
            "food_name": food.name,
            "quantity_g": item.quantity_g,
            "nutrients": item_nutrients,
        })

    return {"items": results, "totals": totals}