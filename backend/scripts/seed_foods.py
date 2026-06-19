import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.database import SessionLocal
from app.models.food import Food, FoodCategory, FoodNutrient, FoodType

# ── CATEGORIES ────────────────────────────────────────────────
CATEGORIES = [
    {"name": "Cereals & Millets",     "slug": "cereals-millets",    "description": "Rice, wheat, millets, and other grains"},
    {"name": "Pulses & Legumes",      "slug": "pulses-legumes",     "description": "Lentils, beans, and legumes"},
    {"name": "Vegetables",            "slug": "vegetables",         "description": "Fresh and cooked vegetables"},
    {"name": "Fruits",                "slug": "fruits",             "description": "Fresh fruits"},
    {"name": "Dairy & Eggs",          "slug": "dairy-eggs",         "description": "Milk, curd, paneer, eggs"},
    {"name": "Meat & Fish",           "slug": "meat-fish",          "description": "Poultry, red meat, seafood"},
    {"name": "Fats & Oils",           "slug": "fats-oils",          "description": "Cooking oils, ghee, butter"},
    {"name": "Nuts & Seeds",          "slug": "nuts-seeds",         "description": "Nuts, seeds, and dry fruits"},
    {"name": "Spices & Condiments",   "slug": "spices-condiments",  "description": "Common Indian spices"},
    {"name": "Prepared Foods",        "slug": "prepared-foods",     "description": "Common Indian dishes and snacks"},
    {"name": "Beverages",             "slug": "beverages",          "description": "Tea, coffee, juices"},
    {"name": "Sweets & Snacks",       "slug": "sweets-snacks",      "description": "Indian sweets and namkeen"},
]

# ── FOOD DATA ─────────────────────────────────────────────────
# Per 100g unless noted. Source: IFCT 2017, NIN Hyderabad.
# Nutrients: energy_kcal, protein_g, fat_g, carb_g, fiber_g,
#            calcium_mg, iron_mg, sodium_mg, potassium_mg,
#            vit_c_mg, vit_a_mcg, folate_mcg, zinc_mg
FOODS = [
    # ── Cereals & Millets ──
    {
        "name": "Rice, Raw (Polished)",
        "name_hindi": "Chawal",
        "category": "cereals-millets",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 345, "protein_g": 6.8, "fat_g": 0.5,
            "carb_g": 78.2, "fiber_g": 0.2, "calcium_mg": 10,
            "iron_mg": 0.7, "sodium_mg": 5, "potassium_mg": 100,
            "vit_c_mg": 0, "vit_a_mcg": 0, "folate_mcg": 8, "zinc_mg": 1.0,
        }
    },
    {
        "name": "Wheat, Whole",
        "name_hindi": "Gehun",
        "category": "cereals-millets",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 346, "protein_g": 11.8, "fat_g": 1.5,
            "carb_g": 71.2, "fiber_g": 1.9, "calcium_mg": 41,
            "iron_mg": 4.9, "sodium_mg": 17, "potassium_mg": 306,
            "vit_c_mg": 0, "vit_a_mcg": 0, "folate_mcg": 36, "zinc_mg": 2.7,
        }
    },
    {
        "name": "Bajra (Pearl Millet)",
        "name_hindi": "Bajra",
        "category": "cereals-millets",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 361, "protein_g": 11.6, "fat_g": 5.0,
            "carb_g": 67.5, "fiber_g": 1.3, "calcium_mg": 42,
            "iron_mg": 8.0, "sodium_mg": 10, "potassium_mg": 307,
            "vit_c_mg": 0, "vit_a_mcg": 0, "folate_mcg": 45, "zinc_mg": 3.1,
        }
    },
    {
        "name": "Jowar (Sorghum)",
        "name_hindi": "Jowar",
        "category": "cereals-millets",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 349, "protein_g": 10.4, "fat_g": 1.9,
            "carb_g": 72.6, "fiber_g": 1.6, "calcium_mg": 25,
            "iron_mg": 4.1, "sodium_mg": 7, "potassium_mg": 350,
            "vit_c_mg": 0, "vit_a_mcg": 0, "folate_mcg": 20, "zinc_mg": 1.6,
        }
    },
    {
        "name": "Ragi (Finger Millet)",
        "name_hindi": "Ragi / Nachni",
        "category": "cereals-millets",
        "food_type": FoodType.raw,
        "region": "South India",
        "nutrients": {
            "energy_kcal": 328, "protein_g": 7.3, "fat_g": 1.3,
            "carb_g": 72.0, "fiber_g": 3.6, "calcium_mg": 344,
            "iron_mg": 3.9, "sodium_mg": 11, "potassium_mg": 408,
            "vit_c_mg": 0, "vit_a_mcg": 0, "folate_mcg": 18, "zinc_mg": 2.3,
        }
    },
    {
        "name": "Oats",
        "name_hindi": "Javi",
        "category": "cereals-millets",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 374, "protein_g": 13.2, "fat_g": 6.9,
            "carb_g": 65.4, "fiber_g": 10.1, "calcium_mg": 52,
            "iron_mg": 3.6, "sodium_mg": 5, "potassium_mg": 362,
            "vit_c_mg": 0, "vit_a_mcg": 0, "folate_mcg": 32, "zinc_mg": 3.6,
        }
    },

    # ── Pulses & Legumes ──
    {
        "name": "Moong Dal (Split Green Gram)",
        "name_hindi": "Moong Dal",
        "category": "pulses-legumes",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 334, "protein_g": 24.0, "fat_g": 1.3,
            "carb_g": 56.7, "fiber_g": 4.1, "calcium_mg": 75,
            "iron_mg": 8.5, "sodium_mg": 28, "potassium_mg": 849,
            "vit_c_mg": 1, "vit_a_mcg": 28, "folate_mcg": 159, "zinc_mg": 2.7,
        }
    },
    {
        "name": "Masoor Dal (Red Lentil)",
        "name_hindi": "Masoor Dal",
        "category": "pulses-legumes",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 343, "protein_g": 25.1, "fat_g": 0.7,
            "carb_g": 59.0, "fiber_g": 7.9, "calcium_mg": 68,
            "iron_mg": 7.6, "sodium_mg": 30, "potassium_mg": 672,
            "vit_c_mg": 1, "vit_a_mcg": 20, "folate_mcg": 181, "zinc_mg": 2.9,
        }
    },
    {
        "name": "Chana Dal (Bengal Gram)",
        "name_hindi": "Chana Dal",
        "category": "pulses-legumes",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 372, "protein_g": 20.8, "fat_g": 5.6,
            "carb_g": 59.8, "fiber_g": 5.3, "calcium_mg": 56,
            "iron_mg": 5.3, "sodium_mg": 33, "potassium_mg": 798,
            "vit_c_mg": 3, "vit_a_mcg": 17, "folate_mcg": 140, "zinc_mg": 2.8,
        }
    },
    {
        "name": "Toor Dal (Pigeon Pea)",
        "name_hindi": "Arhar / Toor Dal",
        "category": "pulses-legumes",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 335, "protein_g": 22.3, "fat_g": 1.7,
            "carb_g": 57.6, "fiber_g": 5.7, "calcium_mg": 73,
            "iron_mg": 2.7, "sodium_mg": 17, "potassium_mg": 850,
            "vit_c_mg": 0, "vit_a_mcg": 0, "folate_mcg": 130, "zinc_mg": 2.3,
        }
    },
    {
        "name": "Rajma (Kidney Beans)",
        "name_hindi": "Rajma",
        "category": "pulses-legumes",
        "food_type": FoodType.raw,
        "region": "North India",
        "nutrients": {
            "energy_kcal": 347, "protein_g": 22.9, "fat_g": 1.3,
            "carb_g": 60.6, "fiber_g": 6.4, "calcium_mg": 260,
            "iron_mg": 5.1, "sodium_mg": 28, "potassium_mg": 1406,
            "vit_c_mg": 0, "vit_a_mcg": 0, "folate_mcg": 394, "zinc_mg": 3.7,
        }
    },
    {
        "name": "Kabuli Chana (Chickpeas)",
        "name_hindi": "Chole",
        "category": "pulses-legumes",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 360, "protein_g": 17.1, "fat_g": 5.3,
            "carb_g": 60.5, "fiber_g": 5.3, "calcium_mg": 202,
            "iron_mg": 4.6, "sodium_mg": 24, "potassium_mg": 875,
            "vit_c_mg": 3, "vit_a_mcg": 3, "folate_mcg": 557, "zinc_mg": 3.4,
        }
    },

    # ── Vegetables ──
    {
        "name": "Spinach (Palak)",
        "name_hindi": "Palak",
        "category": "vegetables",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 26, "protein_g": 2.0, "fat_g": 0.7,
            "carb_g": 2.9, "fiber_g": 0.6, "calcium_mg": 73,
            "iron_mg": 1.1, "sodium_mg": 58, "potassium_mg": 466,
            "vit_c_mg": 28, "vit_a_mcg": 469, "folate_mcg": 194, "zinc_mg": 0.5,
        }
    },
    {
        "name": "Potato",
        "name_hindi": "Aloo",
        "category": "vegetables",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 97, "protein_g": 1.6, "fat_g": 0.1,
            "carb_g": 22.6, "fiber_g": 0.4, "calcium_mg": 10,
            "iron_mg": 0.5, "sodium_mg": 5, "potassium_mg": 247,
            "vit_c_mg": 17, "vit_a_mcg": 0, "folate_mcg": 18, "zinc_mg": 0.3,
        }
    },
    {
        "name": "Tomato",
        "name_hindi": "Tamatar",
        "category": "vegetables",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 20, "protein_g": 0.9, "fat_g": 0.2,
            "carb_g": 3.6, "fiber_g": 0.8, "calcium_mg": 20,
            "iron_mg": 0.4, "sodium_mg": 5, "potassium_mg": 237,
            "vit_c_mg": 27, "vit_a_mcg": 42, "folate_mcg": 15, "zinc_mg": 0.2,
        }
    },
    {
        "name": "Onion",
        "name_hindi": "Pyaaz",
        "category": "vegetables",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 50, "protein_g": 1.2, "fat_g": 0.1,
            "carb_g": 11.1, "fiber_g": 0.6, "calcium_mg": 46,
            "iron_mg": 0.6, "sodium_mg": 4, "potassium_mg": 166,
            "vit_c_mg": 11, "vit_a_mcg": 0, "folate_mcg": 19, "zinc_mg": 0.2,
        }
    },
    {
        "name": "Bitter Gourd (Karela)",
        "name_hindi": "Karela",
        "category": "vegetables",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 25, "protein_g": 1.6, "fat_g": 0.2,
            "carb_g": 4.3, "fiber_g": 2.8, "calcium_mg": 20,
            "iron_mg": 1.8, "sodium_mg": 5, "potassium_mg": 296,
            "vit_c_mg": 88, "vit_a_mcg": 21, "folate_mcg": 72, "zinc_mg": 0.8,
        }
    },
    {
        "name": "Drumstick (Moringa)",
        "name_hindi": "Sahjan",
        "category": "vegetables",
        "food_type": FoodType.raw,
        "region": "South India",
        "nutrients": {
            "energy_kcal": 26, "protein_g": 2.5, "fat_g": 0.1,
            "carb_g": 3.7, "fiber_g": 4.8, "calcium_mg": 30,
            "iron_mg": 5.3, "sodium_mg": 42, "potassium_mg": 461,
            "vit_c_mg": 141, "vit_a_mcg": 74, "folate_mcg": 45, "zinc_mg": 0.6,
        }
    },
    {
        "name": "Brinjal (Eggplant)",
        "name_hindi": "Baingan",
        "category": "vegetables",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 24, "protein_g": 1.4, "fat_g": 0.3,
            "carb_g": 4.0, "fiber_g": 1.3, "calcium_mg": 18,
            "iron_mg": 0.4, "sodium_mg": 3, "potassium_mg": 229,
            "vit_c_mg": 12, "vit_a_mcg": 1, "folate_mcg": 22, "zinc_mg": 0.2,
        }
    },

    # ── Fruits ──
    {
        "name": "Mango (Ripe)",
        "name_hindi": "Aam",
        "category": "fruits",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 70, "protein_g": 0.6, "fat_g": 0.4,
            "carb_g": 16.9, "fiber_g": 1.8, "calcium_mg": 14,
            "iron_mg": 1.3, "sodium_mg": 3, "potassium_mg": 156,
            "vit_c_mg": 16, "vit_a_mcg": 765, "folate_mcg": 14, "zinc_mg": 0.1,
        }
    },
    {
        "name": "Banana",
        "name_hindi": "Kela",
        "category": "fruits",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 116, "protein_g": 1.2, "fat_g": 0.3,
            "carb_g": 27.2, "fiber_g": 0.4, "calcium_mg": 17,
            "iron_mg": 0.9, "sodium_mg": 36, "potassium_mg": 88,
            "vit_c_mg": 7, "vit_a_mcg": 34, "folate_mcg": 20, "zinc_mg": 0.2,
        }
    },
    {
        "name": "Guava",
        "name_hindi": "Amrood",
        "category": "fruits",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 51, "protein_g": 0.9, "fat_g": 0.3,
            "carb_g": 11.2, "fiber_g": 5.4, "calcium_mg": 10,
            "iron_mg": 0.3, "sodium_mg": 2, "potassium_mg": 284,
            "vit_c_mg": 212, "vit_a_mcg": 31, "folate_mcg": 49, "zinc_mg": 0.2,
        }
    },
    {
        "name": "Papaya",
        "name_hindi": "Papita",
        "category": "fruits",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 32, "protein_g": 0.6, "fat_g": 0.1,
            "carb_g": 7.2, "fiber_g": 0.8, "calcium_mg": 17,
            "iron_mg": 0.5, "sodium_mg": 6, "potassium_mg": 69,
            "vit_c_mg": 57, "vit_a_mcg": 328, "folate_mcg": 37, "zinc_mg": 0.1,
        }
    },

    # ── Dairy & Eggs ──
    {
        "name": "Whole Milk (Buffalo)",
        "name_hindi": "Bhains ka Doodh",
        "category": "dairy-eggs",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 117, "protein_g": 4.3, "fat_g": 8.0,
            "carb_g": 4.5, "fiber_g": 0, "calcium_mg": 210,
            "iron_mg": 0.2, "sodium_mg": 37, "potassium_mg": 178,
            "vit_c_mg": 1, "vit_a_mcg": 53, "folate_mcg": 7, "zinc_mg": 0.5,
        }
    },
    {
        "name": "Curd (Dahi)",
        "name_hindi": "Dahi",
        "category": "dairy-eggs",
        "food_type": FoodType.processed,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 60, "protein_g": 3.1, "fat_g": 4.0,
            "carb_g": 3.0, "fiber_g": 0, "calcium_mg": 149,
            "iron_mg": 0.2, "sodium_mg": 36, "potassium_mg": 141,
            "vit_c_mg": 1, "vit_a_mcg": 31, "folate_mcg": 11, "zinc_mg": 0.5,
        }
    },
    {
        "name": "Paneer",
        "name_hindi": "Paneer",
        "category": "dairy-eggs",
        "food_type": FoodType.processed,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 265, "protein_g": 18.3, "fat_g": 20.8,
            "carb_g": 1.2, "fiber_g": 0, "calcium_mg": 208,
            "iron_mg": 0.2, "sodium_mg": 30, "potassium_mg": 98,
            "vit_c_mg": 0, "vit_a_mcg": 78, "folate_mcg": 10, "zinc_mg": 1.0,
        }
    },
    {
        "name": "Hen Egg (Whole)",
        "name_hindi": "Anda",
        "category": "dairy-eggs",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 173, "protein_g": 13.3, "fat_g": 13.3,
            "carb_g": 0, "fiber_g": 0, "calcium_mg": 60,
            "iron_mg": 2.1, "sodium_mg": 129, "potassium_mg": 120,
            "vit_c_mg": 0, "vit_a_mcg": 182, "folate_mcg": 47, "zinc_mg": 1.0,
        }
    },

    # ── Meat & Fish ──
    {
        "name": "Chicken (Breast, Raw)",
        "name_hindi": "Murgh",
        "category": "meat-fish",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 110, "protein_g": 22.5, "fat_g": 2.0,
            "carb_g": 0, "fiber_g": 0, "calcium_mg": 11,
            "iron_mg": 0.7, "sodium_mg": 74, "potassium_mg": 256,
            "vit_c_mg": 0, "vit_a_mcg": 6, "folate_mcg": 4, "zinc_mg": 0.9,
        }
    },
    {
        "name": "Rohu Fish",
        "name_hindi": "Rohu",
        "category": "meat-fish",
        "food_type": FoodType.raw,
        "region": "East India",
        "nutrients": {
            "energy_kcal": 97, "protein_g": 16.6, "fat_g": 3.4,
            "carb_g": 0, "fiber_g": 0, "calcium_mg": 650,
            "iron_mg": 1.0, "sodium_mg": 70, "potassium_mg": 275,
            "vit_c_mg": 0, "vit_a_mcg": 15, "folate_mcg": 10, "zinc_mg": 0.8,
        }
    },

    # ── Fats & Oils ──
    {
        "name": "Ghee",
        "name_hindi": "Ghee",
        "category": "fats-oils",
        "food_type": FoodType.processed,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 900, "protein_g": 0, "fat_g": 99.5,
            "carb_g": 0, "fiber_g": 0, "calcium_mg": 1,
            "iron_mg": 0, "sodium_mg": 2, "potassium_mg": 5,
            "vit_c_mg": 0, "vit_a_mcg": 600, "folate_mcg": 0, "zinc_mg": 0,
        }
    },
    {
        "name": "Mustard Oil",
        "name_hindi": "Sarson ka Tel",
        "category": "fats-oils",
        "food_type": FoodType.raw,
        "region": "North India",
        "nutrients": {
            "energy_kcal": 900, "protein_g": 0, "fat_g": 100.0,
            "carb_g": 0, "fiber_g": 0, "calcium_mg": 0,
            "iron_mg": 0, "sodium_mg": 0, "potassium_mg": 0,
            "vit_c_mg": 0, "vit_a_mcg": 0, "folate_mcg": 0, "zinc_mg": 0,
        }
    },
    {
        "name": "Coconut Oil",
        "name_hindi": "Nariyal ka Tel",
        "category": "fats-oils",
        "food_type": FoodType.raw,
        "region": "South India",
        "nutrients": {
            "energy_kcal": 900, "protein_g": 0, "fat_g": 100.0,
            "carb_g": 0, "fiber_g": 0, "calcium_mg": 0,
            "iron_mg": 0, "sodium_mg": 0, "potassium_mg": 0,
            "vit_c_mg": 0, "vit_a_mcg": 0, "folate_mcg": 0, "zinc_mg": 0,
        }
    },

    # ── Nuts & Seeds ──
    {
        "name": "Almonds",
        "name_hindi": "Badam",
        "category": "nuts-seeds",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 655, "protein_g": 20.8, "fat_g": 58.9,
            "carb_g": 10.5, "fiber_g": 3.9, "calcium_mg": 230,
            "iron_mg": 5.1, "sodium_mg": 14, "potassium_mg": 835,
            "vit_c_mg": 0, "vit_a_mcg": 0, "folate_mcg": 58, "zinc_mg": 3.2,
        }
    },
    {
        "name": "Groundnut (Peanut)",
        "name_hindi": "Moongfali",
        "category": "nuts-seeds",
        "food_type": FoodType.raw,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 567, "protein_g": 25.3, "fat_g": 49.2,
            "carb_g": 16.1, "fiber_g": 8.5, "calcium_mg": 92,
            "iron_mg": 4.6, "sodium_mg": 18, "potassium_mg": 705,
            "vit_c_mg": 0, "vit_a_mcg": 0, "folate_mcg": 240, "zinc_mg": 3.3,
        }
    },

    # ── Prepared Foods ──
    {
        "name": "Idli (Plain)",
        "name_hindi": "Idli",
        "category": "prepared-foods",
        "food_type": FoodType.cooked,
        "region": "South India",
        "nutrients": {
            "energy_kcal": 132, "protein_g": 3.4, "fat_g": 0.3,
            "carb_g": 28.0, "fiber_g": 0.6, "calcium_mg": 14,
            "iron_mg": 0.7, "sodium_mg": 180, "potassium_mg": 85,
            "vit_c_mg": 0, "vit_a_mcg": 0, "folate_mcg": 11, "zinc_mg": 0.4,
        }
    },
    {
        "name": "Chapati (Whole Wheat)",
        "name_hindi": "Roti / Chapati",
        "category": "prepared-foods",
        "food_type": FoodType.cooked,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 264, "protein_g": 7.9, "fat_g": 3.7,
            "carb_g": 52.9, "fiber_g": 1.9, "calcium_mg": 60,
            "iron_mg": 4.0, "sodium_mg": 290, "potassium_mg": 180,
            "vit_c_mg": 0, "vit_a_mcg": 0, "folate_mcg": 18, "zinc_mg": 1.5,
        }
    },
    {
        "name": "Dal Tadka",
        "name_hindi": "Dal Tadka",
        "category": "prepared-foods",
        "food_type": FoodType.cooked,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 120, "protein_g": 7.0, "fat_g": 4.5,
            "carb_g": 14.0, "fiber_g": 3.5, "calcium_mg": 38,
            "iron_mg": 2.5, "sodium_mg": 380, "potassium_mg": 310,
            "vit_c_mg": 3, "vit_a_mcg": 25, "folate_mcg": 55, "zinc_mg": 1.0,
        }
    },
    {
        "name": "Sambar",
        "name_hindi": "Sambar",
        "category": "prepared-foods",
        "food_type": FoodType.cooked,
        "region": "South India",
        "nutrients": {
            "energy_kcal": 55, "protein_g": 3.0, "fat_g": 1.5,
            "carb_g": 7.5, "fiber_g": 2.0, "calcium_mg": 35,
            "iron_mg": 1.5, "sodium_mg": 420, "potassium_mg": 210,
            "vit_c_mg": 10, "vit_a_mcg": 30, "folate_mcg": 40, "zinc_mg": 0.5,
        }
    },
    {
        "name": "Poha (Flattened Rice)",
        "name_hindi": "Poha",
        "category": "prepared-foods",
        "food_type": FoodType.cooked,
        "region": "Central India",
        "nutrients": {
            "energy_kcal": 180, "protein_g": 3.0, "fat_g": 5.0,
            "carb_g": 30.0, "fiber_g": 1.0, "calcium_mg": 20,
            "iron_mg": 1.8, "sodium_mg": 310, "potassium_mg": 120,
            "vit_c_mg": 5, "vit_a_mcg": 0, "folate_mcg": 10, "zinc_mg": 0.4,
        }
    },

    # ── Beverages ──
    {
        "name": "Masala Chai (with milk & sugar)",
        "name_hindi": "Masala Chai",
        "category": "beverages",
        "food_type": FoodType.beverage,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 55, "protein_g": 1.5, "fat_g": 1.8,
            "carb_g": 8.3, "fiber_g": 0, "calcium_mg": 52,
            "iron_mg": 0.2, "sodium_mg": 20, "potassium_mg": 80,
            "vit_c_mg": 0, "vit_a_mcg": 15, "folate_mcg": 3, "zinc_mg": 0.1,
        }
    },
    {
        "name": "Coconut Water",
        "name_hindi": "Nariyal Paani",
        "category": "beverages",
        "food_type": FoodType.beverage,
        "region": "South India",
        "nutrients": {
            "energy_kcal": 19, "protein_g": 0.7, "fat_g": 0.2,
            "carb_g": 3.7, "fiber_g": 1.1, "calcium_mg": 24,
            "iron_mg": 0.3, "sodium_mg": 105, "potassium_mg": 250,
            "vit_c_mg": 2, "vit_a_mcg": 0, "folate_mcg": 3, "zinc_mg": 0.1,
        }
    },

    # ── Sweets & Snacks ──
    {
        "name": "Jalebi",
        "name_hindi": "Jalebi",
        "category": "sweets-snacks",
        "food_type": FoodType.cooked,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 387, "protein_g": 2.0, "fat_g": 16.0,
            "carb_g": 60.0, "fiber_g": 0.3, "calcium_mg": 22,
            "iron_mg": 1.5, "sodium_mg": 15, "potassium_mg": 45,
            "vit_c_mg": 0, "vit_a_mcg": 0, "folate_mcg": 5, "zinc_mg": 0.2,
        }
    },
    {
        "name": "Khichdi (Rice & Moong)",
        "name_hindi": "Khichdi",
        "category": "prepared-foods",
        "food_type": FoodType.cooked,
        "region": "Pan-India",
        "nutrients": {
            "energy_kcal": 124, "protein_g": 4.5, "fat_g": 2.5,
            "carb_g": 21.5, "fiber_g": 1.5, "calcium_mg": 28,
            "iron_mg": 1.2, "sodium_mg": 260, "potassium_mg": 180,
            "vit_c_mg": 0, "vit_a_mcg": 5, "folate_mcg": 25, "zinc_mg": 0.7,
        }
    },
]

NUTRIENT_UNITS = {
    "energy_kcal": "kcal",
    "protein_g": "g",
    "fat_g": "g",
    "carb_g": "g",
    "fiber_g": "g",
    "calcium_mg": "mg",
    "iron_mg": "mg",
    "sodium_mg": "mg",
    "potassium_mg": "mg",
    "vit_c_mg": "mg",
    "vit_a_mcg": "mcg",
    "folate_mcg": "mcg",
    "zinc_mg": "mg",
}


def seed():
    db = SessionLocal()
    try:
        # Skip if already seeded
        if db.query(FoodCategory).count() > 0:
            print("✓ Database already seeded. Skipping.")
            return

        print("Seeding categories...")
        category_map = {}
        for cat in CATEGORIES:
            obj = FoodCategory(**cat)
            db.add(obj)
            db.flush()
            category_map[cat["slug"]] = obj
        print(f"  ✓ {len(CATEGORIES)} categories created")

        print("Seeding foods...")
        for f in FOODS:
            nutrients = f.pop("nutrients")
            cat_slug = f.pop("category")
            food_obj = Food(**f, category=category_map[cat_slug])
            db.add(food_obj)
            db.flush()

            for nutrient_name, value in nutrients.items():
                db.add(FoodNutrient(
                    food=food_obj,
                    nutrient_name=nutrient_name,
                    value=value,
                    unit=NUTRIENT_UNITS[nutrient_name],
                ))

        db.commit()
        print(f"  ✓ {len(FOODS)} foods seeded with full nutrient profiles")
        print("\n✅ Seeding complete!")

    except Exception as e:
        db.rollback()
        print(f"❌ Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()