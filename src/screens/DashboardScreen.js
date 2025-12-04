import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, subDays, isSameDay, startOfWeek, addDays } from 'date-fns';
import { useUser } from '../context/UserContext';
import { COLORS, RADIUS, SPACING } from '../utils/constants';
import CustomBarChart from '../components/CustomBarChart';

const DashboardScreen = () => {
    const { user, logs } = useUser();
    const [cigsAvoided, setCigsAvoided] = useState(0);
    const [realTimeSavings, setRealTimeSavings] = useState(0);

    const todayLogs = (logs || []).filter(log => {
        if (!log.timestamp) return false;
        const date = new Date(log.timestamp);
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    });

    // Nicotine Equivalence Calculation (EXACT same logic as web app)
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

    const percentage = Math.round((todayLogs.length / dailyGoalPuffs) * 100);
    const vapedEquivalent = (todayLogs.length / PUFFS_PER_CIGARETTE).toFixed(1);

    // Money Saved Logic (EXACT same as web app)
    const cigsPerDay = Number(user?.cigarettesPerDay) || 0;
    const cigsPerPack = Number(user?.cigarettesPerPack) || 20;
    const packCost = Number(user?.packCost) || 0;

    const vapeSize = Number(user?.currentVape?.size) || 2;
    const vapeCost = Number(user?.currentVape?.cost) || 15;

    const totalPuffsPerDevice = vapeSize * PUFFS_PER_ML;
    const costPerPuff = vapeCost / totalPuffsPerDevice;
    const dailySmokingCost = (cigsPerDay / cigsPerPack) * packCost;

    // Real-time Counters (EXACT same as web app)
    useEffect(() => {
        if (!user?.onboardedAt) return;

        const updateStats = () => {
            const now = new Date();
            const onboarded = new Date(user.onboardedAt);

            if (isNaN(onboarded.getTime())) return;

            const msSince = now - onboarded;
            const daysSince = Math.max(0, msSince / (1000 * 60 * 60 * 24));

            // Cigs Avoided
            const avoided = (daysSince * cigsPerDay).toFixed(4);
            setCigsAvoided(avoided);

            // Money Saved (Dynamic)
            const projectedSmokingCost = daysSince * dailySmokingCost;
            const actualVapingCost = (logs || []).length * costPerPuff;
            const netSavings = projectedSmokingCost - actualVapingCost;

            setRealTimeSavings(netSavings.toFixed(4));
        };

        updateStats();
        const interval = setInterval(updateStats, 100);
        return () => clearInterval(interval);
    }, [user, logs, dailySmokingCost, cigsPerDay, costPerPuff]);

    // Prepare Chart Data (Rolling 7 Days)
    const getWeekDays = () => {
        const today = new Date();
        // Rolling window: last 7 days including today
        return Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i));
    };

    const chartData = getWeekDays().map((date) => {
        const dayLogs = (logs || []).filter(log => isSameDay(new Date(log.timestamp), date));
        // For chart, if former smoker, show cigs equivalent. If current vaper, show puffs.
        const value = isFormerSmoker
            ? dayLogs.length / PUFFS_PER_CIGARETTE
            : dayLogs.length;

        const limit = isFormerSmoker ? user.cigarettesPerDay : user.dailyPuffGoal;
        const pct = Math.round((value / limit) * 100);

        return {
            label: format(date, 'EEE'), // Mon, Tue, Wed, etc.
            value: value,
            puffs: dayLogs.length,
            percentage: pct,
            isAboveLimit: value > limit
        };
    });

    const getProgressColor = (pct) => {
        if (pct < 50) return COLORS.success;
        if (pct < 100) return COLORS.warning;
        return COLORS.danger;
    };

    const screenWidth = Dimensions.get('window').width;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Daily Nicotine Progress */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Daily Goal</Text>
                        <Text style={[styles.progressPercentage, { color: getProgressColor(percentage) }]}>
                            {percentage}% of {isFormerSmoker ? 'old habit' : 'daily limit'}
                        </Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                        <View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: `${Math.min(100, percentage)}%`,
                                    backgroundColor: getProgressColor(percentage)
                                }
                            ]}
                        />
                    </View>
                    <Text style={styles.progressSubtext}>
                        {todayLogs.length} puffs vs {isFormerSmoker
                            ? `${user?.cigarettesPerDay || 0} cigarettes`
                            : `${user?.dailyPuffGoal || 100} puffs limit`}
                    </Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {/* Money Saved - Only relevant for former smokers usually, but maybe useful for vapers too if they want to track cost? 
                        For now, let's keep it for former smokers, and show something else for current vapers */}

                    {isFormerSmoker ? (
                        <>
                            <View style={styles.statCard}>
                                <Ionicons
                                    name="cash"
                                    size={24}
                                    color={realTimeSavings < 0 ? COLORS.danger : COLORS.success}
                                    style={styles.statIcon}
                                />
                                <Text style={[
                                    styles.statValue,
                                    { color: realTimeSavings < 0 ? COLORS.danger : COLORS.textPrimary }
                                ]}>
                                    {realTimeSavings < 0
                                        ? `-$${Math.abs(realTimeSavings)}`
                                        : `$${realTimeSavings}`}
                                </Text>
                                <Text style={styles.statLabel}>Net Money Saved</Text>
                                <Text style={styles.statSubLabel}>(minus actual vaping costs)</Text>
                            </View>

                            <View style={styles.statCard}>
                                <Ionicons
                                    name="ban"
                                    size={24}
                                    color={COLORS.textSecondary}
                                    style={styles.statIcon}
                                />
                                <Text style={[styles.statValue, styles.monoFont]}>{cigsAvoided}</Text>
                                <Text style={styles.statLabel}>Cigs Not Smoked</Text>
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.statCard}>
                                <Ionicons
                                    name="stats-chart"
                                    size={24}
                                    color={percentage > 100 ? COLORS.danger : COLORS.success}
                                    style={styles.statIcon}
                                />
                                <Text style={[
                                    styles.statValue,
                                    { color: percentage > 100 ? COLORS.danger : COLORS.textPrimary }
                                ]}>
                                    {Math.max(0, dailyGoalPuffs - todayLogs.length)}
                                </Text>
                                <Text style={styles.statLabel}>Puffs Remaining</Text>
                                <Text style={styles.statSubLabel}>for today</Text>
                            </View>

                            <View style={styles.statCard}>
                                <Ionicons
                                    name="wallet"
                                    size={24}
                                    color={COLORS.textSecondary}
                                    style={styles.statIcon}
                                />
                                <Text style={[styles.statValue, styles.monoFont]}>
                                    ${((logs || []).length * costPerPuff).toFixed(2)}
                                </Text>
                                <Text style={styles.statLabel}>Total Spent</Text>
                                <Text style={styles.statSubLabel}>on vaping so far</Text>
                            </View>
                        </>
                    )}

                    {/* Today's Vaping Equivalent - Keep for both but maybe rephrase for current vapers? 
                        Actually, nicotine equivalent is still interesting for current vapers to know how many cigs they ARE smoking. */}
                    <View style={[styles.statCard, styles.statCardWide]}>
                        <Text style={styles.statLabelSmall}>Today's Vaping Equivalent</Text>
                        <Text style={[styles.statValueLarge, { color: getProgressColor(percentage) }]}>
                            ~{vapedEquivalent} Cigarettes
                        </Text>
                        <Text style={styles.statSubLabelSmall}>
                            Based on {vapeNicotine}mg/ml ({PUFFS_PER_CIGARETTE} puffs ≈ 1 cig)
                        </Text>
                    </View>
                </View>

                {/* Weekly Trends Chart */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Weekly Trends</Text>
                    <CustomBarChart
                        data={chartData}
                        oldHabitLine={isFormerSmoker ? user.cigarettesPerDay : user.dailyPuffGoal}
                        width={screenWidth - (SPACING.lg * 2)}
                        height={240}
                        limitLabel={isFormerSmoker ? 'of old habit' : 'of daily limit'}
                    />
                    {/* Reference line indicator */}
                    <View style={styles.chartLegend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
                            <Text style={styles.legendText}>Below {isFormerSmoker ? 'old habit' : 'daily limit'}</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: COLORS.danger }]} />
                            <Text style={styles.legendText}>Above {isFormerSmoker ? 'old habit' : 'daily limit'}</Text>
                        </View>
                    </View>
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
    progressCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    progressLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    progressPercentage: {
        fontSize: 14,
        fontWeight: '600',
    },
    progressBarTrack: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressSubtext: {
        marginTop: SPACING.sm,
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    statCardWide: {
        width: '100%',
        minWidth: '100%',
    },
    statIcon: {
        marginBottom: SPACING.sm,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    statValueLarge: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: SPACING.xs,
    },
    monoFont: {
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    statLabel: {
        fontSize: 13,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    statSubLabel: {
        fontSize: 10,
        color: COLORS.textSecondary,
        marginTop: 2,
        textAlign: 'center',
    },
    statLabelSmall: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    statSubLabelSmall: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    chartCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    chart: {
        borderRadius: RADIUS.md,
    },
    chartLegend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.lg,
        marginTop: SPACING.md,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
});

export default DashboardScreen;
