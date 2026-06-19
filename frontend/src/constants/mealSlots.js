export const MEAL_SLOTS = [
  { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { value: 'mid_morning', label: 'Mid-Morning', icon: '☀️' },
  { value: 'lunch', label: 'Lunch', icon: '🍱' },
  { value: 'evening_snack', label: 'Evening Snack', icon: '🍵' },
  { value: 'dinner', label: 'Dinner', icon: '🌙' },
  { value: 'bedtime', label: 'Bedtime', icon: '🛏️' },
]

export const MEAL_SLOT_MAP = Object.fromEntries(MEAL_SLOTS.map((s) => [s.value, s]))