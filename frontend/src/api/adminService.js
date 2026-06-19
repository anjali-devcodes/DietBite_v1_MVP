import api from './axios'

export const adminService = {
  getUsers: (skip = 0, limit = 50) =>
    api.get(`/admin/users?skip=${skip}&limit=${limit}`),

  getUser: (id) => api.get(`/admin/users/${id}`),

  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),

  deleteUser: (id) => api.delete(`/admin/users/${id}`),
}