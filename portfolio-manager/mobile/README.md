# Portfolio Manager Mobile App

React Native mobile application built with Expo for managing investment portfolios.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure API URL (optional):
```bash
# Create .env file
echo "EXPO_PUBLIC_API_URL=http://localhost:4000/graphql" > .env
```

3. Start development server:
```bash
npm start
```

## Running on Devices

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Web
```bash
npm run web
```

## Features

- Responsive design for phones, tablets, and iPads
- JWT authentication
- Portfolio management
- Asset tracking
- Role-based UI (Admin, Manager, User)

## Project Structure

- `src/components/` - Reusable UI components
- `src/screens/` - Screen components
- `src/navigation/` - Navigation configuration
- `src/context/` - React context providers
- `src/hooks/` - Custom React hooks
- `src/config/` - Configuration files
- `src/utils/` - Utility functions

## Responsive Design

The app uses the `useResponsive` hook to adapt to different screen sizes:
- Small screens: Compact layout
- Tablets: Larger fonts and spacing
- iPads: Maximum spacing and readability



