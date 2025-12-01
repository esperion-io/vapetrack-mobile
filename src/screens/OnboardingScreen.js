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


const OnboardingScreen = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [cigarettesPerDay, setCigarettesPerDay] = useState('10');
    const [cigarettesPerPack, setCigarettesPerPack] = useState('20');
    const [packCost, setPackCost] = useState('15');

    const handleNext = () => {
        if (!name.trim()) {
            alert('Please enter your name');
            return;
        }
        setStep(2);
    };

    const handleComplete = () => {
        onComplete({
            name: name.trim(),
            cigarettesPerDay: parseInt(cigarettesPerDay) || 10,
            cigarettesPerPack: parseInt(cigarettesPerPack) || 20,
            packCost: parseFloat(packCost) || 15,
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
        </>
    );

    const renderStep2 = () => (
        <>
            <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
                <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <Text style={styles.title}>Nice to meet you, {name}!</Text>
            <Text style={styles.subtitle}>
                To calculate your progress, we need to know a bit about your previous smoking habits.
            </Text>

            <View style={styles.form}>
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
});

export default OnboardingScreen;
