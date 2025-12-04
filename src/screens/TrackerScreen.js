import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDistanceToNow } from 'date-fns';
import { usePostHog } from 'posthog-react-native';
import { useUser } from '../context/UserContext';
import { COLORS, RADIUS, SPACING } from '../utils/constants';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

const TrackerScreen = () => {
    const posthog = usePostHog();
    const { addLog, logs, user, juicePurchases, addJuicePurchase } = useUser();
    const [timeSinceLastPuff, setTimeSinceLastPuff] = useState('No logs yet');
    const [mode, setMode] = useState('puff'); // 'puff' or 'juice'
    const [puffMultiplier, setPuffMultiplier] = useState(1);
    const [isHolding, setIsHolding] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const holdTimeoutRef = useRef(null);
    const holdIntervalRef = useRef(null);

    // Calculate nicotine equivalence
    const PUFFS_PER_ML = 150;
    const ABSORBED_NICOTINE_PER_CIGARETTE = 2;
    const VAPE_ABSORPTION_RATE = 0.5;
    const vapeNicotine = Number(user?.currentVape?.nicotine) || 20;
    const nicotineContentPerPuff = vapeNicotine / PUFFS_PER_ML;
    const absorbedNicotinePerPuff = nicotineContentPerPuff * VAPE_ABSORPTION_RATE;
    const PUFFS_PER_CIGARETTE = Math.round(ABSORBED_NICOTINE_PER_CIGARETTE / absorbedNicotinePerPuff);

    // Determine baseline based on user type
    const isFormerSmoker = user?.userType !== 'current_vaper'; // Default to former smoker
    const dailyGoalPuffs = isFormerSmoker
        ? (user?.cigarettesPerDay || 10) * PUFFS_PER_CIGARETTE
        : (user?.dailyPuffGoal || 100);

    const todayLogs = logs.filter(log => {
        const date = new Date(log.timestamp);
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    });

    const puffCount = todayLogs.length;
    const progressPercentage = (puffCount / dailyGoalPuffs) * 100;

    // Circular Progress Constants
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const visualProgress = Math.min(progressPercentage, 100);
    const strokeDashoffset = circumference - (visualProgress / 100) * circumference;

    // Dynamic color based on percentage
    const getProgressColor = (pct) => {
        if (pct > 100) return COLORS.danger;
        if (pct >= 50) {
            const ratio = (pct - 50) / 50;
            const r = Math.round(245 + (239 - 245) * ratio);
            const g = Math.round(158 - (158 - 68) * ratio);
            const b = Math.round(11 + (68 - 11) * ratio);
            return `rgb(${r}, ${g}, ${b})`;
        }
        const ratio = pct / 50;
        const r = Math.round(16 + (245 - 16) * ratio);
        const g = Math.round(185 - (185 - 158) * ratio);
        const b = Math.round(129 - (129 - 11) * ratio);
        return `rgb(${r}, ${g}, ${b})`;
    };

    const progressColor = getProgressColor(progressPercentage);

    useEffect(() => {
        if (logs.length === 0) return;

        const updateTime = () => {
            const lastLog = logs[logs.length - 1];
            setTimeSinceLastPuff(formatDistanceToNow(new Date(lastLog.timestamp), { addSuffix: true }));
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [logs]);

    // Track screen view
    useEffect(() => {
        posthog?.screen('Tracker');
    }, []);

    const handlePressIn = () => {
        setIsHolding(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();

        addLog(puffMultiplier);

        holdTimeoutRef.current = setTimeout(() => {
            holdIntervalRef.current = setInterval(() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                addLog(puffMultiplier);
            }, 200);
        }, 300);
    };

    const handlePressOut = () => {
        setIsHolding(false);
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();

        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
            holdTimeoutRef.current = null;
        }

        if (holdIntervalRef.current) {
            clearInterval(holdIntervalRef.current);
            holdIntervalRef.current = null;
        }
    };

    const dailyAvg = (() => {
        if (logs.length === 0) return '0 puffs';
        const uniqueDays = new Set(logs.map(log => new Date(log.timestamp).toDateString())).size;
        const avg = Math.round(logs.length / (uniqueDays || 1));
        return `${avg} puffs`;
    })();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Mode Switcher */}
                <View style={styles.modeSwitcher}>
                    <TouchableOpacity
                        style={[styles.modeButton, mode === 'puff' && styles.modeButtonActive]}
                        onPress={() => setMode('puff')}
                    >
                        <Text style={[styles.modeButtonText, mode === 'puff' && styles.modeButtonTextActive]}>
                            Tracker
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modeButton, mode === 'juice' && styles.modeButtonActive]}
                        onPress={() => setMode('juice')}
                    >
                        <Text style={[styles.modeButtonText, mode === 'juice' && styles.modeButtonTextActive]}>
                            Juice
                        </Text>
                    </TouchableOpacity>
                </View>

                {mode === 'puff' ? (
                    <>
                        {/* Circular Progress Ring */}
                        <View style={styles.progressContainer}>
                            <View style={styles.glowEffect} />
                            <Svg width={240} height={240} style={styles.progressSvg}>
                                {/* Track */}
                                <Circle
                                    cx="120"
                                    cy="120"
                                    r={radius}
                                    fill="transparent"
                                    stroke={COLORS.bgTertiary}
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                />
                                {/* Progress */}
                                <Circle
                                    cx="120"
                                    cy="120"
                                    r={radius}
                                    fill="transparent"
                                    stroke={progressColor}
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    rotation="-90"
                                    origin="120, 120"
                                />
                            </Svg>

                            <View style={styles.progressText}>
                                <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
                                <Text style={styles.progressLabel}>
                                    {isFormerSmoker ? 'of old habit' : 'of daily limit'}
                                </Text>
                                <Text style={styles.puffCount}>{puffCount} puffs today</Text>
                            </View>
                        </View>

                        {/* Stats Row */}
                        <View style={styles.statsRow}>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>Last Puff</Text>
                                <Text style={styles.statValue}>
                                    {timeSinceLastPuff.replace('less than a minute', 'Just now')}
                                </Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>Daily Avg</Text>
                                <Text style={styles.statValue}>{dailyAvg}</Text>
                            </View>
                        </View>

                        {/* Multiplier Selector */}
                        <View style={styles.multiplierContainer}>
                            {[1, 5, 10].map((value) => (
                                <TouchableOpacity
                                    key={value}
                                    style={[
                                        styles.multiplierButton,
                                        puffMultiplier === value && styles.multiplierButtonActive
                                    ]}
                                    onPress={() => {
                                        Haptics.selectionAsync();
                                        setPuffMultiplier(value);
                                    }}
                                >
                                    <Text style={[
                                        styles.multiplierText,
                                        puffMultiplier === value && styles.multiplierTextActive
                                    ]}>
                                        {value}x
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Floating Action Button */}
                        <View style={styles.fabContainer}>
                            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                                <TouchableOpacity
                                    onPressIn={handlePressIn}
                                    onPressOut={handlePressOut}
                                    activeOpacity={0.8}
                                    style={[styles.fab, isHolding && styles.fabPressed]}
                                >
                                    <Ionicons name="cloud" size={32} color="#fff" />
                                </TouchableOpacity>
                            </Animated.View>
                            <Text style={styles.fabLabel}>
                                {isHolding
                                    ? `Logging ${puffMultiplier} puff${puffMultiplier > 1 ? 's' : ''}...`
                                    : `Tap or Hold to Log ${puffMultiplier > 1 ? `(${puffMultiplier}x)` : ''}`}
                            </Text>
                        </View>
                    </>
                ) : (
                    <View style={styles.juiceContainer}>
                        {/* New Juice Button */}
                        <TouchableOpacity
                            style={styles.newJuiceButton}
                            onPress={() => {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                addJuicePurchase();
                            }}
                        >
                            <Ionicons name="water" size={24} color="#000" />
                            <Text style={styles.newJuiceButtonText}>New Juice Bought</Text>
                        </TouchableOpacity>

                        {/* Purchase History */}
                        {juicePurchases.length > 0 ? (
                            <View>
                                {/* Table Header */}
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>Date</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>Time Since Last</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Puffs</Text>
                                </View>

                                {/* Table Rows */}
                                {juicePurchases.slice().reverse().map((purchase, index) => {
                                    const purchaseDate = new Date(purchase.timestamp);
                                    const timeSinceLast = index < juicePurchases.length - 1
                                        ? formatDistanceToNow(new Date(juicePurchases[juicePurchases.length - 2 - index].timestamp), { addSuffix: false })
                                        : 'First purchase';

                                    return (
                                        <View key={purchase.id} style={styles.tableRow}>
                                            <Text style={[styles.tableCell, { flex: 2 }]}>
                                                {purchaseDate.toLocaleDateString()}
                                            </Text>
                                            <Text style={[styles.tableCell, styles.tableCellSecondary, { flex: 2 }]}>
                                                {timeSinceLast}
                                            </Text>
                                            <Text style={[styles.tableCell, styles.tableCellAccent, { flex: 1, textAlign: 'right' }]}>
                                                {purchase.puffsSinceLast}
                                            </Text>
                                        </View>
                                    );
                                })}

                                {/* Average Stats */}
                                <View style={styles.statCardLarge}>
                                    <Text style={styles.statLabelSmall}>Average Puffs Per Juice</Text>
                                    <Text style={styles.statValueLarge}>
                                        {Math.round(juicePurchases.reduce((sum, p) => sum + p.puffsSinceLast, 0) / juicePurchases.length)}
                                    </Text>
                                </View>

                                <View style={styles.statCardLarge}>
                                    <Text style={styles.statLabelSmall}>Average Time Between Bottles</Text>
                                    <Text style={styles.statValueLarge}>
                                        {(() => {
                                            if (juicePurchases.length < 2) return 'N/A';
                                            const first = new Date(juicePurchases[0].timestamp);
                                            const last = new Date(juicePurchases[juicePurchases.length - 1].timestamp);
                                            const diffMs = last - first;
                                            const avgMs = diffMs / (juicePurchases.length - 1);
                                            const days = Math.round(avgMs / (1000 * 60 * 60 * 24));

                                            if (days < 1) {
                                                const hours = Math.round(avgMs / (1000 * 60 * 60));
                                                return `${hours} hours`;
                                            }
                                            return `${days} days`;
                                        })()}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="water" size={48} color={COLORS.textSecondary} style={{ opacity: 0.3 }} />
                                <Text style={styles.emptyStateText}>No juice purchases tracked yet</Text>
                                <Text style={styles.emptyStateSubtext}>Tap "New Juice Bought" to start tracking</Text>
                            </View>
                        )}
                    </View>
                )}
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
        alignItems: 'center',
    },
    modeSwitcher: {
        flexDirection: 'row',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.lg,
        padding: 4,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.bgTertiary,
    },
    modeButton: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.lg,
        borderRadius: RADIUS.md,
        minWidth: 100,
        alignItems: 'center',
    },
    modeButtonActive: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 5,
    },
    modeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    modeButtonTextActive: {
        color: '#fff',
    },
    progressContainer: {
        width: 240,
        height: 240,
        marginBottom: SPACING.md,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    glowEffect: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: COLORS.primaryGlow,
        opacity: 0.1,
    },
    progressSvg: {
        position: 'absolute',
    },
    progressText: {
        alignItems: 'center',
        zIndex: 1,
    },
    progressPercentage: {
        fontSize: 56,
        fontWeight: '800',
        color: COLORS.textPrimary,
        lineHeight: 56,
    },
    progressLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: SPACING.sm,
    },
    puffCount: {
        fontSize: 12,
        color: COLORS.primary,
        marginTop: SPACING.xs,
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        padding: SPACING.sm,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.bgTertiary,
    },
    statLabel: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginBottom: 2,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
    fabContainer: {
        alignItems: 'center',
        marginTop: 'auto',
    },
    fab: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 10,
    },
    fabPressed: {
        shadowOpacity: 0.8,
    },
    fabLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
    },
    juiceContainer: {
        width: '100%',
    },
    newJuiceButton: {
        width: '100%',
        padding: SPACING.md + 4,
        backgroundColor: COLORS.accent,
        borderRadius: RADIUS.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.xl,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5,
    },
    newJuiceButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.bgTertiary,
        paddingVertical: SPACING.sm + 4,
    },
    tableHeaderText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.bgTertiary,
        paddingVertical: SPACING.sm + 4,
    },
    tableCell: {
        fontSize: 14,
        color: COLORS.textPrimary,
    },
    tableCellSecondary: {
        color: COLORS.textSecondary,
    },
    tableCellAccent: {
        fontWeight: '600',
        color: COLORS.accent,
    },
    statCardLarge: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.bgTertiary,
    },
    statLabelSmall: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    statValueLarge: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.accent,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: SPACING.xl * 2,
    },
    emptyStateText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
    },
    emptyStateSubtext: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: SPACING.sm,
    },
    multiplierContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.lg,
        padding: 4,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.bgTertiary,
        gap: 4,
    },
    multiplierButton: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.lg,
        borderRadius: RADIUS.md,
        minWidth: 60,
        alignItems: 'center',
    },
    multiplierButtonActive: {
        backgroundColor: COLORS.primary,
    },
    multiplierText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    multiplierTextActive: {
        color: '#fff',
    },
});

export default TrackerScreen;
