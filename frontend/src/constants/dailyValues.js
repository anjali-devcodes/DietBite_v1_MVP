// Approximate daily reference values for an average adult (ICMR-NIN guidelines)
export const DAILY_VALUES = {
  energy_kcal: 2000,
  protein_g: 60,
  fat_g: 65,
  carb_g: 275,
  fiber_g: 30,
  calcium_mg: 1000,
  iron_mg: 17,
  sodium_mg: 2000,
  potassium_mg: 3500,
  vit_c_mg: 80,
  vit_a_mcg: 800,
  folate_mcg: 300,
  zinc_mg: 12,
}

export const NUTRIENT_META = {
  energy_kcal: { label: 'Energy', icon: '🔥' },
  protein_g: { label: 'Protein', icon: '💪' },
  fat_g: { label: 'Fat', icon: '🥑' },
  carb_g: { label: 'Carbohydrates', icon: '🍚' },
  fiber_g: { label: 'Fiber', icon: '🌾' },
  calcium_mg: { label: 'Calcium', icon: '🦴' },
  iron_mg: { label: 'Iron', icon: '⚙️' },
  sodium_mg: { label: 'Sodium', icon: '🧂' },
  potassium_mg: { label: 'Potassium', icon: '🍌' },
  vit_c_mg: { label: 'Vitamin C', icon: '🍊' },
  vit_a_mcg: { label: 'Vitamin A', icon: '👁️' },
  folate_mcg: { label: 'Folate', icon: '🌿' },
  zinc_mg: { label: 'Zinc', icon: '🔩' },
}

export const MACRO_KEYS = ['energy_kcal', 'protein_g', 'fat_g', 'carb_g', 'fiber_g']