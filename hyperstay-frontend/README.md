# HyperStay Frontend

A modern Airbnb-like home booking application built with React, TypeScript, and Tailwind CSS.

## Features

### 🏠 Property Management
- Browse available properties with detailed information
- Search and filter properties by location
- View property details including amenities, pricing, and availability
- Responsive property cards with beautiful UI

### 🔐 Authentication
- User registration with role selection (Guest/Host)
- Secure login/logout functionality
- Protected routes for authenticated users
- JWT token-based authentication

### 📅 Booking System
- Real-time booking with date selection
- Price calculation based on stay duration
- Booking confirmation and management
- View booking history and status

### 👨‍💼 Host Dashboard
- Add new properties with detailed forms
- Manage property listings
- View booking statistics
- Property amenities management

### 🎨 Modern UI/UX
- Responsive design for all devices
- Beautiful animations and transitions
- Intuitive navigation
- Loading states and error handling

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context + TanStack Query
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Backend server running (see hyperstay-backend)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hyperstay-frontend
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Environment Setup

Make sure your backend server is running on `http://localhost:3000` or update the API base URL in `src/lib/api.ts`.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Header, Layout)
│   └── Listing/        # Listing-related components
├── contexts/           # React contexts (AuthContext)
├── lib/               # Utility libraries (API client, utils)
├── pages/             # Page components
├── types/             # TypeScript type definitions
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## Key Components

### Authentication
- `AuthContext`: Manages user authentication state
- `LoginPage`: User login form
- `SignupPage`: User registration with role selection

### Property Management
- `HomePage`: Main landing page with property grid
- `ListingCard`: Individual property display card
- `ListingGrid`: Grid layout for multiple properties
- `ListingDetailPage`: Detailed property view with booking

### Host Features
- `HostDashboardPage`: Host dashboard for property management
- Property creation form with amenities management

### User Features
- `BookingsPage`: User booking history and management

## API Integration

The application integrates with the HyperStay backend API:

- **Authentication**: `/auth` endpoints for login/signup
- **Properties**: `/hotels` endpoints for listing management
- **Bookings**: `/bookings` endpoints for reservation system
- **Reviews**: `/reviews` endpoints for property reviews

## Styling

The application uses Tailwind CSS with custom components:

- `.btn-primary`: Primary button styling
- `.btn-secondary`: Secondary button styling
- `.input-field`: Form input styling
- `.card`: Card component styling
- `.line-clamp-*`: Text truncation utilities

## Development

### Available Scripts

- `bun run dev`: Start development server
- `bun run build`: Build for production
- `bun run preview`: Preview production build
- `bun run lint`: Run ESLint

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Consistent naming conventions
- Responsive design patterns
- Error boundary implementation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
