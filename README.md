# PlayGrid — Backend

Backend API for **PlayGrid**, a sports venue and turf booking platform. It provides authentication, venue and turf management, booking functionality, and administrative catalog management.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL (Neon)
- Prisma ORM
- Zod for validation
- Pino for logging

## Features

- User authentication and role-based authorization
- Player, owner, and admin roles
- Venue and turf management
- Sports and amenities catalog management
- Booking management
- Owner dashboard APIs
- PostgreSQL database integration using Prisma
- Request validation and structured logging

## Getting Started

### Prerequisites

- Node.js
- npm
- A PostgreSQL database, such as Neon

### Installation

```bash
git clone https://github.com/rk4-logic/playgrid-server.git
cd playgrid-server
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your_postgresql_connection_string"
```

Configure any additional environment variables required by the application, including authentication secrets.

**Never commit your `.env` file or expose database credentials.**

### Database Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Apply existing migrations:

```bash
npx prisma migrate deploy
```

To populate the database with demo data, configure and run the seed script as documented in the project setup.

### Run the Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Type Check

```bash
npm run type-check
```

## API Overview

The backend supports the following functional areas:

- Authentication and user management
- Venue and turf management
- Sports and amenities catalog
- Booking management
- Owner dashboard

Refer to the source code for the currently implemented routes and endpoint details.

## Project Status

Core backend modules are under active development. Final integration testing, demo data setup, and deployment preparation may still be in progress.

## License

No license has been specified yet.
