import api from "./api";

const productService = {

    listPaged: ({ page = 1, limit = 10, q = '' }) => api.get('productos', { params: { page, limit, q } }),
    list: () => api.get('productos'),
    get: (id) => api.get(`productos/${id}`),
    create: (payload) => api.post('productos', payload),
    update: (id, payload) => api.put(`productos/${id}`, payload),
    remove: (id) => api.delete(`productos/${id}`)
}

export default productService
