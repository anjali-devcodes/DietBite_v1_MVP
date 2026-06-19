from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from app.models.meal_plan import MealPlan, MealPlanDay, MealPlanItem
from app.models.patient import Patient
from app.models.food import Food


def _verify_patient_ownership(db: Session, patient_id, dietitian_id):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    if patient.dietitian_id != dietitian_id:
        raise HTTPException(status_code=403, detail="You do not have access to this patient")
    return patient


def _scale_nutrients(food: Food, quantity_g: float) -> dict:
    scale = quantity_g / 100.0
    return {
        n.nutrient_name: {"value": round(n.value * scale, 2), "unit": n.unit}
        for n in food.nutrients
    }


def _sum_nutrients(nutrient_dicts: list) -> dict:
    totals = {}
    for nd in nutrient_dicts:
        for name, data in nd.items():
            if name not in totals:
                totals[name] = {"value": 0.0, "unit": data["unit"]}
            totals[name]["value"] = round(totals[name]["value"] + data["value"], 2)
    return totals


def create_meal_plan(db: Session, dietitian_id, data) -> MealPlan:
    _verify_patient_ownership(db, data.patient_id, dietitian_id)

    plan = MealPlan(
        patient_id=data.patient_id,
        dietitian_id=dietitian_id,
        title=data.title,
        start_date=data.start_date,
        end_date=data.end_date,
        notes=data.notes,
    )
    db.add(plan)
    db.flush()

    # Scaffold empty days
    for i in range(1, data.num_days + 1):
        db.add(MealPlanDay(meal_plan_id=plan.id, day_number=i, label=f"Day {i}"))

    db.commit()
    db.refresh(plan)
    return plan


def get_plans_for_patient(db: Session, patient_id, dietitian_id, skip=0, limit=50):
    _verify_patient_ownership(db, patient_id, dietitian_id)

    q = db.query(MealPlan).filter(MealPlan.patient_id == patient_id)
    total = q.count()
    plans = q.order_by(MealPlan.created_at.desc()).offset(skip).limit(limit).all()

    results = []
    for p in plans:
        results.append({
            "id": p.id, "patient_id": p.patient_id, "title": p.title,
            "start_date": p.start_date, "end_date": p.end_date,
            "is_active": p.is_active, "created_at": p.created_at,
            "day_count": len(p.days),
        })
    return {"plans": results, "total": total}


def get_plan_detail(db: Session, plan_id, dietitian_id) -> dict:
    plan = db.query(MealPlan).options(
        joinedload(MealPlan.days).joinedload(MealPlanDay.items).joinedload(MealPlanItem.food)
    ).filter(MealPlan.id == plan_id).first()

    if not plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    if plan.dietitian_id != dietitian_id:
        raise HTTPException(status_code=403, detail="You do not have access to this meal plan")

    days_out = []
    for day in plan.days:
        items_out = []
        item_nutrient_dicts = []

        for item in day.items:
            nutrients = _scale_nutrients(item.food, item.quantity_g)
            item_nutrient_dicts.append(nutrients)
            items_out.append({
                "id": item.id, "food_id": item.food_id, "food_name": item.food.name,
                "meal_slot": item.meal_slot, "quantity_g": item.quantity_g,
                "notes": item.notes, "nutrients": nutrients,
            })

        days_out.append({
            "id": day.id, "day_number": day.day_number, "label": day.label,
            "notes": day.notes, "items": items_out,
            "totals": _sum_nutrients(item_nutrient_dicts),
        })

    return {
        "id": plan.id, "patient_id": plan.patient_id, "title": plan.title,
        "start_date": plan.start_date, "end_date": plan.end_date,
        "notes": plan.notes, "is_active": plan.is_active,
        "created_at": plan.created_at, "days": days_out,
    }


def update_plan(db: Session, plan_id, dietitian_id, data) -> MealPlan:
    plan = db.query(MealPlan).filter(MealPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    if plan.dietitian_id != dietitian_id:
        raise HTTPException(status_code=403, detail="You do not have access to this meal plan")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(plan, field, value)

    db.commit()
    db.refresh(plan)
    return plan


def delete_plan(db: Session, plan_id, dietitian_id) -> dict:
    plan = db.query(MealPlan).filter(MealPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    if plan.dietitian_id != dietitian_id:
        raise HTTPException(status_code=403, detail="You do not have access to this meal plan")

    db.delete(plan)
    db.commit()
    return {"message": "Meal plan deleted"}


def add_day(db: Session, plan_id, dietitian_id, data) -> MealPlanDay:
    plan = db.query(MealPlan).filter(MealPlan.id == plan_id).first()
    if not plan or plan.dietitian_id != dietitian_id:
        raise HTTPException(status_code=404, detail="Meal plan not found")

    day = MealPlanDay(meal_plan_id=plan.id, day_number=data.day_number, label=data.label, notes=data.notes)
    db.add(day)
    db.commit()
    db.refresh(day)
    return day


def delete_day(db: Session, day_id, dietitian_id):
    day = db.query(MealPlanDay).join(MealPlan).filter(MealPlanDay.id == day_id).first()
    if not day or day.meal_plan.dietitian_id != dietitian_id:
        raise HTTPException(status_code=404, detail="Day not found")
    db.delete(day)
    db.commit()
    return {"message": "Day removed"}


def add_item(db: Session, day_id, dietitian_id, data) -> MealPlanItem:
    day = db.query(MealPlanDay).join(MealPlan).filter(MealPlanDay.id == day_id).first()
    if not day or day.meal_plan.dietitian_id != dietitian_id:
        raise HTTPException(status_code=404, detail="Day not found")

    food = db.query(Food).filter(Food.id == data.food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")

    item = MealPlanItem(
        meal_plan_day_id=day.id, food_id=data.food_id,
        meal_slot=data.meal_slot, quantity_g=data.quantity_g, notes=data.notes,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def remove_item(db: Session, item_id, dietitian_id):
    item = db.query(MealPlanItem).join(MealPlanDay).join(MealPlan).filter(MealPlanItem.id == item_id).first()
    if not item or item.day.meal_plan.dietitian_id != dietitian_id:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item removed"}