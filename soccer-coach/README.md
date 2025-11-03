# Soccer Coach Mobile Application

A React Native mobile application for Spanish Soccer Coaching platform with JWT authentication and OAuth2 social login support, built with Expo SDK 54.

## Features

### Authentication
- Email/Password login and registration
- JWT token-based authentication with automatic refresh
- OAuth2 social login (Google, Facebook, Apple)
- Secure token storage with AsyncStorage

### Student Features
- Personalized dashboard with statistics
- Mentor selection and booking
- Individual and group session booking
- Video upload for feedback
- Receive coach feedback on recordings
- Payment integration
- Session management

### Coach Features
- Coach dashboard with statistics
- User management
- Session management
- Video feedback system
- Revenue tracking

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: Redux Toolkit
- **Authentication**: JWT + OAuth2 (Google, Facebook, Apple)
- **API Client**: Axios with interceptors
- **UI Components**: React Native Paper + Custom Components

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure OAuth providers:
   - Update Google OAuth credentials in environment variables
   - Configure Facebook SDK if using Facebook login
   - Configure Apple Sign In for iOS

3. Update API base URL:
   - Update `API_BASE_URL` in `src/utils/constants.ts` with your backend API URL

4. Start the development server:
```bash
npm start
```

5. Run on your preferred platform:
```bash
npm run ios    # For iOS
npm run android # For Android
```

## Project Structure

```
soccer-coach/
├── src/
│   ├── components/        # Reusable components
│   ├── hooks/             # Custom hooks
│   ├── navigation/        # Navigation configuration
│   ├── screens/           # Screen components
│   │   ├── auth/         # Authentication screens
│   │   ├── student/      # Student screens
│   │   └── coach/        # Coach screens
│   ├── services/         # API and auth services
│   ├── store/            # Redux store and slices
│   └── utils/            # Utilities and constants
├── App.tsx               # Main app component
└── package.json          # Dependencies
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-google-ios-client-id
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-google-android-client-id
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-google-web-client-id
```

### OAuth Setup

1. **Google Sign In**: 
   - Create OAuth 2.0 credentials in Google Cloud Console
   - Add client IDs to environment variables or update in `src/hooks/useGoogleAuth.ts`

2. **Facebook Login**:
   - Create a Facebook App
   - Configure in Facebook Developer Console
   - Update Facebook SDK configuration in `src/services/authService.ts`

3. **Apple Sign In**:
   - Configure in Apple Developer Console
   - Add capabilities to your app

## API Integration

The app expects a RESTful API with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/social` - Social login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token

### User
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile

### Mentors
- `GET /mentors` - Get list of mentors
- `GET /mentors/:id` - Get mentor by ID

### Sessions
- `GET /sessions` - Get sessions
- `GET /sessions/:id` - Get session by ID
- `POST /sessions` - Create a session
- `POST /sessions/:id/join` - Join a session
- `POST /sessions/:id/cancel` - Cancel a session

### Videos
- `POST /videos/upload` - Upload video
- `GET /videos/:id/feedback` - Get video feedback
- `GET /videos` - Get videos

### Payments
- `POST /payments` - Create payment
- `GET /payments/:id` - Get payment status

### Coach
- `GET /coach/dashboard` - Get coach dashboard
- `GET /coach/users` - Get coach users
- `PUT /coach/profile` - Update coach profile
- `POST /videos/:id/feedback` - Provide video feedback

All authenticated requests should include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Development

### Running the App

```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

### Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## License

This project is private and proprietary.
