import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../utils/constants';


const OnboardingScreen = ({ onComplete, initialName }) => {
    const [step, setStep] = useState(initialName ? 2 : 1);
    const [name, setName] = useState(initialName || '');
    const [userType, setUserType] = useState('former_smoker'); // 'former_smoker' or 'current_vaper'
    const [cigarettesPerDay, setCigarettesPerDay] = useState('10');
    const [cigarettesPerPack, setCigarettesPerPack] = useState('20');
    const [packCost, setPackCost] = useState('15');
    const [dailyPuffGoal, setDailyPuffGoal] = useState('100');

    const handleNext = () => {
        if (!name.trim()) {
            alert('Please enter your name');
            return;
        }
        if (name.trim().length < 3) {
            alert('Name must be at least 3 characters long');
            return;
        }
        setStep(2);
    };

    const handleComplete = () => {
        onComplete({
            name: name.trim(),
            userType,
            cigarettesPerDay: parseInt(cigarettesPerDay) || 10,
            cigarettesPerPack: parseInt(cigarettesPerPack) || 20,
            packCost: parseFloat(packCost) || 15,
            dailyPuffGoal: parseInt(dailyPuffGoal) || 100,
        });
    };



    const renderStep1 = () => (
        <>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Image
                        source={require('../../assets/icon.png')}
                        style={{ width: 100, height: 100, resizeMode: 'contain' }}
                    />
                </View>
                <Text style={styles.title}>Welcome to VapeTrack</Text>
                <Text style={styles.missionText}>
                    Our mission is to help you track your habits, reduce nicotine intake, and save money on your journey to a smoke-free life.
                </Text>
            </View>

            <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                    <Ionicons name="stats-chart" size={24} color={COLORS.primary} />
                    <Text style={styles.featureText}>Track every puff & monitor usage</Text>
                </View>
                <View style={styles.featureItem}>
                    <Ionicons name="wallet" size={24} color={COLORS.success} />
                    <Text style={styles.featureText}>See how much money you save</Text>
                </View>
                <View style={styles.featureItem}>
                    <Ionicons name="trophy" size={24} color={COLORS.gold} />
                    <Text style={styles.featureText}>Earn XP & rewards for progress</Text>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>What should we call you?</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor={COLORS.textSecondary}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="#000" />
            </TouchableOpacity>

            {/* Login Link for Returning Users */}
            <TouchableOpacity
                style={styles.loginLink}
                onPress={() => {
                    // Skip onboarding for returning users - provide defaults
                    onComplete({
                        name: name.trim() || 'Guest',
                        cigarettesPerDay: 10,
                        cigarettesPerPack: 20,
                        packCost: 15,
                        currentVape: {
                            name: 'Pod System',
                            nicotine: 20,
                            size: 2,
                            type: 'Pod System',
                            cost: 25,
                        },
                        intent: 'login'
                    });
                }}
            >
                <Text style={styles.loginLinkText}>Already have an account? Login →</Text>
            </TouchableOpacity>
        </>
    );

    const renderStep2 = () => (
        <>
            <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
                <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <Text style={styles.title}>Nice to meet you, {name}!</Text>
            <Text style={styles.subtitle}>
                Help us understand your journey so we can track your progress accurately.
            </Text>

            {/* User Type Selection */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Which best describes you?</Text>
                <View style={styles.typeContainer}>
                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            userType === 'former_smoker' && styles.typeButtonActive
                        ]}
                        onPress={() => setUserType('former_smoker')}
                    >
                        <Ionicons
                            name="ban"
                            size={24}
                            color={userType === 'former_smoker' ? '#000' : COLORS.textSecondary}
                        />
                        <Text style={[
                            styles.typeButtonText,
                            userType === 'former_smoker' && styles.typeButtonTextActive
                        ]}>
                            Former Smoker
                        </Text>
                        <Text style={[
                            styles.typeButtonSubtext,
                            userType === 'former_smoker' && styles.typeButtonSubtextActive
                        ]}>
                            I switched from cigarettes to vaping
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            userType === 'current_vaper' && styles.typeButtonActive
                        ]}
                        onPress={() => setUserType('current_vaper')}
                    >
                        <Ionicons
                            name="cloud"
                            size={24}
                            color={userType === 'current_vaper' ? '#000' : COLORS.textSecondary}
                        />
                        <Text style={[
                            styles.typeButtonText,
                            userType === 'current_vaper' && styles.typeButtonTextActive
                        ]}>
                            Current Vaper
                        </Text>
                        <Text style={[
                            styles.typeButtonSubtext,
                            userType === 'current_vaper' && styles.typeButtonSubtextActive
                        ]}>
                            I want to reduce my vaping
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.form}>
                {userType === 'former_smoker' ? (
                    <>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Cigarettes per Day (before vaping)</Text>
                            <TextInput
                                style={styles.input}
                                value={cigarettesPerDay}
                                onChangeText={setCigarettesPerDay}
                                placeholder="10"
                                placeholderTextColor={COLORS.textSecondary}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Cigarettes per Pack</Text>
                            <TextInput
                                style={styles.input}
                                value={cigarettesPerPack}
                                onChangeText={setCigarettesPerPack}
                                placeholder="20"
                                placeholderTextColor={COLORS.textSecondary}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Pack Cost ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={packCost}
                                onChangeText={setPackCost}
                                placeholder="15"
                                placeholderTextColor={COLORS.textSecondary}
                                keyboardType="decimal-pad"
                            />
                        </View>
                    </>
                ) : (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Daily Puff Goal</Text>
                        <Text style={styles.inputHint}>
                            Set a target for how many puffs you want to take per day. We'll help you track your progress!
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={dailyPuffGoal}
                            onChangeText={setDailyPuffGoal}
                            placeholder="100"
                            placeholderTextColor={COLORS.textSecondary}
                            keyboardType="numeric"
                        />
                    </View>
                )}

                <TouchableOpacity style={styles.button} onPress={handleComplete}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {step === 1 ? renderStep1() : renderStep2()}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    iconContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    missionText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: SPACING.md,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xl * 1.5,
        lineHeight: 24,
    },
    featuresContainer: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.bgTertiary,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        gap: SPACING.md,
    },
    featureText: {
        fontSize: 15,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: SPACING.lg,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    input: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        fontSize: 16,
        color: COLORS.textPrimary,
        borderWidth: 1,
        borderColor: COLORS.bgTertiary,
    },
    inputHint: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
        lineHeight: 18,
    },
    typeContainer: {
        gap: SPACING.sm,
    },
    typeButton: {
        backgroundColor: COLORS.bgSecondary,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.bgTertiary,
        alignItems: 'center',
        gap: SPACING.xs,
    },
    typeButtonActive: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    typeButtonText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    typeButtonTextActive: {
        color: '#000',
        fontWeight: '700',
    },
    typeButtonSubtext: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    typeButtonSubtextActive: {
        color: '#000',
        opacity: 0.8,
    },
    button: {
        backgroundColor: COLORS.accent,
        borderRadius: RADIUS.md,
        padding: SPACING.md + 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.md,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5,
        gap: SPACING.sm,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: SPACING.lg,
        padding: SPACING.sm,
    },
    loginLink: {
        marginTop: SPACING.lg,
        padding: SPACING.sm,
        alignItems: 'center',
    },
    loginLinkText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
});

export default OnboardingScreen;
