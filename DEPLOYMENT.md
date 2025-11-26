# VapeTrack Deployment Guide

Complete guide for deploying VapeTrack to both Apple App Store and Google Play Store.

## Prerequisites

Before you begin, ensure you have:

### Required Accounts
- ✅ Apple Developer Account ($99/year) - https://developer.apple.com
- ✅ Google Play Developer Account ($25 one-time) - https://play.google.com/console
- ✅ Expo Account (free) - https://expo.dev

### Required Tools
- ✅ EAS CLI installed globally: `npm install -g eas-cli`
- ✅ Node.js v20.19.4 or higher
- ✅ Git for version control

## Step 1: Initial Setup

### 1.1 Install EAS CLI
```bash
npm install -g eas-cli
```

### 1.2 Login to Expo
```bash
eas login
```

### 1.3 Configure Your Project
```bash
cd /Users/cs/Desktop/vapetrack-mobile-1/app
eas build:configure
```

This will create an `eas.json` file (already created in this project).

## Step 2: iOS App Store Deployment

### 2.1 Apple Developer Setup

1. **Create App ID**:
   - Go to https://developer.apple.com/account
   - Navigate to Certificates, Identifiers & Profiles
   - Create a new App ID with identifier: `io.esperion.vapetrack`
   - Enable required capabilities (if any)

2. **App Store Connect**:
   - Go to https://appstoreconnect.apple.com
   - Click "My Apps" → "+" → "New App"
   - Platform: iOS
   - Name: VapeTrack
   - Bundle ID: io.esperion.vapetrack
   - SKU: vapetrack-ios
   - User Access: Full Access

### 2.2 Prepare App Store Assets

Create the following assets:

**App Icon**:
- 1024x1024px PNG (no transparency, no rounded corners)
- Save as `app-icon.png`

**Screenshots** (required sizes):
- iPhone 6.7" (1290 x 2796 px) - iPhone 14 Pro Max
- iPhone 6.5" (1284 x 2778 px) - iPhone 13 Pro Max
- iPhone 5.5" (1242 x 2208 px) - iPhone 8 Plus
- iPad Pro 12.9" (2048 x 2732 px)

**Privacy Policy**:
- Create a privacy policy page
- Host it online (e.g., on your website)
- You'll need the URL for App Store submission

### 2.3 Update app.json

Ensure your `app.json` has correct iOS configuration:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "io.esperion.vapetrack",
      "buildNumber": "1.0.0",
      "supportsTablet": true
    }
  }
}
```

### 2.4 Build for iOS

```bash
# First build (will take 10-20 minutes)
eas build --platform ios

# For subsequent builds
eas build --platform ios --auto-submit
```

**What happens during build:**
1. EAS creates certificates and provisioning profiles automatically
2. Builds your app on Expo's servers
3. Returns a `.ipa` file

### 2.5 Submit to App Store

**Option A: Automatic Submission**
```bash
eas submit --platform ios
```

**Option B: Manual Submission**
1. Download the `.ipa` file from the build
2. Use Transporter app (Mac App Store) to upload
3. Go to App Store Connect to complete submission

### 2.6 App Store Connect Configuration

1. **App Information**:
   - Name: VapeTrack
   - Subtitle: Track Your Vaping Habits
   - Category: Health & Fitness
   - Age Rating: 17+ (Tobacco/Drug Use References)

2. **Pricing**:
   - Free or Paid (choose based on your model)
   - Availability: All countries or select specific ones

3. **App Privacy**:
   - Fill out the privacy questionnaire
   - Data collected: Email, Health Data, Usage Data
   - Link to privacy policy

4. **Version Information**:
   - Version: 1.0.0
   - Copyright: © 2024 Esperion.io
   - Description: (Write compelling description)
   - Keywords: vape, tracking, health, nicotine, quit smoking
   - Support URL: https://esperion.io/support
   - Marketing URL: https://esperion.io/vapetrack

5. **Build**:
   - Select the build you just uploaded
   - Add screenshots
   - Add app preview video (optional but recommended)

6. **Submit for Review**:
   - Click "Submit for Review"
   - Review time: typically 24-48 hours

## Step 3: Google Play Store Deployment

### 3.1 Google Play Console Setup

1. **Create Application**:
   - Go to https://play.google.com/console
   - Click "Create app"
   - App name: VapeTrack
   - Default language: English (United States)
   - App or game: App
   - Free or paid: Free (or Paid)
   - Accept declarations

2. **Set up your app**:
   - Complete all required sections in the dashboard

### 3.2 Prepare Play Store Assets

**App Icon**:
- 512x512px PNG (32-bit with alpha)

**Feature Graphic**:
- 1024x500px JPG or PNG

**Screenshots** (at least 2 required):
- Phone: 16:9 or 9:16 aspect ratio
- Minimum dimension: 320px
- Maximum dimension: 3840px

**Privacy Policy**:
- Same URL as iOS

### 3.3 Create Service Account

1. Go to Google Cloud Console
2. Create a new service account
3. Grant "Service Account User" role
4. Create and download JSON key
5. Save as `google-service-account.json` in your project root
6. Link service account in Play Console (Setup → API access)

### 3.4 Update app.json

Ensure your `app.json` has correct Android configuration:
```json
{
  "expo": {
    "android": {
      "package": "io.esperion.vapetrack",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0B101B"
      }
    }
  }
}
```

### 3.5 Build for Android

```bash
# Build AAB for Play Store
eas build --platform android

# For testing, build APK
eas build --platform android --profile preview
```

### 3.6 Submit to Play Store

**Option A: Automatic Submission**
```bash
eas submit --platform android
```

**Option B: Manual Submission**
1. Download the `.aab` file from the build
2. Go to Play Console → Production → Create new release
3. Upload the AAB file

### 3.7 Play Store Listing

1. **Main Store Listing**:
   - App name: VapeTrack
   - Short description (80 chars): Track your vaping habits and reduce nicotine intake
   - Full description (4000 chars): Write detailed description
   - App icon: Upload 512x512 icon
   - Feature graphic: Upload 1024x500 graphic
   - Screenshots: Upload at least 2 screenshots

2. **Categorization**:
   - App category: Health & Fitness
   - Tags: health, tracking, wellness

3. **Contact Details**:
   - Email: support@esperion.io
   - Website: https://esperion.io
   - Phone: (optional)

4. **Privacy Policy**:
   - URL: Your privacy policy URL

5. **App Access**:
   - All functionality is available without restrictions
   - Or provide test credentials if login required

6. **Ads**:
   - Select if app contains ads

7. **Content Rating**:
   - Complete questionnaire
   - Likely rating: Teen or Mature 17+

8. **Target Audience**:
   - Age group: 18+

9. **Data Safety**:
   - Data collected: Email, Health data, App activity
   - Data shared: None (or specify if using analytics)
   - Data security: Encrypted in transit, Can request deletion

### 3.8 Create Release

1. **Production Track**:
   - Go to Production → Create new release
   - Upload AAB file
   - Release name: 1.0.0
   - Release notes: Initial release of VapeTrack
   - Review and rollout

2. **Review Process**:
   - Google review typically takes 1-7 days
   - You'll receive email when approved/rejected

## Step 4: Testing Before Submission

### 4.1 Internal Testing

**iOS - TestFlight**:
```bash
# Build for TestFlight
eas build --platform ios --profile preview

# Add testers in App Store Connect → TestFlight
```

**Android - Internal Testing**:
```bash
# Build APK for testing
eas build --platform android --profile preview

# Or use internal testing track in Play Console
```

### 4.2 Test Checklist

- [ ] App launches without crashes
- [ ] Onboarding flow works correctly
- [ ] Vape selector saves data
- [ ] Tracker logs puffs correctly
- [ ] Dashboard shows accurate statistics
- [ ] Profile displays user information
- [ ] Data persists after app restart
- [ ] Supabase sync works (if logged in)
- [ ] Navigation between screens works
- [ ] App works offline
- [ ] App handles no internet gracefully

## Step 5: Post-Submission

### 5.1 Monitor Reviews

- Respond to user reviews promptly
- Address bugs and issues quickly
- Plan updates based on feedback

### 5.2 Analytics Setup

Consider adding:
- Firebase Analytics
- Sentry for error tracking
- App Store/Play Console analytics

### 5.3 Updates

**For updates:**
```bash
# Update version in app.json
# Increment buildNumber (iOS) and versionCode (Android)

# Build and submit
eas build --platform all --auto-submit
```

## Common Issues & Solutions

### Issue: Build Fails

**Solution:**
```bash
# Clear cache and retry
eas build --clear-cache --platform ios
```

### Issue: Certificates Error (iOS)

**Solution:**
```bash
# Revoke and regenerate
eas credentials
```

### Issue: App Rejected

**Common reasons:**
- Missing privacy policy
- Incomplete app information
- Crashes during review
- Violates store guidelines

**Solution:**
- Address the specific rejection reason
- Resubmit with fixes

### Issue: Slow Build Times

**Solution:**
- Use `--profile preview` for faster builds during testing
- Production builds are slower but optimized

## Maintenance Schedule

### Weekly
- Monitor crash reports
- Respond to user reviews
- Check analytics

### Monthly
- Review and plan feature updates
- Update dependencies
- Security patches

### Quarterly
- Major feature releases
- Performance optimization
- User feedback implementation

## Resources

- **Expo Documentation**: https://docs.expo.dev
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **EAS Submit**: https://docs.expo.dev/submit/introduction/
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Play Store Guidelines**: https://play.google.com/about/developer-content-policy/
- **React Native**: https://reactnative.dev

## Support

For deployment issues:
- Expo Discord: https://chat.expo.dev
- Expo Forums: https://forums.expo.dev
- Stack Overflow: Tag with `expo` and `react-native`

---

**Good luck with your deployment! 🚀**
