import api from './axios'

export const mealPlanService = {
  create: (data) => api.post('/meal-plans', data),

  listByPatient: (patientId, params = {}) => {
    const query = new URLSearchParams(params).toString()
    return api.get(`/meal-plans/by-patient/${patientId}?${query}`)
  },

  getById: (planId) => api.get(`/meal-plans/${planId}`),

  update: (planId, data) => api.patch(`/meal-plans/${planId}`, data),

  remove: (planId) => api.delete(`/meal-plans/${planId}`),

  addDay: (planId, data) => api.post(`/meal-plans/${planId}/days`, data),

  removeDay: (dayId) => api.delete(`/meal-plans/days/${dayId}`),

  addItem: (dayId, data) => api.post(`/meal-plans/days/${dayId}/items`, data),

  removeItem: (itemId) => api.delete(`/meal-plans/items/${itemId}`),
}