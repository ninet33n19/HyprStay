import { useAuth } from '../contexts/AuthContext'
import { listingsAPI } from '../lib/api'

export function DebugAuth() {
  const { user, loading, login, logout } = useAuth()

  const testCreateProperty = async () => {
    if (!user) {
      alert('Please login first')
      return
    }

    try {
      console.log('Testing property creation...')
      const result = await listingsAPI.create({
        title: 'Test Property',
        description: 'A test property created via debug',
        type: 'entire',
        location: 'Test City',
        country: 'Test Country',
        price: 100,
        bedrooms: 2,
        bathrooms: 1,
        amenities: ['WiFi', 'Kitchen'],
        ownerId: user.id,
      })
      console.log('Property created successfully:', result)
      alert('Test property created successfully!')
    } catch (error: any) {
      console.error('Error creating test property:', error)
      alert(`Error: ${error.response?.data?.message || error.message}`)
    }
  }

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>User: {user ? `${user.name} (${user.role})` : 'null'}</div>
      <div>Token: {localStorage.getItem('token') ? 'exists' : 'missing'}</div>
      <div className="mt-3 space-y-1">
        <button
          onClick={testCreateProperty}
          className="w-full bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
        >
          Test Create Property
        </button>
        <button
          onClick={() => login('host@example.com', 'password123')}
          className="w-full bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs"
        >
          Login as Host
        </button>
        <button
          onClick={logout}
          className="w-full bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
        >
          Logout
        </button>
      </div>
    </div>
  )
} 