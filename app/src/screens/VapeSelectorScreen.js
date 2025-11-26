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

const VapeSelectorScreen = ({ onSelect }) => {
    const [vapeName, setVapeName] = useState('');
    const [nicotine, setNicotine] = useState('20');
    const [size, setSize] = useState('2');
    const [cost, setCost] = useState('25');

    const handleContinue = () => {
        if (!vapeName.trim()) {
            alert('Please enter your vape name');
            return;
        }

        onSelect({
            name: vapeName.trim(),
            nicotine: parseInt(nicotine) || 20,
            size: parseFloat(size) || 2,
            type: 'Pod',
            cost: parseFloat(cost) || 25,
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
                    <Text style={styles.title}>Select Your Vape</Text>
                    <Text style={styles.subtitle}>
                        Tell us about your current vape device
                    </Text>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Vape Name/Brand</Text>
                            <TextInput
                                style={styles.input}
                                value={vapeName}
                                onChangeText={setVapeName}
                                placeholder="e.g., JUUL, Vuse, etc."
                                placeholderTextColor={COLORS.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nicotine Strength (mg/mL)</Text>
                            <TextInput
                                style={styles.input}
                                value={nicotine}
                                onChangeText={setNicotine}
                                placeholder="20"
                                placeholderTextColor={COLORS.textSecondary}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Bottle/Pod Size (mL)</Text>
                            <TextInput
                                style={styles.input}
                                value={size}
                                onChangeText={setSize}
                                placeholder="2"
                                placeholderTextColor={COLORS.textSecondary}
                                keyboardType="decimal-pad"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Cost per Bottle/Pod ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={cost}
                                onChangeText={setCost}
                                placeholder="25"
                                placeholderTextColor={COLORS.textSecondary}
                                keyboardType="decimal-pad"
                            />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleContinue}>
                            <Text style={styles.buttonText}>Start Tracking</Text>
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

export default VapeSelectorScreen;
