# HyperStay - Full-Stack Airbnb Clone

HyperStay is a modern, full-stack home booking application that replicates the core functionalities of platforms like Airbnb. It features a React-based frontend for a dynamic user experience and a robust Express.js backend for handling data, authentication, and business logic.

<br/>

<br/>

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **🏠 Property Discovery & Booking:**
  - Browse and filter a grid of available properties.
  - View detailed property pages with amenities, descriptions, and location.
  - Real-time booking calendar to check availability and select dates.
- **🔐 Secure User Authentication:**
  - Role-based user registration (Guest vs. Host).
  - JWT-powered login/logout functionality.
  - Protected routes and actions based on user role and ownership.
- **👤 User & Guest Experience:**
  - View personal booking history and status.
  - Leave reviews and ratings for completed stays.
- **👨‍💼 Host Dashboard:**
  - Create, view, and manage property listings.
  - View incoming bookings for owned properties.
- **🎨 Modern & Responsive UI:**
  - Clean and intuitive user interface built with Tailwind CSS.
  - Fully responsive design for seamless use on desktop and mobile devices.

## Tech Stack

### Frontend (`client/`)

- **Framework:** React 19 (with Hooks)
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v7
- **State Management:** React Context & TanStack Query v5
- **HTTP Client:** Axios
- **UI Components:** `react-day-picker`, `lucide-react` for icons

### Backend (`server/`)

- **Framework:** Express.js
- **Language:** TypeScript
- **Runtime:** Bun
- **Database ORM:** Prisma
- **Database:** SQLite
- **Authentication:** JWT (jsonwebtoken), bcryptjs for password hashing
- **Validation:** Zod for schema validation
- **Testing:** Vitest

## Project Structure

```
ninet33n19-hyprstay/
├── client/         # React Frontend Application
│   ├── src/
│   └── package.json
└── server/         # Express.js Backend API
    ├── src/
    ├── prisma/
    └── package.json
```

- **`client/`**: Contains the complete frontend code, built as a standard Vite-React-TS application.
- **`server/`**: Contains the backend API, database schema (Prisma), routes, controllers, and services.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js v18+ and npm/yarn)
- [Git](https://git-scm.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ninet33n19/hyprstay.git
    cd ninet33n19-hyprstay
    ```

2.  **Setup the Backend (`server/`):**

    ```bash
    # Navigate to the server directory
    cd server
    
    # Install dependencies
    bun install
    
    # Create a .env file for environment variables.
    # You can copy the example if one exists, or create a new file.
    # Add the following content to a new '.env' file:
    ```
    ```env
    # The database URL points to the SQLite file.
    DATABASE_URL="file:./prisma/dev.db"
    
    # A secure secret for signing JWTs.
    JWT_SECRET="your-super-secret-key-for-jwt"
    
    # Port for the backend server. The client expects 3000.
    PORT=3000
    ```
    ```bash
    # Run database migrations to set up the schema and tables
    bunx prisma migrate dev
    
    # Start the backend development server
    bun run dev
    ```
    The server will now be running on `http://localhost:3000`.

3.  **Setup the Frontend (`client/`):**

    Open a **new terminal window** and navigate to the root of the project.

    ```bash
    # Navigate to the client directory
    cd client
    
    # Install dependencies
    bun install
    
    # Start the frontend development server
    bun run dev
    ```
    The client will now be running on `http://localhost:5173`.

4.  **Access the Application:**
    - Open your browser and navigate to `http://localhost:5173`.
    - You can now sign up as a "Host" to create listings or as a "Guest" to browse and book.

## API Endpoints

The backend exposes a RESTful API. Here are the primary endpoints:

| Method | Endpoint                       | Description                                | Auth Required | Role       |
| :----- | :----------------------------- | :----------------------------------------- | :------------ | :--------- |
| `POST` | `/auth/signup`                 | Register a new user (guest or host)        | No            | -          |
| `POST` | `/auth/login`                  | Log in a user and receive a JWT            | No            | -          |
| `GET`  | `/auth/me`                     | Get the current authenticated user's profile | Yes           | Any        |
| `GET`  | `/hotels`                      | Get all property listings                  | No            | -          |
| `POST` | `/hotels`                      | Create a new property listing              | Yes           | `host`     |
| `GET`  | `/hotels/:id/booked-dates`     | Get booked dates for a specific listing    | No            | -          |
| `POST` | `/bookings`                    | Create a new booking                       | Yes           | Any        |
| `GET`  | `/bookings`                    | Get all bookings for the current user      | Yes           | Any        |
| `POST` | `/reviews`                     | Create a review for a listing              | Yes           | `guest`    |
| `GET`  | `/reviews/:listingId`          | Get all reviews for a specific listing     | No            | -          |

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is licensed under the MIT License.
