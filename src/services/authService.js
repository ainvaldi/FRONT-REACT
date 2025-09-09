import api from "./api";

const authService = {
    login: (credentials) => api.post("auth/login", credentials),
    register: (data) => api.post("auth/register", data),
    forgot: (email) => api.post('auth/forgotPassword', { email }),
    reset: (data) => api.post('auth/resetPassword', data)
}

export default authService