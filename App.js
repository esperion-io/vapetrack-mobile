import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PostHogProvider } from 'posthog-react-native';
import { UserProvider, useUser } from './src/context/UserContext';
import { COLORS } from './src/utils/constants';

// Import screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import VapeSelectorScreen from './src/screens/VapeSelectorScreen';
import TrackerScreen from './src/screens/TrackerScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HealthTimelineScreen from './src/screens/HealthTimelineScreen';
import RewardsScreen from './src/screens/RewardsScreen';
import BottomNav from './src/components/BottomNav';

function AppContent() {
  const { user, onboardUser } = useUser();
  const [currentScreen, setCurrentScreen] = useState('tracker');

  const handleOnboardingComplete = (data) => {
    onboardUser(data);
  };

  const handleVapeSelect = (vapeData) => {
    const { cigarettesPerDay, cigarettesPerPack, packCost, ...currentVape } = vapeData;
    onboardUser({
      ...user,
      currentVape,
      ...(cigarettesPerDay && { cigarettesPerDay }),
      ...(cigarettesPerPack && { cigarettesPerPack }),
      ...(packCost && { packCost })
    });
  };

  const handleBackToOnboarding = () => {
    onboardUser({
      ...user,
      onboardedAt: null
    });
  };

  if (!user || !user.onboardedAt) {
    const initialName = (user?.name && user.name !== 'Guest User' && user.name !== 'Guest') ? user.name : null;
    return (
      <View style={styles.container}>
        <OnboardingScreen
          onComplete={handleOnboardingComplete}
          initialName={initialName}
        />
      </View>
    );
  }

  if (!user.currentVape) {
    return (
      <View style={styles.container}>
        <VapeSelectorScreen onSelect={handleVapeSelect} onBack={handleBackToOnboarding} />
      </View>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'tracker':
        return <TrackerScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'health':
        return <HealthTimelineScreen />;
      case 'rewards':
        return <RewardsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <TrackerScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </View>
  );
}

export default function App() {
  return (
    <PostHogProvider
      apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY || "phc_2ZqC26J8atHMVWFLuEAWPq0Osl2qPXcnxAuLAftwwvv"}
      options={{
        host: "https://us.i.posthog.com",
        // Enable automatic screen tracking
        captureApplicationLifecycleEvents: true,
        // Capture deep links
        captureDeepLinks: true,
        // Enable debug mode in development
        debug: __DEV__,
      }}
    >
      <SafeAreaProvider>
        <UserProvider>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.bgPrimary} />
          <AppContent />
        </UserProvider>
      </SafeAreaProvider>
    </PostHogProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  content: {
    flex: 1,
  },
});
