# Portfolio Manager

A full-stack mobile application for managing investment portfolios, built with React Native, Express, GraphQL, Prisma, and PostgreSQL. Features JWT authentication with role-based access control (RBAC) and responsive design for both small screens and tablets/iPads.

## Features

- 🔐 **JWT Authentication** - Secure user authentication with token-based sessions
- 👥 **Role-Based Access Control (RBAC)** - Three user roles: Admin, Manager, and User
- 📱 **Responsive Design** - Optimized for small screens, tablets, and iPads
- 📊 **Portfolio Management** - Create, view, update, and delete portfolios
- 💰 **Asset Management** - Track stocks, bonds, crypto, real estate, and more
- 📈 **Real-time Calculations** - Automatic portfolio value calculations
- 🎨 **Modern UI** - Clean and intuitive user interface

## Tech Stack

### Backend
- **Express.js** - Web framework
- **GraphQL** (Apollo Server) - API layer
- **Prisma** - ORM and database toolkit
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React Native** - Mobile framework
- **Expo** - Development platform
- **Apollo Client** - GraphQL client
- **React Navigation** - Navigation library
- **Expo Secure Store** - Secure token storage

## Project Structure

```
portfolio-manager/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.js              # Database seed file
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # Prisma client
│   │   ├── graphql/
│   │   │   ├── typeDefs.js      # GraphQL schema
│   │   │   └── resolvers.js     # GraphQL resolvers
│   │   ├── middleware/
│   │   │   └── auth.js          # Authentication & RBAC
│   │   ├── utils/
│   │   │   └── jwt.js           # JWT utilities
│   │   └── server.js             # Express server
│   ├── package.json
│   └── .env.example
├── mobile/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── screens/             # Screen components
│   │   ├── navigation/          # Navigation setup
│   │   ├── context/             # React context
│   │   ├── hooks/               # Custom hooks
│   │   ├── config/              # Configuration
│   │   └── utils/               # Utility functions
│   ├── App.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Expo CLI (for mobile development)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_manager?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV=development
CORS_ORIGIN="http://localhost:19006"
```

5. Create the database:
```bash
createdb portfolio_manager
```

6. Run Prisma migrations:
```bash
npm run prisma:migrate
```

7. Generate Prisma client:
```bash
npm run prisma:generate
```

8. Seed the database (optional):
```bash
npm run prisma:seed
```

9. Start the server:
```bash
npm run dev
```

The GraphQL API will be available at `http://localhost:4000/graphql`

### Mobile Setup

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, for custom API URL):
```env
EXPO_PUBLIC_API_URL=http://localhost:4000/graphql
```

4. Start the Expo development server:
```bash
npm start
```

5. Use the Expo Go app on your phone or an emulator to run the app.

## Default Users

After seeding the database, you can use these test accounts:

- **Admin**: `admin@portfolio.com` / `password123`
- **Manager**: `manager@portfolio.com` / `password123`
- **User**: `user@portfolio.com` / `password123`

## User Roles & Permissions

### Admin
- Full access to all portfolios and assets
- Can view all users' portfolios
- Can create portfolios for any user
- Can manage all assets

### Manager
- Can view all portfolios and assets
- Can create portfolios for any user
- Can manage all assets
- Cannot access admin features

### User
- Can only view and manage their own portfolios
- Can create portfolios for themselves
- Can manage assets in their own portfolios

## API Documentation

### Authentication Mutations

#### Register
```graphql
mutation Register($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
  register(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
    token
    user {
      id
      email
      firstName
      lastName
      role
    }
  }
}
```

#### Login
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      email
      firstName
      lastName
      role
    }
  }
}
```

### Portfolio Queries & Mutations

#### Get My Portfolios
```graphql
query GetMyPortfolios {
  myPortfolios {
    id
    name
    description
    status
    totalValue
    assets {
      id
      name
      value
    }
  }
}
```

#### Create Portfolio
```graphql
mutation CreatePortfolio($name: String!, $description: String) {
  createPortfolio(name: $name, description: $description) {
    id
    name
    description
  }
}
```

### Asset Mutations

#### Create Asset
```graphql
mutation CreateAsset(
  $portfolioId: ID!
  $name: String!
  $type: AssetType!
  $quantity: Float!
  $price: Float!
) {
  createAsset(
    portfolioId: $portfolioId
    name: $name
    type: $type
    quantity: $quantity
    price: $price
  ) {
    id
    name
    value
  }
}
```

## Responsive Design

The mobile app automatically adapts to different screen sizes:

- **Small Screens** (< 375px): Compact layout with smaller fonts and padding
- **Standard Screens** (375px - 767px): Default layout
- **Tablets** (≥ 768px): Larger fonts, increased padding, optimized layouts
- **Large Tablets/iPads** (≥ 1024px): Maximum spacing and font sizes

The responsive behavior is handled by the `useResponsive` hook throughout the app.

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts server with nodemon
npm run prisma:studio  # Opens Prisma Studio for database management
```

### Mobile Development
```bash
cd mobile
npm start  # Starts Expo development server
npm run ios  # Runs on iOS simulator
npm run android  # Runs on Android emulator
```

## Testing

To test the application:

1. Start the backend server
2. Start the mobile app
3. Register a new account or login with test credentials
4. Create portfolios and add assets
5. Test different user roles (Admin, Manager, User)

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Secure token storage using Expo Secure Store
- Role-based access control (RBAC)
- Input validation
- SQL injection protection via Prisma

## Future Enhancements

- [ ] Push notifications
- [ ] Real-time price updates
- [ ] Portfolio analytics and charts
- [ ] Export portfolio data (PDF/CSV)
- [ ] Multi-currency support
- [ ] Dark mode
- [ ] Offline support
- [ ] Advanced filtering and search

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.



