import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { ListingGrid } from '../components/Listing/ListingGrid'
import { listingsAPI } from '../lib/api'
import type { Listing } from '../types/api'

export function HomePage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await listingsAPI.getAll()
        setListings(data)
      } catch (error) {
        console.error('Failed to fetch listings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find your perfect stay
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Discover unique places to stay and connect with hosts around the world
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-2 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Where do you want to go?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                  <button className="btn-primary ml-2">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Properties
            </h2>
            <div className="text-sm text-gray-600">
              {filteredListings.length} properties available
            </div>
          </div>
          
          <ListingGrid listings={filteredListings} loading={loading} />
        </div>
      </section>
    </div>
  )
} 