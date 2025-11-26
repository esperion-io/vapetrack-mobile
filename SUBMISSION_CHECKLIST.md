# App Store Submission Checklist

Use this checklist to ensure you have everything ready before submitting to the App Store and Play Store.

## Pre-Submission Checklist

### ✅ Development Complete
- [ ] All features tested and working
- [ ] No critical bugs
- [ ] App runs smoothly on iOS and Android
- [ ] Offline functionality works
- [ ] Supabase sync works correctly
- [ ] All screens accessible via navigation
- [ ] Data persists correctly

### ✅ App Store Assets

#### Icons
- [ ] iOS App Icon (1024x1024px, PNG, no transparency, no rounded corners)
- [ ] Android App Icon (512x512px, PNG with transparency)
- [ ] Android Adaptive Icon (foreground + background)

#### Screenshots

**iOS Required:**
- [ ] iPhone 6.7" (1290 x 2796 px) - iPhone 14 Pro Max
- [ ] iPhone 6.5" (1284 x 2778 px) - iPhone 13 Pro Max  
- [ ] iPhone 5.5" (1242 x 2208 px) - iPhone 8 Plus
- [ ] iPad Pro 12.9" (2048 x 2732 px)

**Android Required:**
- [ ] Phone screenshots (at least 2, up to 8)
- [ ] 7-inch tablet screenshots (optional)
- [ ] 10-inch tablet screenshots (optional)
- [ ] Feature Graphic (1024x500px)

#### Marketing Materials
- [ ] App preview video (optional but recommended)
- [ ] Promotional text
- [ ] App description (short and long)
- [ ] Keywords for search optimization

### ✅ Legal & Compliance

- [ ] Privacy Policy created and hosted online
- [ ] Terms of Service (if applicable)
- [ ] Age rating determined (likely 17+)
- [ ] Content rating questionnaire completed
- [ ] Data collection disclosure prepared
- [ ] COPPA compliance verified (if applicable)

### ✅ App Information

#### iOS App Store Connect
- [ ] App name: VapeTrack
- [ ] Subtitle (30 chars max)
- [ ] Category: Health & Fitness
- [ ] Age rating: 17+ (Tobacco/Drug Use References)
- [ ] Copyright: © 2024 Esperion.io
- [ ] Support URL
- [ ] Marketing URL (optional)
- [ ] Privacy Policy URL
- [ ] Keywords (100 chars max, comma-separated)
- [ ] Description (4000 chars max)
- [ ] What's New (4000 chars max)

#### Google Play Console
- [ ] App name: VapeTrack
- [ ] Short description (80 chars max)
- [ ] Full description (4000 chars max)
- [ ] Category: Health & Fitness
- [ ] Content rating completed
- [ ] Target age group: 18+
- [ ] Privacy Policy URL
- [ ] Contact email
- [ ] Contact website

### ✅ Technical Requirements

#### iOS
- [ ] Bundle Identifier: io.esperion.vapetrack
- [ ] Version: 1.0.0
- [ ] Build Number: 1.0.0
- [ ] Minimum iOS version: 13.0+
- [ ] Device support: iPhone, iPad
- [ ] Orientation: Portrait
- [ ] Status bar: Light content

#### Android
- [ ] Package name: io.esperion.vapetrack
- [ ] Version name: 1.0.0
- [ ] Version code: 1
- [ ] Minimum SDK: 21 (Android 5.0)
- [ ] Target SDK: Latest
- [ ] Permissions declared and justified

### ✅ Developer Accounts

- [ ] Apple Developer Account active ($99/year)
- [ ] Google Play Developer Account active ($25 one-time)
- [ ] Expo account created and verified
- [ ] EAS CLI installed and authenticated

### ✅ Build Configuration

- [ ] app.json properly configured
- [ ] eas.json created with build profiles
- [ ] Environment variables set (.env)
- [ ] Supabase credentials correct
- [ ] Bundle identifiers match accounts

### ✅ Testing

#### Functional Testing
- [ ] Onboarding flow works
- [ ] Vape selector saves correctly
- [ ] Tracker logs puffs accurately
- [ ] Dashboard shows correct stats
- [ ] Health timeline displays
- [ ] Rewards screen shows XP
- [ ] Profile displays user data
- [ ] Navigation works smoothly
- [ ] Back button behavior correct

#### Data Testing
- [ ] Data persists after app restart
- [ ] Data syncs to Supabase
- [ ] Offline mode works
- [ ] Clear data function works
- [ ] No data loss scenarios

#### Performance Testing
- [ ] App launches in < 3 seconds
- [ ] Smooth 60fps animations
- [ ] No memory leaks
- [ ] Battery usage acceptable
- [ ] Network usage reasonable

#### Device Testing
- [ ] Tested on iPhone (physical)
- [ ] Tested on Android (physical)
- [ ] Tested on iPad (if supported)
- [ ] Tested on different screen sizes
- [ ] Tested on iOS 13+ versions
- [ ] Tested on Android 5.0+ versions

### ✅ Security & Privacy

- [ ] No hardcoded secrets in code
- [ ] API keys in environment variables
- [ ] Supabase RLS policies configured
- [ ] User data encrypted in transit
- [ ] Sensitive data not logged
- [ ] Privacy policy covers all data collection

### ✅ Compliance

#### Health & Fitness Category
- [ ] App provides health/fitness functionality
- [ ] No medical claims made
- [ ] Appropriate disclaimers included
- [ ] Age restrictions enforced (17+)

#### Tobacco/Vaping Content
- [ ] Age gate implemented (if required)
- [ ] No promotion of tobacco use
- [ ] Harm reduction focus clear
- [ ] Complies with local regulations

### ✅ Submission Materials

#### iOS App Store
- [ ] Build uploaded via EAS or Transporter
- [ ] Screenshots uploaded (all required sizes)
- [ ] App icon uploaded
- [ ] App preview video uploaded (optional)
- [ ] Description and keywords entered
- [ ] Privacy policy linked
- [ ] Support and marketing URLs added
- [ ] Age rating selected
- [ ] Pricing and availability set
- [ ] Export compliance answered
- [ ] Content rights confirmed

#### Google Play Store
- [ ] AAB file uploaded
- [ ] Screenshots uploaded (all required)
- [ ] Feature graphic uploaded
- [ ] App icon uploaded
- [ ] Short and full descriptions entered
- [ ] Privacy policy linked
- [ ] Content rating completed
- [ ] Target audience set
- [ ] Data safety form completed
- [ ] Store listing contact info added
- [ ] Pricing and distribution set

### ✅ Post-Submission

- [ ] Submitted for review
- [ ] Review status monitored
- [ ] Ready to respond to review feedback
- [ ] Marketing materials prepared for launch
- [ ] Social media announcements ready
- [ ] Support system in place
- [ ] Analytics configured
- [ ] Crash reporting enabled

## Submission Process

### iOS Submission Steps
1. [ ] Build app: `eas build --platform ios`
2. [ ] Wait for build to complete (~15-20 min)
3. [ ] Submit: `eas submit --platform ios`
4. [ ] Complete App Store Connect info
5. [ ] Submit for review
6. [ ] Monitor review status (24-48 hours typical)
7. [ ] Address any issues if rejected
8. [ ] Release when approved

### Android Submission Steps
1. [ ] Build app: `eas build --platform android`
2. [ ] Wait for build to complete (~10-15 min)
3. [ ] Submit: `eas submit --platform android`
4. [ ] Complete Play Console info
5. [ ] Create release in Production track
6. [ ] Submit for review
7. [ ] Monitor review status (1-7 days typical)
8. [ ] Address any issues if rejected
9. [ ] Release when approved

## Common Rejection Reasons

### iOS
- [ ] Crashes during review
- [ ] Incomplete app information
- [ ] Missing privacy policy
- [ ] Inappropriate content
- [ ] Broken links
- [ ] Poor user experience
- [ ] Guideline violations

### Android
- [ ] Crashes or bugs
- [ ] Privacy policy issues
- [ ] Inappropriate content
- [ ] Misleading information
- [ ] Incomplete store listing
- [ ] Policy violations
- [ ] Technical issues

## Emergency Contacts

- **Expo Support**: https://chat.expo.dev
- **Apple Developer Support**: https://developer.apple.com/contact/
- **Google Play Support**: https://support.google.com/googleplay/android-developer

## Notes

- Keep this checklist updated as you progress
- Mark items complete only when thoroughly verified
- Document any issues encountered
- Save all submission confirmation emails
- Keep track of review timelines

---

**Last Updated**: [Date]
**Submitted By**: [Name]
**Submission Date**: [Date]
