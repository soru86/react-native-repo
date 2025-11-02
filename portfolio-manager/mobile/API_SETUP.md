# API Connection Setup Guide

This guide will help you configure the mobile app to connect to the backend API.

## Quick Setup

### Option 1: Using Environment Variable (Recommended)

1. Create a `.env` file in the `mobile/` directory:
```bash
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:4000/graphql
```

2. Find your local IP address:
   - **Mac/Linux**: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - **Windows**: `ipconfig` (look for IPv4 Address)

3. Replace `YOUR_LOCAL_IP` with your actual IP (e.g., `192.168.1.100`)

### Option 2: Platform-Specific Defaults

The app uses these defaults if `EXPO_PUBLIC_API_URL` is not set:

- **Web**: `http://localhost:4000/graphql`
- **iOS Simulator**: `http://localhost:4000/graphql`
- **Android Emulator**: `http://10.0.2.2:4000/graphql`
- **Physical Devices**: Requires manual IP configuration

## Common Scenarios

### Scenario 1: iOS Simulator
✅ Works out of the box - uses `localhost:4000/graphql`

### Scenario 2: Android Emulator
✅ Works out of the box - uses `10.0.2.2:4000/graphql`

### Scenario 3: Physical Device (iOS/Android)
❌ Requires your computer's local IP address

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Note the IP address shown in the server output

3. Create `mobile/.env`:
```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:4000/graphql
```
(Replace with your actual IP)

4. Restart the Expo dev server

### Scenario 4: Production/Remote Server
Set `EXPO_PUBLIC_API_URL` to your production API URL:
```env
EXPO_PUBLIC_API_URL=https://api.yourdomain.com/graphql
```

## Troubleshooting

### "Network request failed" Error

1. **Check if backend is running**:
   ```bash
   curl http://localhost:4000/health
   ```

2. **Check if IP address is correct**:
   - Verify the IP in `.env` matches your computer's IP
   - Both mobile device and computer must be on the same network

3. **Check firewall**:
   - Ensure port 4000 is not blocked
   - On Mac: System Settings > Firewall

4. **Verify CORS**:
   - Backend allows all origins in development mode
   - Check backend logs for CORS errors

5. **For physical devices**:
   - Use your computer's local IP, not `localhost`
   - Example: `http://192.168.1.100:4000/graphql`

### "Connection refused" Error

- Backend server is not running
- Wrong IP address or port
- Firewall blocking the connection

### Testing Connection

1. **Test from your computer**:
   ```bash
   curl http://localhost:4000/graphql -X POST \
     -H "Content-Type: application/json" \
     -d '{"query":"{ __typename }"}'
   ```

2. **Test from mobile device browser** (if on same network):
   ```
   http://YOUR_IP:4000/health
   ```

## Configuration Priority

The app checks for API URL in this order:
1. `EXPO_PUBLIC_API_URL` environment variable (highest priority)
2. Expo config (`app.json` extra.apiUrl)
3. Platform-specific defaults

## Restart Required

After changing `.env` file:
1. Stop Expo dev server (Ctrl+C)
2. Clear cache: `npx expo start -c`
3. Restart: `npm start`


