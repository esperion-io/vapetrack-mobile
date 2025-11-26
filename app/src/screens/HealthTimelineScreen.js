import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { COLORS, RADIUS, SPACING } from '../utils/constants';

const MILESTONES = [
    { id: 1, title: 'Heart Rate Normalizes', time: 20 * 60 * 1000, icon: 'heart', desc: '20 Minutes' },
    { id: 2, title: 'CO Levels Drop', time: 12 * 60 * 60 * 1000, icon: 'cloud', desc: '12 Hours' },
    { id: 3, title: 'Nicotine Clears', time: 48 * 60 * 60 * 1000, icon: 'pulse', desc: '48 Hours' },
    { id: 4, title: 'Taste & Smell Improve', time: 48 * 60 * 60 * 1000, icon: 'restaurant', desc: '48 Hours' },
    { id: 5, title: 'Breathing Improves', time: 72 * 60 * 60 * 1000, icon: 'cloud', desc: '3 Days' },
    { id: 6, title: 'Circulation Improves', time: 14 * 24 * 60 * 60 * 1000, icon: 'walk', desc: '2 Weeks' },
    { id: 7, title: 'Withdrawal Gone', time: 30 * 24 * 60 * 60 * 1000, icon: 'happy', desc: '1 Month' },
    { id: 8, title: 'Lung Function +10%', time: 90 * 24 * 60 * 60 * 1000, icon: 'flash', desc: '3 Months' },
    { id: 9, title: 'Lungs Healed', time: 270 * 24 * 60 * 60 * 1000, icon: 'shield-checkmark', desc: '9 Months' },
    { id: 10, title: 'Heart Disease Risk Halved', time: 365 * 24 * 60 * 60 * 1000, icon: 'heart', desc: '1 Year' },
];

const HealthTimelineScreen = () => {
    const { user, logs } = useUser();
    const [timeSinceLastPuff, setTimeSinceLastPuff] = useState('0s');
    const [timeSinceLastPuffMs, setTimeSinceLastPuffMs] = useState(0);

    // Calculate time since last puff for milestones
    const getLastPuffTime = () => {
        if (logs.length > 0) {
            return new Date(logs[logs.length - 1].timestamp).getTime();
        }
        // If no logs, fallback to onboarding time or now if not onboarded
        return user.onboardedAt ? new Date(user.onboardedAt).getTime() : new Date().getTime();
    };

    useEffect(() => {
        const updateTimer = () => {
            const lastPuffTime = getLastPuffTime();
            const now = new Date().getTime();
            const diff = Math.max(0, now - lastPuffTime);

            setTimeSinceLastPuffMs(diff);

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeSinceLastPuff(`${hours}h ${minutes}m ${seconds}s`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [logs]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Time Since Last Puff Header */}
                <View style={styles.timerCard}>
                    <View style={styles.timerHeader}>
                        <Ionicons name="time" size={16} color={COLORS.textSecondary} />
                        <Text style={styles.timerLabel}>TIME SINCE LAST PUFF</Text>
                    </View>
                    <Text style={styles.timerValue}>{timeSinceLastPuff}</Text>
                    <Text style={styles.timerSubtext}>Your body is healing right now!</Text>
                </View>

                {/* Timeline */}
                <View style={styles.timelineContainer}>
                    {/* Vertical Line */}
                    <View style={styles.verticalLine} />

                    {MILESTONES.map((milestone, index) => {
                        const isUnlocked = timeSinceLastPuffMs >= milestone.time;

                        return (
                            <View key={milestone.id} style={styles.milestoneContainer}>
                                {/* Dot */}
                                <View
                                    style={[
                                        styles.dot,
                                        isUnlocked && styles.dotUnlocked,
                                    ]}
                                />

                                {/* Milestone Card */}
                                <View
                                    style={[
                                        styles.milestoneCard,
                                        isUnlocked && styles.milestoneCardUnlocked,
                                        !isUnlocked && styles.milestoneCardLocked,
                                    ]}
                                >
                                    <View style={styles.milestoneHeader}>
                                        <View
                                            style={[
                                                styles.iconContainer,
                                                isUnlocked && styles.iconContainerUnlocked,
                                            ]}
                                        >
                                            <Ionicons
                                                name={milestone.icon}
                                                size={20}
                                                color={isUnlocked ? COLORS.success : COLORS.textSecondary}
                                            />
                                        </View>
                                        <View style={styles.milestoneTextContainer}>
                                            <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                                            <Text style={styles.milestoneDesc}>{milestone.desc}</Text>
                                        </View>
                                    </View>
                                    {isUnlocked && (
                                        <Text style={styles.achievedText}>ACHIEVED</Text>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
        paddingBottom: 120,
    },
    timerCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primaryGlow,
    },
    timerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginBottom: SPACING.sm,
    },
    timerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    timerValue: {
        fontSize: 40,
        fontWeight: '800',
        color: COLORS.primary,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    timerSubtext: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: SPACING.sm,
    },
    timelineContainer: {
        position: 'relative',
        paddingLeft: 20,
    },
    verticalLine: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: COLORS.bgTertiary,
    },
    milestoneContainer: {
        marginBottom: SPACING.xl,
        position: 'relative',
    },
    dot: {
        position: 'absolute',
        left: -25,
        top: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.bgTertiary,
        borderWidth: 2,
        borderColor: COLORS.bgPrimary,
    },
    dotUnlocked: {
        backgroundColor: COLORS.success,
    },
    milestoneCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        borderWidth: 1,
    },
    milestoneCardLocked: {
        opacity: 0.5,
        borderColor: COLORS.bgTertiary,
    },
    milestoneCardUnlocked: {
        opacity: 1,
        borderColor: COLORS.success,
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    milestoneHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm + 4,
        marginBottom: SPACING.xs,
    },
    iconContainer: {
        padding: SPACING.sm,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.bgTertiary,
    },
    iconContainerUnlocked: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    milestoneTextContainer: {
        flex: 1,
    },
    milestoneTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    milestoneDesc: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    achievedText: {
        fontSize: 13,
        color: COLORS.success,
        fontWeight: '500',
        marginTop: SPACING.xs,
    },
});

export default HealthTimelineScreen;
