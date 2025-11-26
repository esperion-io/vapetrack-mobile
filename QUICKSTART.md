# VapeTrack Mobile - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will get your VapeTrack mobile app running on your device or simulator.

## Prerequisites

- Node.js installed (v20.19.4+)
- Smartphone with Expo Go app OR iOS Simulator/Android Emulator

## Step 1: Install Expo Go (Optional but Recommended)

### On Your Phone:
- **iOS**: Download [Expo Go](https://apps.apple.com/app/expo-go/id982107779) from App Store
- **Android**: Download [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from Play Store

## Step 2: Start the Development Server

```bash
cd /Users/cs/Desktop/vapetrack-mobile-1/app
npm start
```

You'll see a QR code in your terminal.

## Step 3: Open on Your Device

### Option A: Physical Device (Easiest)
1. Open Expo Go app on your phone
2. **iOS**: Scan QR code with Camera app, tap notification
3. **Android**: Scan QR code directly in Expo Go app

### Option B: iOS Simulator (Mac Only)
```bash
# Press 'i' in the terminal where npm start is running
# Or run:
npm run ios
```

### Option C: Android Emulator
```bash
# Press 'a' in the terminal where npm start is running
# Or run:
npm run android
```

## Step 4: Test the App

1. **Onboarding**: Enter your name and smoking habits
2. **Vape Setup**: Configure your vape device details
3. **Start Tracking**: Tap the blue button to log puffs
4. **Explore**: Navigate using the bottom menu

## Features to Try

- 📊 **Tracker**: Tap or hold the button to log vape puffs
- 📈 **Dashboard**: View your statistics and progress
- 💊 **Health**: See health benefits timeline
- 🏆 **Rewards**: Check your XP (earn by reducing usage)
- 👤 **Profile**: View and manage your account

## Troubleshooting

### "Unable to connect to Metro"
```bash
# Stop the server (Ctrl+C) and restart:
npm start -- --reset-cache
```

### "Network error"
- Ensure phone and computer are on same WiFi network
- Try using tunnel mode: `npm start -- --tunnel`

### App crashes on startup
```bash
# Clear cache and reinstall:
rm -rf node_modules
npm install
npm start
```

### Changes not reflecting
- Press `r` in the terminal to reload
- Or shake your device and tap "Reload"

## Next Steps

### For Development
- Edit files in `src/` directory
- Changes auto-reload (Fast Refresh)
- Check terminal for errors

### For Deployment
- See [DEPLOYMENT.md](../DEPLOYMENT.md) for full deployment guide
- Build with EAS: `eas build --platform all`
- Submit to stores: `eas submit --platform all`

## Project Structure

```
app/
├── src/
│   ├── screens/        # All app screens
│   ├── components/     # Reusable components
│   ├── context/        # State management
│   └── utils/          # Helper functions
├── App.js              # Main entry point
└── app.json            # Expo configuration
```

## Useful Commands

```bash
# Start development server
npm start

# Start with cache cleared
npm start -- --clear

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run web version (for testing)
npm run web

# Build for production
eas build --platform all

# Submit to app stores
eas submit --platform all
```

## Development Tips

### Hot Reload
- Save any file to see changes instantly
- No need to restart the app

### Debug Menu
- **iOS**: Cmd+D (simulator) or shake device
- **Android**: Cmd+M (emulator) or shake device

### Console Logs
- View logs in terminal where `npm start` is running
- Or use React Native Debugger

### Environment Variables
- Edit `.env` file for Supabase credentials
- Restart server after changing `.env`

## Common Issues

### Port Already in Use
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
npm start
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Expo Go Connection Issues
1. Ensure same WiFi network
2. Disable VPN
3. Try tunnel mode: `npm start -- --tunnel`
4. Check firewall settings

## Getting Help

- **Expo Docs**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **Expo Discord**: https://chat.expo.dev
- **GitHub Issues**: Open an issue in the repository

## What's Next?

1. **Customize**: Modify colors in `src/utils/constants.js`
2. **Add Features**: Create new screens in `src/screens/`
3. **Deploy**: Follow [DEPLOYMENT.md](../DEPLOYMENT.md) to publish
4. **Monitor**: Set up analytics and crash reporting

---

**Happy Coding! 🎉**

Need help? Check the [full README](./README.md) or [deployment guide](../DEPLOYMENT.md).
