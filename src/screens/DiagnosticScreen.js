import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Share,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { useUser } from '../context/UserContext';
import { COLORS, RADIUS, SPACING } from '../utils/constants';

const DiagnosticScreen = ({ onClose }) => {
    const { user, logs, session } = useUser();
    const [diagnosticData, setDiagnosticData] = useState({});
    const [storageData, setStorageData] = useState({});

    useEffect(() => {
        loadDiagnosticData();
    }, []);

    const loadDiagnosticData = async () => {
        try {
            // Get device info
            const deviceInfo = {
                brand: Device.brand,
                manufacturer: Device.manufacturer,
                modelName: Device.modelName,
                osName: Device.osName,
                osVersion: Device.osVersion,
                platformApiLevel: Device.platformApiLevel,
                deviceYearClass: Device.deviceYearClass,
            };

            // Get app info
            const appInfo = {
                name: Application.applicationName,
                version: Application.nativeApplicationVersion,
                buildVersion: Application.nativeBuildVersion,
                bundleId: Application.applicationId,
            };

            // Get storage data
            const keys = await AsyncStorage.getAllKeys();
            const stores = await AsyncStorage.multiGet(keys);
            const storage = {};
            stores.forEach(([key, value]) => {
                if (key.startsWith('vapetrack_')) {
                    try {
                        storage[key] = JSON.parse(value);
                    } catch {
                        storage[key] = value;
                    }
                }
            });

            setDiagnosticData({
                device: deviceInfo,
                app: appInfo,
                user: {
                    id: session?.user?.id || 'Not logged in',
                    email: user.email || 'No email',
                    name: user.name,
                    onboarded: !!user.onboardedAt,
                    hasVape: !!user.currentVape,
                },
                stats: {
                    totalPuffs: logs.length,
                    xp: user.xp,
                    isSmokeFree: user.isSmokeFree,
                },
            });

            setStorageData(storage);
        } catch (error) {
            console.error('Error loading diagnostic data:', error);
        }
    };

    const exportDiagnostics = async () => {
        const report = {
            timestamp: new Date().toISOString(),
            diagnostic: diagnosticData,
            storage: storageData,
            logs: logs.slice(-50), // Last 50 logs
        };

        const reportText = JSON.stringify(report, null, 2);

        try {
            await Share.share({
                message: reportText,
                title: 'VapeTrack Diagnostic Report',
            });
        } catch (error) {
            console.error('Error sharing diagnostics:', error);
        }
    };

    const clearAllData = async () => {
        if (Platform.OS === 'web') {
            if (window.confirm('⚠️ This will delete ALL app data. Are you sure?')) {
                await AsyncStorage.clear();
                alert('All data cleared. Please restart the app.');
            }
        } else {
            // Use Alert for mobile
            const { Alert } = require('react-native');
            Alert.alert(
                'Clear All Data',
                '⚠️ This will delete ALL app data. Are you sure?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete Everything',
                        style: 'destructive',
                        onPress: async () => {
                            await AsyncStorage.clear();
                            Alert.alert('Success', 'All data cleared. Please restart the app.');
                        },
                    },
                ]
            );
        }
    };

    const InfoSection = ({ title, data }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {Object.entries(data).map(([key, value]) => (
                <View key={key} style={styles.row}>
                    <Text style={styles.label}>{key}:</Text>
                    <Text style={styles.value} numberOfLines={1}>
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </Text>
                </View>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>🔧 Diagnostics</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Device Info */}
                {diagnosticData.device && (
                    <InfoSection title="📱 Device" data={diagnosticData.device} />
                )}

                {/* App Info */}
                {diagnosticData.app && (
                    <InfoSection title="📦 App" data={diagnosticData.app} />
                )}

                {/* User Info */}
                {diagnosticData.user && (
                    <InfoSection title="👤 User" data={diagnosticData.user} />
                )}

                {/* Stats */}
                {diagnosticData.stats && (
                    <InfoSection title="📊 Stats" data={diagnosticData.stats} />
                )}

                {/* Storage Keys */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💾 Storage</Text>
                    {Object.keys(storageData).map(key => (
                        <Text key={key} style={styles.storageKey}>
                            {key}
                        </Text>
                    ))}
                </View>

                {/* Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚡ Actions</Text>

                    <TouchableOpacity style={styles.actionButton} onPress={exportDiagnostics}>
                        <Ionicons name="share-outline" size={20} color={COLORS.primary} />
                        <Text style={styles.actionButtonText}>Export Diagnostic Report</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={loadDiagnosticData}>
                        <Ionicons name="refresh-outline" size={20} color={COLORS.primary} />
                        <Text style={styles.actionButtonText}>Refresh Data</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.dangerButton]}
                        onPress={clearAllData}
                    >
                        <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
                        <Text style={[styles.actionButtonText, styles.dangerText]}>
                            Clear All Data
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Instructions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ℹ️ Instructions</Text>
                    <Text style={styles.instructionText}>
                        • Export this report when reporting bugs{'\n'}
                        • Share with developers for troubleshooting{'\n'}
                        • Contains device, app, and user data{'\n'}
                        • No sensitive information is included
                    </Text>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.bgTertiary,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    closeButton: {
        padding: SPACING.sm,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
    },
    section: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginTop: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.bgTertiary,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.xs,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.bgTertiary,
    },
    label: {
        fontSize: 13,
        color: COLORS.textSecondary,
        fontWeight: '600',
        flex: 1,
    },
    value: {
        fontSize: 13,
        color: COLORS.textPrimary,
        flex: 2,
        textAlign: 'right',
    },
    storageKey: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        paddingVertical: SPACING.xs,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bgPrimary,
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
        marginTop: SPACING.sm,
        gap: SPACING.sm,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
    dangerButton: {
        borderWidth: 1,
        borderColor: COLORS.danger,
    },
    dangerText: {
        color: COLORS.danger,
    },
    instructionText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
});

export default DiagnosticScreen;
