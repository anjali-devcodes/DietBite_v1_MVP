import api from './axios'

export const foodService = {
  search: (params) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== '' && v != null))
    ).toString()
    return api.get(`/foods/search?${query}`)
  },

  getCategories: () => api.get('/foods/categories'),

  getFoodById: (id) => api.get(`/foods/${id}`),

  getNutrients: (id) => api.get(`/foods/${id}/nutrients`),

  calculate: (items) => api.post('/foods/calculate', { items }),
}