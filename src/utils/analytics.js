// Simplified analytics helper using PostHog hooks
// Use this in your components to track events

import { usePostHog } from 'posthog-react-native';

// Event name constants (for consistency)
export const EVENTS = {
    // User Events
    USER_SIGNED_UP: 'user_signed_up',
    USER_LOGGED_IN: 'user_logged_in',
    USER_LOGGED_OUT: 'user_logged_out',

    // Onboarding
    ONBOARDING_STARTED: 'onboarding_started',
    ONBOARDING_COMPLETED: 'onboarding_completed',
    ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
    VAPE_SELECTED: 'vape_selected',

    // Core Features
    PUFF_LOGGED: 'puff_logged',
    JUICE_LEVEL_UPDATED: 'juice_level_updated',
    JUICE_PURCHASED: 'juice_purchased',
    COLD_TURKEY_ACTIVATED: 'cold_turkey_activated',
    COLD_TURKEY_DEACTIVATED: 'cold_turkey_deactivated',

    // Rewards
    REWARD_PURCHASED: 'reward_purchased',
    REWARD_EQUIPPED: 'reward_equipped',
    XP_EARNED: 'xp_earned',

    // Profile
    PROFILE_UPDATED: 'profile_updated',
    SETTINGS_CHANGED: 'settings_changed',

    // Social
    PROGRESS_SHARED: 'progress_shared',

    // Screens
    SCREEN_VIEWED: 'screen_viewed',

    // Errors
    ERROR_OCCURRED: 'error_occurred',
    SYNC_FAILED: 'sync_failed',
    API_ERROR: 'api_error',
};

// Screen name constants
export const SCREENS = {
    ONBOARDING: 'Onboarding',
    VAPE_SELECTOR: 'VapeSelector',
    TRACKER: 'Tracker',
    DASHBOARD: 'Dashboard',
    HEALTH: 'HealthTimeline',
    REWARDS: 'Rewards',
    PROFILE: 'Profile',
    DIAGNOSTIC: 'Diagnostic',
};

// Hook to use PostHog in components
export { usePostHog };

// Helper function to track events (can be used outside components)
let posthogInstance = null;

export const setPostHogInstance = (instance) => {
    posthogInstance = instance;
};

export const trackEvent = (eventName, properties = {}) => {
    if (posthogInstance) {
        posthogInstance.capture(eventName, properties);
        if (__DEV__) {
            console.log(`📊 Event: ${eventName}`, properties);
        }
    } else {
        console.warn('⚠️ PostHog not initialized');
    }
};

export const identifyUser = (userId, properties = {}) => {
    if (posthogInstance) {
        posthogInstance.identify(userId, properties);
        if (__DEV__) {
            console.log(`👤 User identified: ${userId}`, properties);
        }
    }
};

export const trackScreen = (screenName, properties = {}) => {
    if (posthogInstance) {
        posthogInstance.screen(screenName, properties);
        if (__DEV__) {
            console.log(`📱 Screen: ${screenName}`, properties);
        }
    }
};

export const resetAnalytics = () => {
    if (posthogInstance) {
        posthogInstance.reset();
        if (__DEV__) {
            console.log('🔄 Analytics reset');
        }
    }
};
