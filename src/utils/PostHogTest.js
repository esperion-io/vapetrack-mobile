// Test file to send immediate events to PostHog
// Run this once to verify PostHog is working

import { useEffect } from 'react';
import { usePostHog } from 'posthog-react-native';

export const PostHogTest = () => {
    const posthog = usePostHog();

    useEffect(() => {
        // Send test event immediately
        posthog?.capture('app_opened', {
            test: true,
            timestamp: new Date().toISOString(),
            message: 'PostHog is working!'
        });

        console.log('📊 Test event sent to PostHog!');
    }, []);

    return null;
};
