import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../utils/constants';

const NavButton = ({ icon, label, active, onPress, isMain }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[styles.navButton, isMain && styles.mainButton]}
    >
        <Ionicons
            name={icon}
            size={isMain ? 32 : 20}
            color={active ? COLORS.primary : COLORS.textSecondary}
        />
        <Text style={[styles.navLabel, active && styles.navLabelActive]}>
            {label}
        </Text>
    </TouchableOpacity>
);

const BottomNav = ({ currentScreen, onNavigate }) => {
    return (
        <View style={styles.container}>
            <View style={styles.nav}>
                <NavButton
                    icon="stats-chart"
                    label="Stats"
                    active={currentScreen === 'dashboard'}
                    onPress={() => onNavigate('dashboard')}
                />
                <NavButton
                    icon="heart"
                    label="Health"
                    active={currentScreen === 'health'}
                    onPress={() => onNavigate('health')}
                />
                <NavButton
                    icon="add-circle"
                    label="Track"
                    active={currentScreen === 'tracker'}
                    onPress={() => onNavigate('tracker')}
                    isMain
                />
                <NavButton
                    icon="gift"
                    label="Rewards"
                    active={currentScreen === 'rewards'}
                    onPress={() => onNavigate('rewards')}
                />
                <NavButton
                    icon="person"
                    label="Profile"
                    active={currentScreen === 'profile'}
                    onPress={() => onNavigate('profile')}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: SPACING.lg,
        left: SPACING.md,
        right: SPACING.md,
        alignItems: 'center',
    },
    nav: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: COLORS.glassBg,
        borderRadius: RADIUS.lg,
        paddingVertical: SPACING.sm + 4,
        paddingHorizontal: SPACING.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 40,
        elevation: 10,
    },
    navButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.xs,
    },
    mainButton: {
        transform: [{ translateY: -4 }],
    },
    navLabel: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 4,
        fontWeight: '400',
    },
    navLabelActive: {
        color: COLORS.primary,
        fontWeight: '600',
    },
});

export default BottomNav;
