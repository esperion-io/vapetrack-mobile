import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Share,
    Clipboard,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { COLORS, RADIUS, SPACING } from '../utils/constants';

const REWARDS = [
    { id: 'icon_star', icon: '⭐' },
    { id: 'icon_fire', icon: '🔥' },
    { id: 'icon_cloud', icon: '☁️' },
    { id: 'icon_rainbow', icon: '🌈' },
    { id: 'icon_bear', icon: '🧸' },
    { id: 'icon_rocket', icon: '🚀' },
    { id: 'icon_gangster_bear', icon: '😎' },
    { id: 'icon_crown', icon: '👑' },
];

// Auth Form Component
const AuthForm = () => {
    const { signIn, signUp, clearData } = useUser();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async () => {
        setError(null);
        setSuccessMessage(null);
        setLoading(true);
        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                const result = await signUp(email, password, username);
                if (result.user && !result.session) {
                    setSuccessMessage('Account created! Please check your email (including spam folder) to confirm your account.');
                } else if (result.session) {
                    setSuccessMessage('Account created successfully! You are now logged in.');
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClearData = () => {
        Alert.alert(
            'Reset Local Guest Data',
            'Are you sure? This will delete all local data.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => clearData(),
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.authContainer}
            >
                <ScrollView
                    contentContainerStyle={styles.authScrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.authCard}>
                        <Text style={styles.authTitle}>
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </Text>

                        {error && (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        {successMessage && (
                            <View style={styles.successBox}>
                                <Text style={styles.successText}>{successMessage}</Text>
                            </View>
                        )}

                        {!isLogin && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Username</Text>
                                <View style={styles.inputWithIcon}>
                                    <Ionicons name="person" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.authInput}
                                        value={username}
                                        onChangeText={setUsername}
                                        placeholder="Username"
                                        placeholderTextColor={COLORS.textSecondary}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <View style={styles.inputWithIcon}>
                                <Ionicons name="mail" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.authInput}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="name@example.com"
                                    placeholderTextColor={COLORS.textSecondary}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <View style={styles.inputWithIcon}>
                                <Ionicons name="lock-closed" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.authInput}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                    placeholderTextColor={COLORS.textSecondary}
                                    secureTextEntry
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.authButton, loading && styles.authButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <Text style={styles.authButtonText}>
                                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                            </Text>
                            {!loading && <Ionicons name="arrow-forward" size={18} color="#fff" />}
                        </TouchableOpacity>

                        <View style={styles.switchAuthContainer}>
                            <Text style={styles.switchAuthText}>
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                            </Text>
                            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                                <Text style={styles.switchAuthLink}>
                                    {isLogin ? 'Sign Up' : 'Sign In'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />

                        <TouchableOpacity onPress={handleClearData}>
                            <Text style={styles.resetLink}>Reset Local Guest Data</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// Main Profile Screen Component
const ProfileScreen = () => {
    const { user, session, updateUser, signOut, clearData, equippedRewards, toggleSmokeFree } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name || '');
    const [cigsPerDay, setCigsPerDay] = useState(String(user.cigarettesPerDay || ''));
    const [cigsPerPack, setCigsPerPack] = useState(String(user.cigarettesPerPack || ''));
    const [packCost, setPackCost] = useState(String(user.packCost || ''));
    const [smokeFreeTime, setSmokeFreeTime] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    // Local state for vape details
    const [vapeName, setVapeName] = useState(user.currentVape?.name || '');
    const [vapeSize, setVapeSize] = useState(String(user.currentVape?.size || ''));
    const [vapeNicotine, setVapeNicotine] = useState(String(user.currentVape?.nicotine || ''));
    const [vapeCost, setVapeCost] = useState(String(user.currentVape?.cost || ''));

    // If no session, show auth form
    if (!session) {
        return <AuthForm />;
    }

    // Update smoke-free timer
    useEffect(() => {
        if (!user.isSmokeFree || !user.smokeFreeStartTime) return;

        const updateTimer = () => {
            const start = new Date(user.smokeFreeStartTime);
            const now = new Date();
            const diff = now - start;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (days > 0) {
                setSmokeFreeTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else if (hours > 0) {
                setSmokeFreeTime(`${hours}h ${minutes}m ${seconds}s`);
            } else {
                setSmokeFreeTime(`${minutes}m ${seconds}s`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [user.isSmokeFree, user.smokeFreeStartTime]);

    const shareMessage = `🎉 I've been smoke-free for ${smokeFreeTime}! Join me on my journey with VapeTrack! 💪`;

    const handleShare = async (platform) => {
        if (platform === 'copy') {
            Clipboard.setString(shareMessage);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } else {
            try {
                await Share.share({
                    message: shareMessage,
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleSave = () => {
        updateUser({
            name,
            cigarettesPerDay: parseInt(cigsPerDay) || 0,
            cigarettesPerPack: parseInt(cigsPerPack) || 0,
            packCost: parseFloat(packCost) || 0,
            currentVape: {
                ...user.currentVape,
                name: vapeName,
                size: parseFloat(vapeSize) || 0,
                nicotine: parseFloat(vapeNicotine) || 0,
                cost: parseFloat(vapeCost) || 0,
            },
        });
        setIsEditing(false);
    };

    const toggleEdit = () => {
        if (isEditing) {
            handleSave();
        } else {
            // Sync local state with current user data before editing
            setName(user.name || '');
            setCigsPerDay(String(user.cigarettesPerDay || ''));
            setCigsPerPack(String(user.cigarettesPerPack || ''));
            setPackCost(String(user.packCost || ''));
            setVapeName(user.currentVape?.name || '');
            setVapeSize(String(user.currentVape?.size || ''));
            setVapeNicotine(String(user.currentVape?.nicotine || ''));
            setVapeCost(String(user.currentVape?.cost || ''));
            setIsEditing(true);
        }
    };

    const handleSignOut = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => await signOut(),
                },
            ]
        );
    };

    const equippedIcon = equippedRewards.icon
        ? REWARDS.find(r => r.id === equippedRewards.icon)?.icon
        : null;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Golden Smoke-Free Button */}
                {!user.isSmokeFree && (
                    <TouchableOpacity style={styles.goldenButton} onPress={toggleSmokeFree}>
                        <Text style={styles.goldenButtonText}>✨ I HAVE STOPPED SMOKING ✨</Text>
                    </TouchableOpacity>
                )}

                {/* Profile Card */}
                <View style={[styles.profileCard, user.isSmokeFree && styles.profileCardGolden]}>
                    <View
                        style={[
                            styles.avatar,
                            user.isSmokeFree && styles.avatarGolden,
                            equippedRewards.border === 'border_gold' && styles.avatarBorderGold,
                            equippedRewards.border === 'border_rainbow' && styles.avatarBorderRainbow,
                        ]}
                    >
                        {equippedIcon ? (
                            <Text style={styles.avatarIcon}>{equippedIcon}</Text>
                        ) : (
                            <Ionicons
                                name="person"
                                size={40}
                                color={user.isSmokeFree ? '#000' : COLORS.textSecondary}
                            />
                        )}
                    </View>

                    <Text style={[styles.profileName, user.isSmokeFree && styles.textGolden]}>
                        {user.name}
                    </Text>
                    <Text style={[styles.profileEmail, user.isSmokeFree && styles.textGoldenSecondary]}>
                        {user.email || 'No email linked'}
                    </Text>

                    {user.isSmokeFree && (
                        <>
                            <View style={styles.championBadge}>
                                <Text style={styles.championText}>🎉 SMOKE-FREE CHAMPION 🎉</Text>
                            </View>

                            {/* XP Display */}
                            <View style={styles.xpDisplay}>
                                <Text style={styles.xpLabel}>TOTAL XP</Text>
                                <Text style={styles.xpValue}>{user.xp} XP</Text>
                                <Text style={styles.xpLevel}>Level {Math.floor(user.xp / 1000) + 1}</Text>
                            </View>

                            {/* Smoke-Free Timer */}
                            <View style={styles.timerDisplay}>
                                <Text style={styles.timerLabel}>SMOKE-FREE FOR</Text>
                                <Text style={styles.timerValue}>{smokeFreeTime}</Text>
                            </View>

                            {/* Social Sharing */}
                            <View style={styles.shareContainer}>
                                <Text style={styles.shareLabel}>SHARE YOUR SUCCESS</Text>
                                <View style={styles.shareButtons}>
                                    <TouchableOpacity style={styles.shareButton} onPress={() => handleShare('share')}>
                                        <Ionicons name="share-social" size={16} color="#fff" />
                                        <Text style={styles.shareButtonText}>Share</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.shareButton, styles.copyButton, copySuccess && styles.copyButtonSuccess]}
                                        onPress={() => handleShare('copy')}
                                    >
                                        <Ionicons name="copy" size={16} color="#fff" />
                                        <Text style={styles.shareButtonText}>{copySuccess ? 'Copied!' : 'Copy'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}
                </View>

                {/* Settings Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Settings</Text>
                        {!isEditing && (
                            <TouchableOpacity onPress={toggleEdit}>
                                <Text style={styles.editButton}>Edit</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Display Name</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.inputDisabled]}
                            value={name}
                            onChangeText={setName}
                            editable={isEditing}
                            placeholderTextColor={COLORS.textSecondary}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                            style={[styles.input, styles.inputDisabled]}
                            value={user.email || 'Not linked'}
                            editable={false}
                            placeholderTextColor={COLORS.textSecondary}
                        />
                    </View>
                </View>

                {/* Vape Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Vape</Text>
                        {!isEditing && user.currentVape?.name && (
                            <View style={styles.vapeBadge}>
                                <Text style={styles.vapeBadgeText}>{user.currentVape.name}</Text>
                            </View>
                        )}
                    </View>

                    {isEditing ? (
                        <View>
                            <Text style={styles.inputLabel}>Vape Type</Text>
                            <View style={styles.vapeTypeButtons}>
                                {['Pen', 'Pod', 'Tank'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.vapeTypeButton,
                                            vapeName === type && styles.vapeTypeButtonActive,
                                        ]}
                                        onPress={() => setVapeName(type)}
                                    >
                                        <Text
                                            style={[
                                                styles.vapeTypeButtonText,
                                                vapeName === type && styles.vapeTypeButtonTextActive,
                                            ]}
                                        >
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.inputRow}>
                                <View style={styles.inputHalf}>
                                    <Text style={styles.inputLabel}>Size (ml)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={vapeSize}
                                        onChangeText={setVapeSize}
                                        keyboardType="numeric"
                                        placeholderTextColor={COLORS.textSecondary}
                                    />
                                </View>
                                <View style={styles.inputHalf}>
                                    <Text style={styles.inputLabel}>Nicotine (mg)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={vapeNicotine}
                                        onChangeText={setVapeNicotine}
                                        keyboardType="numeric"
                                        placeholderTextColor={COLORS.textSecondary}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Cost ($)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={vapeCost}
                                    onChangeText={setVapeCost}
                                    keyboardType="numeric"
                                    placeholderTextColor={COLORS.textSecondary}
                                />
                            </View>
                        </View>
                    ) : (
                        user.currentVape?.size && (
                            <View style={styles.statsGrid}>
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>Size</Text>
                                    <Text style={styles.statValue}>{user.currentVape.size}ml</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>Nicotine</Text>
                                    <Text style={styles.statValue}>{user.currentVape.nicotine}mg</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>Cost</Text>
                                    <Text style={styles.statValue}>${user.currentVape.cost}</Text>
                                </View>
                            </View>
                        )
                    )}
                </View>

                {/* Cigarette Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Cigarette</Text>

                    {isEditing ? (
                        <View>
                            <View style={styles.inputRow}>
                                <View style={styles.inputHalf}>
                                    <Text style={styles.inputLabel}>Per Day</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={cigsPerDay}
                                        onChangeText={setCigsPerDay}
                                        keyboardType="numeric"
                                        placeholderTextColor={COLORS.textSecondary}
                                    />
                                </View>
                                <View style={styles.inputHalf}>
                                    <Text style={styles.inputLabel}>Per Pack</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={cigsPerPack}
                                        onChangeText={setCigsPerPack}
                                        keyboardType="numeric"
                                        placeholderTextColor={COLORS.textSecondary}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Pack Cost ($)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={packCost}
                                    onChangeText={setPackCost}
                                    keyboardType="numeric"
                                    placeholderTextColor={COLORS.textSecondary}
                                />
                            </View>
                        </View>
                    ) : (
                        <View style={styles.statsGrid}>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>Per Day</Text>
                                <Text style={styles.statValue}>{user.cigarettesPerDay} cigs</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>Per Pack</Text>
                                <Text style={styles.statValue}>{user.cigarettesPerPack} cigs</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>Pack Cost</Text>
                                <Text style={styles.statValue}>${user.packCost}</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Save Button */}
                {isEditing && (
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                )}

                {/* Sign Out Button */}
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
                    <Text style={styles.signOutButtonText}>Sign Out</Text>
                </TouchableOpacity>
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
    // Auth Form Styles
    authContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    authScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: SPACING.lg,
    },
    authCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        padding: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.bgTertiary,
    },
    authTitle: {
        fontSize: 29,
        fontWeight: '800',
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    errorBox: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
        marginBottom: SPACING.md,
    },
    errorText: {
        fontSize: 14,
        color: COLORS.danger,
    },
    successBox: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
        marginBottom: SPACING.md,
    },
    successText: {
        fontSize: 14,
        color: COLORS.success,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    inputIcon: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
    },
    authInput: {
        flex: 1,
        paddingVertical: SPACING.sm + 4,
        paddingLeft: 40,
        paddingRight: SPACING.sm + 4,
        backgroundColor: COLORS.bgPrimary,
        borderWidth: 1,
        borderColor: COLORS.bgTertiary,
        borderRadius: RADIUS.sm,
        color: COLORS.textPrimary,
        fontSize: 16,
    },
    authButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        marginTop: SPACING.md,
        padding: 14,
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.sm,
    },
    authButtonDisabled: {
        opacity: 0.7,
    },
    authButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    switchAuthContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.lg,
    },
    switchAuthText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    switchAuthLink: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.accent,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.bgTertiary,
        marginVertical: SPACING.xl,
    },
    resetLink: {
        fontSize: 13,
        color: COLORS.textSecondary,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    // Profile Styles (keeping all previous styles)
    goldenButton: {
        width: '100%',
        padding: SPACING.lg + 4,
        marginBottom: SPACING.xl,
        backgroundColor: '#FFD700',
        borderRadius: RADIUS.md,
        borderWidth: 2,
        borderColor: '#FFD700',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 10,
    },
    goldenButtonText: {
        fontSize: 19,
        fontWeight: '800',
        color: '#000',
        textAlign: 'center',
        letterSpacing: 1,
    },
    profileCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        padding: SPACING.xl,
        marginBottom: SPACING.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.bgTertiary,
    },
    profileCardGolden: {
        backgroundColor: '#FFD700',
        borderWidth: 3,
        borderColor: '#FFD700',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 15,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.bgTertiary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    avatarGolden: {
        backgroundColor: '#FFA500',
    },
    avatarBorderGold: {
        borderWidth: 3,
        borderColor: 'gold',
        shadowColor: 'gold',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 5,
    },
    avatarBorderRainbow: {
        borderWidth: 3,
        borderColor: '#FF0080',
    },
    avatarIcon: {
        fontSize: 40,
    },
    profileName: {
        fontSize: 19,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    profileEmail: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    textGolden: {
        color: '#000',
    },
    textGoldenSecondary: {
        color: 'rgba(0,0,0,0.7)',
    },
    championBadge: {
        marginTop: SPACING.md,
        padding: SPACING.md,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: RADIUS.sm,
    },
    championText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
    },
    xpDisplay: {
        marginTop: SPACING.md,
        padding: SPACING.md,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        borderRadius: RADIUS.sm,
        width: '100%',
        alignItems: 'center',
    },
    xpLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000',
        opacity: 0.8,
        marginBottom: SPACING.xs,
    },
    xpValue: {
        fontSize: 29,
        fontWeight: '800',
        color: '#000',
    },
    xpLevel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000',
        opacity: 0.7,
        marginTop: SPACING.xs,
    },
    timerDisplay: {
        marginTop: SPACING.md,
        padding: SPACING.lg,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: RADIUS.sm,
        width: '100%',
        alignItems: 'center',
    },
    timerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: SPACING.sm,
    },
    timerValue: {
        fontSize: 32,
        fontWeight: '800',
        color: '#000',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    shareContainer: {
        marginTop: SPACING.md,
        padding: SPACING.md,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: RADIUS.sm,
        width: '100%',
    },
    shareLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: SPACING.sm + 4,
        textAlign: 'center',
    },
    shareButtons: {
        flexDirection: 'row',
        gap: SPACING.sm,
        justifyContent: 'center',
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: SPACING.md,
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.sm,
    },
    copyButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    copyButtonSuccess: {
        backgroundColor: COLORS.success,
    },
    shareButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    card: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.bgTertiary,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    editButton: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.accent,
    },
    inputGroup: {
        marginBottom: SPACING.md,
    },
    inputLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    input: {
        width: '100%',
        padding: SPACING.sm + 4,
        backgroundColor: COLORS.bgPrimary,
        borderWidth: 1,
        borderColor: COLORS.bgTertiary,
        borderRadius: RADIUS.sm,
        color: COLORS.textPrimary,
        fontSize: 16,
    },
    inputDisabled: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        opacity: 0.7,
    },
    vapeBadge: {
        backgroundColor: 'rgba(46, 140, 255, 0.1)',
        paddingVertical: 4,
        paddingHorizontal: SPACING.sm + 4,
        borderRadius: RADIUS.sm,
    },
    vapeBadgeText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
    vapeTypeButtons: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: SPACING.md,
    },
    vapeTypeButton: {
        flex: 1,
        padding: SPACING.sm + 4,
        backgroundColor: COLORS.bgTertiary,
        borderRadius: RADIUS.sm,
        alignItems: 'center',
    },
    vapeTypeButtonActive: {
        backgroundColor: COLORS.primary,
    },
    vapeTypeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    vapeTypeButtonTextActive: {
        color: '#fff',
    },
    inputRow: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    inputHalf: {
        flex: 1,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 10,
        marginTop: SPACING.md,
    },
    statBox: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
        padding: 10,
        borderRadius: RADIUS.sm,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    saveButton: {
        width: '100%',
        padding: SPACING.md,
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        marginBottom: SPACING.md,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        width: '100%',
        padding: SPACING.md,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: RADIUS.md,
    },
    signOutButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.danger,
    },
});

export default ProfileScreen;
