# VapeTrack Mobile

A React Native mobile application for tracking vaping habits and reducing nicotine intake. Built with Expo for deployment to both iOS and Android app stores.

## Features

- 📊 **Habit Tracking**: Log vape puffs and track usage patterns
- 📈 **Progress Monitoring**: Visual progress indicators showing usage compared to old smoking habits
- 🏆 **XP & Rewards System**: Earn XP by reducing usage
- 💊 **Health Timeline**: View health benefits of reducing nicotine
- 📱 **Cross-Platform**: Works on both iOS and Android
- ☁️ **Cloud Sync**: Supabase integration for data persistence across devices

## Tech Stack

- **Framework**: React Native with Expo
- **Backend**: Supabase (Authentication & Database)
- **Storage**: AsyncStorage for local persistence
- **UI**: Custom components with glassmorphism design
- **Icons**: Expo Vector Icons (Ionicons)

## Getting Started

### Prerequisites

- Node.js (v20.19.4 or higher recommended)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app on your physical device (for testing)

### Installation

1. Clone the repository:
```bash
cd /Users/cs/Desktop/vapetrack-mobile-1/app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
```

### Running the App

#### Development Mode

Start the Expo development server:
```bash
npm start
```

Then choose your platform:
- Press `i` for iOS Simulator (Mac only)
- Press `a` for Android Emulator
- Scan the QR code with Expo Go app on your phone

#### Specific Platforms

```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing)
npm run web
```

## Deployment

### iOS App Store

1. **Configure app.json**:
   - Update `expo.ios.bundleIdentifier` (already set to `io.esperion.vapetrack`)
   - Update version and build number as needed

2. **Build for iOS**:
```bash
# Install EAS CLI if you haven't
npm install -g eas-cli

# Login to Expo
eas login

# Configure the project
eas build:configure

# Build for iOS
eas build --platform ios
```

3. **Submit to App Store**:
```bash
eas submit --platform ios
```

You'll need:
- Apple Developer Account ($99/year)
- App Store Connect access
- Proper certificates and provisioning profiles (EAS handles this)

### Android Play Store

1. **Configure app.json**:
   - Update `expo.android.package` (already set to `io.esperion.vapetrack`)
   - Update version code as needed

2. **Build for Android**:
```bash
# Build APK for testing
eas build --platform android --profile preview

# Build AAB for Play Store
eas build --platform android
```

3. **Submit to Play Store**:
```bash
eas submit --platform android
```

You'll need:
- Google Play Developer Account ($25 one-time fee)
- Service account JSON key from Google Cloud Console

### Build Profiles

Create `eas.json` in the root directory:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Project Structure

```
app/
├── src/
│   ├── components/
│   │   └── BottomNav.js          # Bottom navigation component
│   ├── context/
│   │   └── UserContext.js        # Global state management
│   ├── screens/
│   │   ├── OnboardingScreen.js   # Initial user setup
│   │   ├── VapeSelectorScreen.js # Vape device configuration
│   │   ├── TrackerScreen.js      # Main tracking interface
│   │   ├── DashboardScreen.js    # Statistics dashboard
│   │   ├── HealthTimelineScreen.js # Health benefits
│   │   ├── RewardsScreen.js      # XP and rewards
│   │   └── ProfileScreen.js      # User profile
│   └── utils/
│       ├── constants.js          # Design system constants
│       └── supabaseClient.js     # Supabase configuration
├── App.js                        # Main app component
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
└── .env                          # Environment variables
```

## Key Features Implementation

### Circular Progress Indicator
The tracker screen features a custom SVG-based circular progress ring that shows daily usage compared to old smoking habits with dynamic color coding.

### Hold-to-Log Functionality
Users can tap or hold the tracking button to log puffs. Holding continuously logs puffs every 200ms.

### Data Persistence
- Local: AsyncStorage for offline functionality
- Cloud: Supabase for cross-device sync and backup

### XP System
Users earn XP by reducing their vaping compared to their previous smoking habit. XP is calculated daily based on usage reduction percentage.

## Environment Variables

Required environment variables:

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_KEY`: Your Supabase anon/public key

## Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Create the following tables:

**profiles**:
```sql
create table profiles (
  id uuid references auth.users primary key,
  username text,
  email text,
  data jsonb,
  settings jsonb,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default now()
);
```

**logs**:
```sql
create table logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  timestamp timestamp with time zone,
  type text,
  vape_name text,
  vape_nicotine integer,
  juice_level_before integer,
  juice_level_after integer,
  day_of_week text,
  hour_of_day integer,
  time_since_last_puff_ms bigint,
  user_xp integer,
  daily_puff_count integer,
  streak_days integer,
  user_agent text,
  device_type text,
  metadata jsonb,
  created_at timestamp with time zone default now()
);
```

3. Enable Row Level Security (RLS) and create policies for user data access

## App Store Requirements

### iOS
- App icon (1024x1024px)
- Screenshots for required device sizes
- Privacy policy URL
- App description and keywords
- Age rating

### Android
- App icon (512x512px)
- Feature graphic (1024x500px)
- Screenshots for required device sizes
- Privacy policy URL
- App description
- Content rating questionnaire

## Troubleshooting

### Metro Bundler Issues
```bash
# Clear cache and restart
npx expo start -c
```

### Build Errors
```bash
# Clear EAS build cache
eas build --clear-cache
```

### Dependency Issues
```bash
# Fix package versions
npx expo install --fix
```

## Contributing

This is a private project for Esperion.io. For issues or feature requests, contact the development team.

## License

Proprietary - Esperion.io

## Support

For support, email support@esperion.io or open an issue in the repository.

---

Built with ❤️ by Esperion.io
