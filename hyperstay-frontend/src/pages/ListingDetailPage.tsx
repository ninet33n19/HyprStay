import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Star, 
  MapPin, 
  Bed, 
  Bath, 
  Users, 
  Check,
  Heart,
  Share2,
  ArrowLeft
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { listingsAPI, bookingsAPI, reviewsAPI } from '../lib/api'
import { formatPrice } from '../lib/utils'
import { BookingCalendar } from '../components/BookingCalendar'
import type { Listing, Review } from '../types/api'

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
    
  const [listing, setListing] = useState<Listing | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [guests, setGuests] = useState(1)
  const [error, setError] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState("")
  const [reviewSuccess, setReviewSuccess] = useState("")

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return
      
      try {
        // For now, we'll fetch all listings and find the one we need
        // In a real app, you'd have a getById endpoint
        const listings = await listingsAPI.getAll()
        const foundListing = listings.find(l => l.id === id)
        if (foundListing) {
          setListing(foundListing)
        } else {
          setError('Listing not found')
        }
      } catch (error) {
        setError('Failed to load listing')
      } finally {
        setLoading(false)
      }
    }

    const fetchReviews = async () => {
      if (!id) return
      try {
        const reviews = await reviewsAPI.getByListingId(id)
        setReviews(reviews)
      } catch (error) {
        // Optionally handle error
      }
    }

    fetchListing()
    fetchReviews()
  }, [id])

  const handleDateSelect = (from: Date, to: Date) => {
    setCheckIn(from)
    setCheckOut(to)
  }

  const handleBooking = async () => {
    if (!user || !listing || !checkIn || !checkOut) return
    
    setBookingLoading(true)
    setError('')

    try {
      const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      const totalPrice = listing.price * days

      await bookingsAPI.create({
        listingId: listing.id,
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        totalPrice,
      })

      navigate('/bookings')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error || 'Listing not found'}</p>
          <Link to="/" className="btn-primary">
            Go back home
          </Link>
        </div>
      </div>
    )
  }

  const days = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0
  const totalPrice = listing.price * days

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to search
            </Link>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="aspect-[16/9] bg-gray-200 rounded-xl mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <span className="text-white text-4xl font-semibold">
                  {listing.title.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Title and Rating */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{listing.location}, {listing.country}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-current text-yellow-400 mr-1" />
                <span className="font-medium">{reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0}</span>
                <span className="text-gray-600 ml-1">({reviews.length} reviews)</span>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this place</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center">
                  <Bed className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">{listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">{listing.bathrooms} bathroom{listing.bathrooms !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">Up to {listing.bedrooms * 2} guests</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 capitalize">{listing.type} place</span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            {listing.amenities.length > 0 && (
              <div className="bg-white rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What this place offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {listing.amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3" />
                      <span className="text-gray-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
              {reviews.length === 0 ? (
                <div className="text-gray-600 mb-4">No reviews yet. Be the first to leave a review!</div>
              ) : (
                <div className="space-y-4 mb-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center mb-1">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-medium text-gray-900">{review.rating}</span>
                        <span className="text-gray-600 ml-2 text-sm">{review.guest?.name || 'Guest'}</span>
                      </div>
                      <div className="text-gray-700 text-sm">{review.comment}</div>
                    </div>
                  ))}
                </div>
              )}
              {/* Leave a Review Form */}
              <div className="mt-6">
                {user ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      setReviewSubmitting(true)
                      setReviewError("")
                      setReviewSuccess("")
                      try {
                        await reviewsAPI.create({
                          listingId: listing.id,
                          rating: reviewRating,
                          comment: reviewComment,
                        })
                        setReviewSuccess("Review submitted!")
                        setReviewComment("")
                        setReviewRating(5)
                        // Refresh reviews
                        const updatedReviews = await reviewsAPI.getByListingId(listing.id)
                        setReviews(updatedReviews)
                      } catch (err: any) {
                        const msg = err.response?.data?.message || err.message || "Failed to submit review"
                        if (msg.toLowerCase().includes("forbidden") || err.response?.status === 403) {
                          setReviewError("You are not allowed to leave a review for this listing.")
                        } else {
                          setReviewError(msg)
                        }
                      } finally {
                        setReviewSubmitting(false)
                      }
                    }}
                    className="space-y-4"
                  >
                    {reviewError && <div className="text-red-600 text-sm">{reviewError}</div>}
                    {reviewSuccess && <div className="text-green-600 text-sm">{reviewSuccess}</div>}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <select
                        value={reviewRating}
                        onChange={e => setReviewRating(Number(e.target.value))}
                        className="input-field w-24"
                        required
                      >
                        {[5,4,3,2,1].map(r => (
                          <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                      <textarea
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        className="input-field"
                        rows={3}
                        required
                        maxLength={500}
                        placeholder="Share your experience..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="btn-primary disabled:opacity-50"
                    >
                      {reviewSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                ) : (
                  <div className="text-gray-600">
                    <Link to="/login" className="text-primary-600 underline">Log in</Link> to leave a review.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(listing.price)}</span>
                    <span className="text-gray-600"> / night</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-current text-yellow-400 mr-1" />
                    <span className="text-sm">4.8</span>
                  </div>
                </div>

                {!user ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">Please log in to book this property</p>
                    <Link to="/login" className="btn-primary w-full">
                      Log in to book
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }}>
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                      </div>
                    )}

                    <div className="space-y-4 mb-6">
                      <BookingCalendar
                        listingId={listing.id}
                        onDateSelect={handleDateSelect}
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Guests
                        </label>
                        <select
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          className="input-field"
                        >
                          {Array.from({ length: Math.min(listing.bedrooms * 2, 10) }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>{num} guest{num !== 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {days > 0 && (
                      <div className="border-t border-gray-200 pt-4 mb-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {formatPrice(listing.price)} × {days} night{days !== 1 ? 's' : ''}
                            </span>
                            <span className="text-gray-900">{formatPrice(totalPrice)}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>{formatPrice(totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={bookingLoading || !checkIn || !checkOut}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {bookingLoading ? 'Booking...' : 'Reserve'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 