export interface User {
  id: string
  name: string
  email: string
  role: 'guest' | 'host'
  createdAt: string
  updatedAt: string
}

export interface Amenity {
  id: string
  name: string
  listingId: string
}

export interface Listing {
  id: string
  title: string
  description: string
  type: 'entire' | 'private' | 'shared'
  location: string
  country: string
  price: number
  bedrooms: number
  bathrooms: number
  ownerId: string
  createdAt: string
  amenities: Amenity[]
  owner?: User
}

export interface Room {
  id: string
  name: string
  description: string
  price: number
  capacity: number
  listingId: string
  createdAt: string
}

export interface Booking {
  id: string
  listingId: string
  guestId: string
  checkIn: string
  checkOut: string
  totalPrice: number
  isBooked: boolean
  cancelledAt?: string
  createdAt: string
  listing?: Listing
  guest?: User
}

export interface Payment {
  id: string
  bookingId: string
  amount: number
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'
  method: string
  createdAt: string
}

export interface Review {
  id: string
  listingId: string
  guestId: string
  rating: number
  comment?: string
  createdAt: string
  guest?: User
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
  role: 'guest' | 'host'
}

export interface CreateListingRequest {
  title: string
  description: string
  type: 'entire' | 'private' | 'shared'
  location: string
  country: string
  price: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
}

export interface CreateBookingRequest {
  listingId: string
  checkIn: string
  checkOut: string
  totalPrice: number
}

export interface CreateReviewRequest {
  listingId: string
  rating: number
  comment?: string
} 