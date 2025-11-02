# Portfolio Manager Backend

Express + GraphQL + Prisma + PostgreSQL backend API for the Portfolio Manager application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Setup database:
```bash
# Create PostgreSQL database
createdb portfolio_manager

# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Seed database (optional)
npm run prisma:seed
```

4. Start server:
```bash
npm run dev
```

## API Endpoints

- GraphQL: `http://localhost:4000/graphql`
- Health Check: `http://localhost:4000/health`

## Database Schema

The Prisma schema defines:
- **User** - User accounts with roles (ADMIN, MANAGER, USER)
- **Portfolio** - Investment portfolios
- **Asset** - Assets within portfolios (stocks, bonds, crypto, etc.)

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database with sample data



