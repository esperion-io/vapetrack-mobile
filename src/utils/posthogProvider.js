// PostHog Analytics Provider for VapeTrack
import PostHog from 'posthog-react-native';

let posthogInstance = null;

export const initializePostHog = async () => {
    if (posthogInstance) {
        return posthogInstance;
    }

    try {
        posthogInstance = await PostHog.initAsync(
            // Get your API key from: https://app.posthog.com/project/settings
            process.env.EXPO_PUBLIC_POSTHOG_API_KEY || 'phc_YOUR_API_KEY_HERE',
            {
                // PostHog Cloud (US)
                host: 'https://us.i.posthog.com',

                // OR PostHog Cloud (EU) - uncomment if you prefer EU hosting
                // host: 'https://eu.i.posthog.com',

                // Automatically capture lifecycle events
                captureApplicationLifecycleEvents: true,

                // Capture deep links
                captureDeepLinks: true,

                // Enable session recording (optional)
                enableSessionReplay: false, // Set to true if you want session recordings

                // Debug mode (disable in production)
                debug: __DEV__,
            }
        );

        console.log('✅ PostHog initialized successfully');
        return posthogInstance;
    } catch (error) {
        console.error('❌ PostHog initialization failed:', error);
        return null;
    }
};

export const getPostHog = () => {
    if (!posthogInstance) {
        console.warn('⚠️ PostHog not initialized. Call initializePostHog() first.');
    }
    return posthogInstance;
};

// PostHog Provider for analytics utility
export class PostHogProvider {
    constructor() {
        this.posthog = null;
    }

    async init() {
        this.posthog = await initializePostHog();
    }

    identify(userId, properties = {}) {
        if (!this.posthog) return;

        this.posthog.identify(userId, properties);
        console.log('📊 PostHog: User identified', userId);
    }

    track(eventName, properties = {}) {
        if (!this.posthog) return;

        this.posthog.capture(eventName, properties);

        if (__DEV__) {
            console.log(`📊 PostHog: ${eventName}`, properties);
        }
    }

    screen(screenName, properties = {}) {
        if (!this.posthog) return;

        this.posthog.screen(screenName, properties);
    }

    reset() {
        if (!this.posthog) return;

        this.posthog.reset();
        console.log('📊 PostHog: User reset');
    }

    // Feature flags (optional)
    async isFeatureEnabled(flagKey) {
        if (!this.posthog) return false;

        return await this.posthog.isFeatureEnabled(flagKey);
    }

    // Get feature flag value
    async getFeatureFlag(flagKey) {
        if (!this.posthog) return null;

        return await this.posthog.getFeatureFlag(flagKey);
    }
}

export default PostHogProvider;
