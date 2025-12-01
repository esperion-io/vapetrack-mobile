import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { COLORS, RADIUS, SPACING } from '../utils/constants';

const REWARDS = [
    { id: 'icon_star', name: '⭐ Star Icon', cost: 500, type: 'icon', icon: '⭐', description: 'Shiny star profile icon' },
    { id: 'icon_fire', name: '🔥 Fire Icon', cost: 1000, type: 'icon', icon: '🔥', description: 'Hot fire profile icon' },
    { id: 'icon_cloud', name: '☁️ Cloud Icon', cost: 1500, type: 'icon', icon: '☁️', description: 'Fluffy cloud profile icon' },
    { id: 'icon_rainbow', name: '🌈 Rainbow Icon', cost: 2500, type: 'icon', icon: '🌈', description: 'Colorful rainbow icon' },
    { id: 'icon_bear', name: '🧸 Cute Bear', cost: 3000, type: 'icon', icon: '🧸', description: 'Adorable teddy bear icon' },
    { id: 'icon_rocket', name: '🚀 Rocket', cost: 4000, type: 'icon', icon: '🚀', description: 'To the moon!' },
    { id: 'icon_gangster_bear', name: '😎 Cool Bear', cost: 5000, type: 'icon', icon: '😎', description: 'Gangster teddy bear' },
    { id: 'icon_crown', name: '👑 Crown Icon', cost: 6000, type: 'icon', icon: '👑', description: 'Royal crown icon' },
    { id: 'border_gold', name: '✨ Gold Border', cost: 7500, type: 'border', description: 'Shining gold profile border' },
    { id: 'border_rainbow', name: '🌟 Rainbow Border', cost: 10000, type: 'border', description: 'Animated rainbow border' },
];

const RewardsScreen = () => {
    const { user, logs, xp, purchasedRewards, equippedRewards, purchaseReward, equipReward, unequipReward } = useUser();

    // Calculate Projected XP for Today (EXACT same logic as web app)
    const calculateProjectedXP = () => {
        const now = new Date();
        const todayLogs = logs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate.toDateString() === now.toDateString();
        });

        const PUFFS_PER_ML = 150;
        const ABSORBED_NICOTINE_PER_CIGARETTE = 2;
        const VAPE_ABSORPTION_RATE = 0.5;
        const vapeNicotine = Number(user?.currentVape?.nicotine) || 20;
        const nicotineContentPerPuff = vapeNicotine / PUFFS_PER_ML;
        const absorbedNicotinePerPuff = nicotineContentPerPuff * VAPE_ABSORPTION_RATE;
        const PUFFS_PER_CIGARETTE = Math.round(ABSORBED_NICOTINE_PER_CIGARETTE / absorbedNicotinePerPuff);
        const oldDailyNicotinePuffs = (user?.cigarettesPerDay || 10) * PUFFS_PER_CIGARETTE;

        const percentage = (todayLogs.length / oldDailyNicotinePuffs) * 100;

        if (percentage >= 100) return 0;
        return Math.round((100 - percentage) * 10);
    };

    const projectedXP = calculateProjectedXP();

    const handlePurchase = (reward) => {
        const success = purchaseReward(reward.id, reward.cost);
        if (success) {
            console.log(`Purchased ${reward.name}!`);
        }
    };

    const handleEquip = (reward) => {
        if (equippedRewards[reward.type] === reward.id) {
            unequipReward(reward.type);
        } else {
            equipReward(reward.id, reward.type);
        }
    };

    const groupedRewards = {
        icons: REWARDS.filter(r => r.type === 'icon'),
        borders: REWARDS.filter(r => r.type === 'border'),
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* XP Header Card */}
                <View style={styles.xpCard}>
                    <Text style={styles.xpValue}>{xp} XP</Text>
                    <Text style={styles.levelText}>LEVEL {Math.floor(xp / 1000) + 1}</Text>

                    <View style={styles.projectedXPContainer}>
                        <Text style={styles.projectedXPLabel}>Projected XP Today</Text>
                        <Text style={[
                            styles.projectedXPValue,
                            { color: projectedXP > 0 ? COLORS.textPrimary : COLORS.danger }
                        ]}>
                            +{projectedXP}
                        </Text>
                        <Text style={styles.projectedXPSubtext}>
                            {projectedXP > 0
                                ? "Keep your puffs low to secure this!"
                                : "Daily limit reached. No XP today."}
                        </Text>
                    </View>
                </View>

                {/* Profile Icons Section */}
                <View style={styles.sectionHeader}>
                    <Ionicons name="happy" size={20} color={COLORS.accent} />
                    <Text style={styles.sectionTitle}>Profile Icons</Text>
                </View>

                <View style={styles.iconsGrid}>
                    {groupedRewards.icons.map(reward => {
                        const isPurchased = purchasedRewards.includes(reward.id);
                        const canAfford = xp >= reward.cost;
                        const isEquipped = equippedRewards.icon === reward.id;

                        return (
                            <View
                                key={reward.id}
                                style={[
                                    styles.iconCard,
                                    isPurchased && styles.iconCardPurchased,
                                ]}
                            >
                                <Text style={styles.rewardIcon}>{reward.icon}</Text>
                                <Text style={styles.rewardName}>{reward.name}</Text>
                                <Text style={styles.rewardDescription}>{reward.description}</Text>

                                {isPurchased ? (
                                    <TouchableOpacity
                                        style={[
                                            styles.equipButton,
                                            isEquipped && styles.equipButtonActive,
                                        ]}
                                        onPress={() => handleEquip(reward)}
                                    >
                                        <Text style={styles.equipButtonText}>
                                            {isEquipped ? 'Equipped ✓' : 'Equip'}
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={[
                                            styles.purchaseButton,
                                            !canAfford && styles.purchaseButtonDisabled,
                                        ]}
                                        onPress={() => handlePurchase(reward)}
                                        disabled={!canAfford}
                                    >
                                        <Text style={[
                                            styles.purchaseButtonText,
                                            !canAfford && styles.purchaseButtonTextDisabled,
                                        ]}>
                                            {reward.cost} XP
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Profile Borders Section */}
                <View style={styles.sectionHeader}>
                    <Ionicons name="sparkles" size={20} color={COLORS.accent} />
                    <Text style={styles.sectionTitle}>Profile Borders</Text>
                </View>

                <View style={styles.bordersContainer}>
                    {groupedRewards.borders.map(reward => {
                        const isPurchased = purchasedRewards.includes(reward.id);
                        const canAfford = xp >= reward.cost;
                        const isEquipped = equippedRewards.border === reward.id;

                        return (
                            <View
                                key={reward.id}
                                style={[
                                    styles.borderCard,
                                    isPurchased && styles.borderCardPurchased,
                                ]}
                            >
                                <View style={styles.borderCardContent}>
                                    <View>
                                        <Text style={styles.borderName}>{reward.name}</Text>
                                        <Text style={styles.borderDescription}>{reward.description}</Text>
                                    </View>

                                    {isPurchased ? (
                                        <TouchableOpacity
                                            style={[
                                                styles.borderEquipButton,
                                                isEquipped && styles.borderEquipButtonActive,
                                            ]}
                                            onPress={() => handleEquip(reward)}
                                        >
                                            <Text style={styles.borderEquipButtonText}>
                                                {isEquipped ? 'Equipped ✓' : 'Equip'}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={[
                                                styles.borderPurchaseButton,
                                                !canAfford && styles.borderPurchaseButtonDisabled,
                                            ]}
                                            onPress={() => handlePurchase(reward)}
                                            disabled={!canAfford}
                                        >
                                            <Text style={[
                                                styles.borderPurchaseButtonText,
                                                !canAfford && styles.borderPurchaseButtonTextDisabled,
                                            ]}>
                                                {reward.cost} XP
                                            </Text>
                                        </TouchableOpacity>
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
    xpCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        padding: SPACING.xl,
        marginBottom: SPACING.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primaryGlow,
    },
    xpValue: {
        fontSize: 48,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: SPACING.sm,
    },
    levelText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textSecondary,
        letterSpacing: 1,
        opacity: 0.8,
    },
    projectedXPContainer: {
        marginTop: SPACING.lg,
        backgroundColor: COLORS.bgPrimary,
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
        borderWidth: 1,
        borderColor: COLORS.bgTertiary,
        width: '100%',
        alignItems: 'center',
    },
    projectedXPLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    projectedXPValue: {
        fontSize: 32,
        fontWeight: '800',
    },
    projectedXPSubtext: {
        fontSize: 12,
        color: COLORS.textSecondary,
        opacity: 0.8,
        marginTop: SPACING.xs,
        textAlign: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    iconsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: SPACING.xl,
    },
    iconCard: {
        width: '48%',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.bgTertiary,
    },
    iconCardPurchased: {
        backgroundColor: 'rgba(45, 212, 191, 0.1)',
        opacity: 0.6,
    },
    rewardIcon: {
        fontSize: 40,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    rewardName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    rewardDescription: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm + 4,
    },
    equipButton: {
        width: '100%',
        padding: SPACING.sm,
        backgroundColor: COLORS.bgTertiary,
        borderRadius: RADIUS.sm,
        alignItems: 'center',
    },
    equipButtonActive: {
        backgroundColor: COLORS.success,
    },
    equipButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
    },
    purchaseButton: {
        width: '100%',
        padding: SPACING.sm,
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.sm,
        alignItems: 'center',
    },
    purchaseButtonDisabled: {
        backgroundColor: COLORS.bgTertiary,
        opacity: 0.5,
    },
    purchaseButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    purchaseButtonTextDisabled: {
        color: COLORS.textSecondary,
    },
    bordersContainer: {
        gap: 10,
        marginBottom: SPACING.xl,
    },
    borderCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.bgTertiary,
    },
    borderCardPurchased: {
        backgroundColor: 'rgba(45, 212, 191, 0.1)',
        opacity: 0.6,
    },
    borderCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    borderName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    borderDescription: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    borderEquipButton: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        backgroundColor: COLORS.bgTertiary,
        borderRadius: 20,
    },
    borderEquipButtonActive: {
        backgroundColor: COLORS.success,
    },
    borderEquipButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    borderPurchaseButton: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        backgroundColor: COLORS.primary,
        borderRadius: 20,
    },
    borderPurchaseButtonDisabled: {
        backgroundColor: COLORS.bgTertiary,
        opacity: 0.5,
    },
    borderPurchaseButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    borderPurchaseButtonTextDisabled: {
        color: COLORS.textSecondary,
    },
});

export default RewardsScreen;
