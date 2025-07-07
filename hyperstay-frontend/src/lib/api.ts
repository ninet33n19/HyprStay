import axios from 'axios'
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  Listing,
  CreateListingRequest,
  Booking,
  CreateBookingRequest,
  Review,
  CreateReviewRequest,
  User
} from '../types/api'

const API_BASE_URL = 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data)
    return response.data
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

// Listings API
export const listingsAPI = {
  getAll: async (): Promise<Listing[]> => {
    const response = await api.get('/hotels')
    return response.data
  },

  create: async (data: CreateListingRequest & { ownerId: string }): Promise<Listing> => {
    const response = await api.post('/hotels', data)
    return response.data
  },

  getBookedDates: async (listingId: string): Promise<{ checkIn: string; checkOut: string }[]> => {
    const response = await api.get(`/hotels/${listingId}/booked-dates`)
    return response.data
  },
}

// Bookings API
export const bookingsAPI = {
  getAll: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings')
    return response.data
  },

  create: async (data: CreateBookingRequest): Promise<Booking> => {
    const response = await api.post('/bookings', data)
    return response.data
  },
}

// Reviews API
export const reviewsAPI = {
  create: async (data: CreateReviewRequest): Promise<Review> => {
    const response = await api.post('/reviews', data)
    return response.data
  },

  getByListingId: async (listingId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/${listingId}`)
    return response.data
  },
}

export default api 