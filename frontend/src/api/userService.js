import api from './axios'

export const userService = {
  getProfile: () => api.get('/users/me'),

  updateProfile: (data) => api.patch('/users/me', data),

  changePassword: (data) => api.patch('/users/me/password', data),
}