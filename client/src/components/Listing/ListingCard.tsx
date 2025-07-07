import { Star, MapPin, Bed, Bath } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Listing } from '../../types/api'
import { formatPrice } from '../../lib/utils'

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link to={`/listing/${listing.id}`} className="group">
      <div className="card hover:shadow-lg transition-shadow duration-200">
        {/* Image placeholder */}
        <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">
              {listing.title.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <button className="p-1 rounded-full bg-white/80 hover:bg-white transition-colors">
              <Star className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {listing.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 fill-current text-yellow-400 mr-1" />
              <span>4.8</span>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="line-clamp-1">{listing.location}, {listing.country}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-3">
            <span className="capitalize">{listing.type}</span>
            <span className="mx-2">•</span>
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{listing.bedrooms} bed</span>
            </div>
            <span className="mx-2">•</span>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{listing.bathrooms} bath</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-gray-900">{formatPrice(listing.price)}</span>
              <span className="text-sm text-gray-600"> / night</span>
            </div>
            <div className="text-sm text-gray-600">
              {listing.amenities.length} amenities
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 