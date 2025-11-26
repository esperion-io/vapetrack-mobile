import React, { useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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

  if (!user || !user.onboardedAt) {
    return (
      <View style={styles.container}>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </View>
    );
  }

  if (!user.currentVape) {
    return (
      <View style={styles.container}>
        <VapeSelectorScreen onSelect={handleVapeSelect} />
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
    <SafeAreaProvider>
      <UserProvider>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bgPrimary} />
        <AppContent />
      </UserProvider>
    </SafeAreaProvider>
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
