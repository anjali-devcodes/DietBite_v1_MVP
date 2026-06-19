import api from './axios'

export const patientService = {
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== '' && v != null))
    ).toString()
    return api.get(`/patients?${query}`)
  },

  getById: (id) => api.get(`/patients/${id}`),

  create: (data) => api.post('/patients', data),

  update: (id, data) => api.patch(`/patients/${id}`, data),

  remove: (id) => api.delete(`/patients/${id}`),

  addMeasurement: (id, data) => api.post(`/patients/${id}/measurements`, data),

  getMeasurements: (id) => api.get(`/patients/${id}/measurements`),
}