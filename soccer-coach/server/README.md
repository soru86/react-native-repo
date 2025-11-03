# Soccer Coach API

Backend API for the Soccer Coach mobile application built with Node.js, Express, Prisma, and SQLite.

## Features

- **Authentication**: JWT-based authentication with Passport.js
- **Social Login**: Support for Google, Facebook, and Apple OAuth
- **Password Hashing**: bcryptjs for secure password storage
- **Database**: SQLite with Prisma ORM
- **Error Handling**: Comprehensive error handling framework
- **Validation**: Request validation with express-validator
- **File Upload**: Multer for video uploads
- **CORS**: Cross-origin resource sharing configured

## Tech Stack

- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite Database
- Passport.js (JWT + Local strategies)
- bcryptjs (Password hashing)
- express-validator (Input validation)
- Multer (File uploads)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens
- `DATABASE_URL`: SQLite database path
- `CORS_ORIGIN`: Frontend URL
- `GOOGLE_CLIENT_ID`: Google OAuth client ID (optional)

3. Set up database:
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database
npm run prisma:seed
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/social` - Social login (Google/Facebook/Apple)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Mentors
- `GET /api/mentors` - Get all mentors (coaches)
- `GET /api/mentors/:id` - Get mentor by ID

### Sessions
- `GET /api/sessions` - Get user sessions
- `GET /api/sessions/:id` - Get session by ID
- `POST /api/sessions` - Create new session
- `POST /api/sessions/:id/join` - Join group session
- `POST /api/sessions/:id/cancel` - Cancel session

### Videos
- `POST /api/videos/upload` - Upload video
- `GET /api/videos` - Get videos
- `GET /api/videos/:id/feedback` - Get video feedback
- `POST /api/videos/:id/feedback` - Provide feedback (Coach only)

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments/:id` - Get payment status

### Coach
- `GET /api/coach/dashboard` - Get coach dashboard
- `GET /api/coach/users` - Get coach's students
- `PUT /api/coach/profile` - Update coach profile

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

Main models:
- **User**: Users (students and coaches)
- **Session**: Coaching sessions
- **Video**: Uploaded videos
- **VideoFeedback**: Coach feedback on videos
- **Payment**: Payment records
- **RefreshToken**: JWT refresh tokens

## Error Handling

The API uses a comprehensive error handling framework:

- `AppError`: Base error class
- `ValidationError`: Input validation errors (400)
- `AuthenticationError`: Authentication failures (401)
- `AuthorizationError`: Permission denied (403)
- `NotFoundError`: Resource not found (404)
- `ConflictError`: Resource conflicts (409)

Error responses follow this format:
```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE",
  "fields": {} // Optional, for validation errors
}
```

## Authentication

The API uses JWT tokens for authentication:

1. **Access Token**: Short-lived (default: 1 hour)
   - Included in `Authorization: Bearer <token>` header
   
2. **Refresh Token**: Long-lived (default: 7 days)
   - Used to obtain new access tokens
   - Stored in database

## File Uploads

Videos are uploaded to the `uploads/` directory (configurable via `UPLOAD_DIR`).

- Max file size: 10MB (configurable via `MAX_FILE_SIZE`)
- Allowed types: Video files only

## Environment Variables

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
DATABASE_URL="file:./dev.db"
CORS_ORIGIN=http://localhost:19006
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
GOOGLE_CLIENT_ID=your-google-client-id
```

## Development

### Running in Development
```bash
npm run dev
```

### Database Management
```bash
# Open Prisma Studio (database GUI)
npm run prisma:studio

# Create new migration
npm run prisma:migrate

# Reset database
npx prisma migrate reset
```

### Testing
```bash
# Run tests (if implemented)
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure proper CORS origins
4. Set up file storage (consider cloud storage)
5. Use environment variables for sensitive data
6. Set up proper logging
7. Configure rate limiting
8. Set up monitoring

## Security Considerations

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens are signed and verified
- Refresh tokens are stored in database
- Input validation on all routes
- SQL injection protection via Prisma
- CORS configured appropriately
- File upload validation

## License

This project is private and proprietary.


