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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SPACING } from '../utils/constants';

const OnboardingScreen = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [cigarettesPerDay, setCigarettesPerDay] = useState('10');
    const [cigarettesPerPack, setCigarettesPerPack] = useState('20');
    const [packCost, setPackCost] = useState('15');

    const handleContinue = () => {
        if (!name.trim()) {
            alert('Please enter your name');
            return;
        }

        onComplete({
            name: name.trim(),
            cigarettesPerDay: parseInt(cigarettesPerDay) || 10,
            cigarettesPerPack: parseInt(cigarettesPerPack) || 20,
            packCost: parseFloat(packCost) || 15,
        });
    };

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
                    <Text style={styles.title}>Welcome to VapeTrack</Text>
                    <Text style={styles.subtitle}>
                        Let's get started by learning a bit about you
                    </Text>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Your Name</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name"
                                placeholderTextColor={COLORS.textSecondary}
                            />
                        </View>

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

                        <TouchableOpacity style={styles.button} onPress={handleContinue}>
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
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
    title: {
        fontSize: 40,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xl * 2,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: SPACING.lg,
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
        alignItems: 'center',
        marginTop: SPACING.xl,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
});

export default OnboardingScreen;
