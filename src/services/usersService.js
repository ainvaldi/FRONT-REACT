import api from "./api";

const usersService = {
    list: () => api.get('usuarios'),
    get: (id) => api.get(`usuarios/${id}`),
    create: (payload) => api.post('usuarios', payload),
    update: (id, payload) => api.put(`usuarios/${id}`, payload),
    remove: (id) => api.delete(`usuarios/${id}`),
    updateRole: (id, rol) => api.put(`usuarios/${id}/rol`, { rol })
}

export default usersService