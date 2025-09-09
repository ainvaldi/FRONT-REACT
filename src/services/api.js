import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 10000
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error?.response?.status

        if (status === 401) {
            localStorage.removeItem('token')
        }

        console.error("Api error:", error?.response?.data || error.message)
        return Promise.reject(error)
    }
)

export default api