import { useState, useEffect } from 'react'
import { Plus, Home, Calendar, DollarSign } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { listingsAPI } from '../lib/api'
import type { CreateListingRequest, Listing } from '../types/api'
import { ListingCard } from '../components/Listing/ListingCard'

export function HostDashboardPage() {
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState<CreateListingRequest>({
    title: '',
    description: '',
    type: 'entire',
    location: '',
    country: '',
    price: 0,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
  })
  const [listings, setListings] = useState<Listing[]>([])
  const [listingsLoading, setListingsLoading] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('Submitting form data:', { ...formData, ownerId: user.id })
      const result = await listingsAPI.create({
        ...formData,
        ownerId: user.id,
      })
      console.log('Listing created successfully:', result)
      setSuccess('Property created successfully!')
      setShowForm(false)
      setFormData({
        title: '',
        description: '',
        type: 'entire',
        location: '',
        country: '',
        price: 0,
        bedrooms: 1,
        bathrooms: 1,
        amenities: [],
      })
    } catch (err: any) {
      console.error('Error creating listing:', err)
      console.error('Error response:', err.response?.data)
      setError(err.response?.data?.message || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  const addAmenity = () => {
    const amenity = prompt('Enter amenity name:')
    if (amenity && amenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity.trim()]
      }))
    }
  }

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }))
  }

  useEffect(() => {
    if (!user) return
    setListingsLoading(true)
    listingsAPI.getAll().then((data) => {
      setListings(data.filter((l) => l.ownerId === user.id))
    }).finally(() => setListingsLoading(false))
  }, [user, success])

  if (!user || user.role !== 'host') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need to be a host to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your properties and bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Home className="w-8 h-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{listingsLoading ? '...' : listings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">$0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Listing Button */}
        {!showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                {success}
              </div>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Property
            </button>
          </div>
        )}

        {/* Add Listing Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Property</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="input-field"
                  >
                    <option value="entire">Entire place</option>
                    <option value="private">Private room</option>
                    <option value="shared">Shared room</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Night ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: Number(e.target.value) }))}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: Number(e.target.value) }))}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <div className="space-y-2">
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <span className="flex-1 text-sm text-gray-700">{amenity}</span>
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAmenity}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    + Add amenity
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Property'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Host's Properties List */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Properties</h2>
          {listingsLoading ? (
            <div>Loading...</div>
          ) : listings.length === 0 ? (
            <div className="text-gray-600">No properties found. Add your first property!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 